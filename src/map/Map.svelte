<script lang="ts">
    import { onMount, onDestroy, getContext } from "svelte";
    import type { GameType } from "../util/constants";
    import { get_game } from "../games/game";

    let background_canvas: HTMLCanvasElement;
    let forground_canvas: HTMLCanvasElement;

    const game = getContext(Symbol.for("game")) as GameType;

    let interval: NodeJS.Timeout;
    let animationFrame: number;

    let redraw = true;

    if (isProduction)
        window.onbeforeunload = function() {
            return true;
        };

    onMount(async () => {
        const background_ctx = background_canvas.getContext("2d", {
            alpha: false
        });
        const forground_ctx = forground_canvas.getContext("2d", {
            alpha: true
        });

        const InputController = new (await import("../field/input"))
            .default(forground_canvas);
        const FieldRenderer = new (await import("../field/field-renderer"))
            .default(window.innerWidth, window.innerHeight - 50);
        const GameRenderer = await get_game(game);

        const resize = () => {
            background_canvas.width = window.innerWidth;
            background_canvas.height = window.innerHeight - 50;
            forground_canvas.width = window.innerWidth;
            forground_canvas.height = window.innerHeight - 50;

            redraw = true;
            render();
        }

        window.addEventListener("resize", resize);

        function render() {
            const changed = FieldRenderer.changed();

            if (changed || redraw) {
                background_ctx.fillStyle = "rgb(80, 80, 80)"
                background_ctx.fillRect(0, 0, background_canvas.width, background_canvas.height);

                background_ctx.save();

                FieldRenderer.translate(background_ctx);
                FieldRenderer.render(background_ctx);

                GameRenderer.render_static(background_ctx);

                background_ctx.restore();

                redraw = false;
            }

            forground_ctx.clearRect(0, 0, forground_canvas.width, forground_canvas.height);

            forground_ctx.save();
            FieldRenderer.translate(forground_ctx);

            GameRenderer.render(forground_ctx);

            forground_ctx.restore();

            animationFrame = requestAnimationFrame(render);
        }

        function tick() {
            const mouseX = (InputController.mouseX - FieldRenderer.x) / FieldRenderer.zoom;
            const mouseY = (InputController.mouseY - FieldRenderer.y) / FieldRenderer.zoom;

            FieldRenderer.tick(
                InputController.dragX,
                InputController.dragY,
                InputController.zoom,
            );

            if (!InputController.altKey)
                GameRenderer.tick(
                    mouseX,
                    mouseY,
                    InputController.mouseButton,
                    InputController.shiftKey,
                    InputController.deltaScroll
                );
        }

        interval = setInterval(tick, 20);
        tick();
        resize();
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