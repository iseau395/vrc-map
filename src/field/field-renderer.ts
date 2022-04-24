import { FIELD_SCALE, FIELD_SIDE } from "../util/constants";
import type { Tickable, Renderable } from "../util/class-bases";

export default class FieldRenderer implements Renderable, Tickable {
    private fieldX = 10;
    private fieldY = 10;
    private fieldZoom = 0.065;

    private prevFieldX = this.fieldX;
    private prevFieldY = this.fieldY;
    private prevFieldScale = this.fieldZoom;

    private cache_ctx: CanvasRenderingContext2D;

    tick(deltaX: number, deltaY: number, zoom: number) {
        this.fieldX += deltaX;
        this.fieldY += deltaY;
        this.fieldX = Math.floor(this.fieldX);
        this.fieldY = Math.floor(this.fieldY);

        this.fieldZoom *= zoom;
        this.fieldZoom = Math.min(Math.max(0.065*FIELD_SCALE, this.fieldZoom), 0.3*FIELD_SCALE );
    }

    translate(ctx: CanvasRenderingContext2D) {
        ctx.translate(this.fieldX, this.fieldY);
        ctx.scale(this.fieldZoom, this.fieldZoom);
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.cache_ctx) this.cache();

        ctx.drawImage(this.cache_ctx.canvas, 0, 0);
    }

    changed() {
        const changed =     this.fieldX != this.prevFieldX ||
                            this.fieldY != this.prevFieldY ||
                         this.fieldZoom != this.prevFieldScale;

        this.prevFieldX = this.fieldX;
        this.prevFieldY = this.fieldY;
        this.prevFieldScale = this.fieldZoom;

        return changed;
    }

    private cache() {
        this.cache_ctx =
            document.createElement("canvas")
            .getContext("2d");
        this.cache_ctx.canvas.width = FIELD_SIDE;
        this.cache_ctx.canvas.height = FIELD_SIDE;

        this.cache_ctx.fillStyle = "rgb(159, 159, 159)";
        this.cache_ctx.fillRect(0, 0, FIELD_SIDE, FIELD_SIDE);

        this.cache_ctx.beginPath();

        for (let i = 0; i < 6; i++) {
            this.cache_ctx.moveTo((FIELD_SIDE / 6) * (i+1), 0);
            this.cache_ctx.lineTo((FIELD_SIDE / 6) * (i+1), FIELD_SIDE);
        }
        for (let i = 0; i < 6; i++) {
            this.cache_ctx.moveTo(0         , (FIELD_SIDE / 6) * (i+1));
            this.cache_ctx.lineTo(FIELD_SIDE, (FIELD_SIDE / 6) * (i+1));
        }

        this.cache_ctx.strokeStyle = "rgba(100, 100, 100, 0.2)";
        this.cache_ctx.lineWidth = 1 * FIELD_SCALE;
        this.cache_ctx.stroke();
    }
}