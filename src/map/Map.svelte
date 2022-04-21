<script lang="ts">
    import { onMount, onDestroy, getContext } from "svelte";

    let canvas: HTMLCanvasElement;

    let fieldX = 10;
    let fieldY = 10;
    let fieldScale = 2;

    let interval: NodeJS.Timeout;
    let animationFrame: number;

    onMount(async () => {
        const ctx = canvas.getContext("2d", {
            alpha: false
        });

        const InputController = new (await import("../field/input")).default();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            render();
        }

        window.addEventListener("resize", resize);
        resize();

        function render() {
            ctx.fillStyle = "rgb(80, 80, 80)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save();

            ctx.translate(fieldX, fieldY + 50);
            ctx.scale(fieldScale, fieldScale);

            ctx.fillStyle = "rgb(159, 159, 159)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.lineWidth = 2;
            ctx.fillRect(0, 0, 357, 357);

            ctx.restore();

            animationFrame = requestAnimationFrame(render);
        }

        function tick() {
            fieldX += InputController.dragX;
            fieldY += InputController.dragY;

            const zoom = InputController.zoom;
            fieldScale *= zoom;
            fieldX /= zoom;
            fieldY /= zoom;
        }

        interval = setInterval(tick, 10);
    });

    onDestroy(() => {
        clearInterval(interval);
        cancelAnimationFrame(animationFrame);
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: absolute;
        z-index: -2;
        top: 50px;
        bottom: -50px;
        left: 0px;
        right: 0px;
        height: calc(100% - 50px);
        width: 100%;
    }
</style>