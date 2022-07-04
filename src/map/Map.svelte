<script lang="ts">
    import { onMount, onDestroy, getContext } from "svelte";
    import { CursorType, type GameType } from "../util/constants";
    import { get_game } from "../games/game";
    import { use_grid } from "../components/settings/settings";

    import InputControllerClass from "../field/input";
    import FieldRendererClass from "../field/field-renderer";
    import GridClass from "../field/grid";
    import PathClass from "../paths/basic_path";

    import { save_data } from "./save";
    import type { SaveData } from "./save";

    let background_canvas: HTMLCanvasElement;
    let forground_canvas: HTMLCanvasElement;

    const game = getContext(Symbol.for("game")) as GameType;

    let interval: NodeJS.Timeout;
    let animationFrame: number;

    if (isProduction)
        window.onbeforeunload = function() {
            return true;
        };

    let _save: (slot: string) => void;
    export const save = (slot: string) => {
        if (_save)
            _save(slot);
        else throw new Error("Save not defined yet");
    }

    let _load: (slot: string) => void;
    export const load = (slot: string) => {
        if (_load)
            _load(slot);
        else throw new Error("Load not defined yet");
    }

    onMount(async () => {
        const background_ctx = background_canvas.getContext("2d", {
            alpha: false
        });
        const forground_ctx = forground_canvas.getContext("2d", {
            alpha: true
        });

        const InputController = new InputControllerClass(forground_canvas);
        const FieldRenderer = new FieldRendererClass(window.innerWidth, window.innerHeight - 50);
        const Grid = new GridClass();
        const GameRenderer = await get_game(game);
        const Path = new PathClass();

        _save = (slot) =>
            save_data(slot, game, GameRenderer.saveData(), Path.saveData());

        _load = (slot) => {
            const data = JSON.parse(localStorage.getItem(`slot-${game}-${slot}`)) as SaveData;

            if (!data)
                alert("Unable to find slot! make sure you spelt the name right, and you have the right game selected!")
            if (data.g != game)
                throw new Error("Incompatable game type");
            if (data.v != 0)
                throw new Error("Unknown save version");

            console.log(data.d[0]);

            GameRenderer.loadData(data.d[0]);
            Path.loadData(data.d[1]);
        }

        function setCursor(cursor: CursorType) {
            switch (cursor) {
                case CursorType.POINTER:
                    forground_canvas.style.cursor = "pointer";
                    break;
                case CursorType.GRAB:
                    forground_canvas.style.cursor = "grab";
                    break;
                case CursorType.GRABBING:
                    forground_canvas.style.cursor = "grabbing";
                    break;
                case CursorType.ZOOM_IN:
                    forground_canvas.style.cursor = "zoom-in";
                    break;
                case CursorType.ZOOM_OUT:
                    forground_canvas.style.cursor = "zoom-out";
                    break;
                case CursorType.PAN:
                    forground_canvas.style.cursor = "move";
                    break;
            }
        }
        
        function resize() {
            background_canvas.width = window.innerWidth;
            background_canvas.height = window.innerHeight - 50;
            forground_canvas.width = window.innerWidth;
            forground_canvas.height = window.innerHeight - 50;

            render(forground_ctx, background_ctx, true, true);
        }

        window.addEventListener("resize", resize);

        function render(forground_ctx: CanvasRenderingContext2D, background_ctx: CanvasRenderingContext2D, offset: boolean, once: boolean) {
            const changed = FieldRenderer.changed();

            if (changed || once) {
                background_ctx.fillStyle = "rgb(80, 80, 80)"
                background_ctx.fillRect(0, 0, background_canvas.width, background_canvas.height);

                background_ctx.save();

                FieldRenderer.translate(background_ctx);
                FieldRenderer.render(background_ctx);

                GameRenderer.render_static(background_ctx);

                background_ctx.restore();
            }

            forground_ctx.clearRect(0, 0, forground_canvas.width, forground_canvas.height);

            forground_ctx.save();
            if (offset)
                FieldRenderer.translate(forground_ctx);

            GameRenderer.render(forground_ctx);

            Path.render(forground_ctx);

            forground_ctx.restore();

            if ($use_grid)
                Grid.render(
                    forground_ctx,
                    FieldRenderer.x(),
                    FieldRenderer.y(),
                    FieldRenderer.zoom()
                )

            if (!once)
                animationFrame = requestAnimationFrame(() => render(forground_ctx, background_ctx, offset, false));
        }

        let toggled_grid = false;

        async function tick() {
            forground_canvas.style.cursor = "wait";

            const mouseX = (InputController.mouseX - FieldRenderer.x()) / FieldRenderer.zoom();
            const mouseY = (InputController.mouseY - FieldRenderer.y()) / FieldRenderer.zoom();

            if (InputController.keyPressed("KeyG") && !toggled_grid) {
                $use_grid = !$use_grid;
                toggled_grid = true
            } else if (!InputController.keyPressed("KeyG")) {
                toggled_grid = false;
            }


            const [snappedMouseX, snappedMouseY] = 
                $use_grid ?
                Grid.snap(mouseX, mouseY) :
                [mouseX, mouseY];



            FieldRenderer.tick(
                InputController.dragX,
                InputController.dragY,
                InputController.zoom
            );

            if (!GameRenderer.hasSelection())
                Path.tick(
                        mouseX,
                        mouseY,
                        snappedMouseX,
                        snappedMouseY,
                        InputController.mouseButton,
                        InputController.shiftKey,
                        InputController.ctrlKey,
                        InputController.deltaScroll
                    )

            if (!InputController.altKey && !Path.hasSelection())
                GameRenderer.tick(
                    mouseX,
                    mouseY,
                    snappedMouseX,
                    snappedMouseY,
                    InputController.mouseButton,
                    InputController.shiftKey,
                    InputController.ctrlKey,
                    InputController.deltaScroll
                );

            forground_canvas.style.cursor = "default";
            const field_cursor = FieldRenderer.getCursor(InputController.altKey);
            const game_cursor = GameRenderer.getCursor(mouseX, mouseY);
            const path_cursor = game_cursor != CursorType.GRABBING ? Path.getCursor(mouseX, mouseY) : CursorType.NORMAL;

            setCursor(field_cursor);
            setCursor(game_cursor);
            setCursor(path_cursor);
        }

        interval = setInterval(tick, 20);
        tick();
        resize();
        render(forground_ctx, background_ctx, true, false);
    });

    onDestroy(() => {
        clearInterval(interval);
        cancelAnimationFrame(animationFrame);
    });
</script>

<canvas bind:this={background_canvas} style="z-index: -1;"></canvas>
<canvas bind:this={forground_canvas} style="z-index: 0;"></canvas>

<style>
    canvas {
        position: absolute;
        top: 50px;
        bottom: -50px;
        left: 0px;
        right: 0px;
        height: calc(100% - 50px);
        width: 100%;
    }
</style>