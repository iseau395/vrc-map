<script lang="ts">
    import { onMount, onDestroy, getContext } from "svelte";
    import type { GameType } from "../util/constants";

    let background_canvas: HTMLCanvasElement;
    let forground_canvas: HTMLCanvasElement;

    const game = getContext(Symbol.for("game")) as GameType;

    let fieldX = 10;
    let fieldY = 10;
    let fieldScale = 2;

    let interval: NodeJS.Timeout;
    let animationFrame: number;

    let redraw = true;

    onMount(async () => {
        const background_ctx = background_canvas.getContext("2d", {
            alpha: false
        });
        const forground_ctx = forground_canvas.getContext("2d", {
            alpha: true
        });

        const InputController = new (await import("../field/input")).default();
        const FieldRenderer = new (await import("../field/field-renderer")).default();

        const resize = () => {
            background_canvas.width = window.innerWidth;
            background_canvas.height = window.innerHeight - 50;
            forground_canvas.width = window.innerWidth;
            forground_canvas.height = window.innerHeight - 50;

            redraw = true;
            render();
        }

        window.addEventListener("resize", resize);
        resize();

        function render() {
            const changed = FieldRenderer.changed();

            if (changed || redraw) {
                background_ctx.fillStyle = "rgb(80, 80, 80)"
                background_ctx.fillRect(0, 0, background_canvas.width, background_canvas.height);

                background_ctx.save();

                FieldRenderer.translate(background_ctx);
                FieldRenderer.render(background_ctx);

                background_ctx.restore();

                redraw = false;
            }

            // forground_ctx.save();

            // FieldRenderer.translate(forground_ctx);

            // forground_ctx.restore();

            animationFrame = requestAnimationFrame(render);
        }

        function tick() {
            FieldRenderer.tick(
                InputController.dragX,
                InputController.dragY,
                InputController.zoom,
            );
        }

        interval = setInterval(tick, 10);
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