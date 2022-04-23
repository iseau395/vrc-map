import type { GameRenderer } from "../game";
import { FIELD_SCALE, FIELD_SIDE } from "util/constants";
import { LINE_COLOR, RED_ALLIANCE, BLUE_ALLIANCE } from "./colors";

export default class TippingPoint implements GameRenderer {
    private cache_ctx: CanvasRenderingContext2D;

    private drawPlatform(x: number, y: number, color: CanvasRenderingContext2D["strokeStyle"], ctx: CanvasRenderingContext2D) {
        const longEdge = FIELD_SIDE / 3 - 6 * FIELD_SCALE;
        const shortEdge = FIELD_SIDE / 6 - 6 * FIELD_SCALE;

        x += 3 * FIELD_SCALE;
        y += 3 * FIELD_SCALE;

        ctx.strokeStyle = color;
        ctx.lineCap = "butt";
        ctx.lineWidth = 20;
    
        ctx.beginPath();
    
        ctx.moveTo(x + shortEdge / 10, y + longEdge / 8);
        ctx.lineTo(x + shortEdge - shortEdge / 10, y + longEdge / 8);
        ctx.lineTo(x + shortEdge - shortEdge / 10, y + (longEdge / 8) * 7);
        ctx.lineTo(x + shortEdge / 10, y + (longEdge / 8) * 7);
        ctx.lineTo(x + shortEdge / 10, y + longEdge / 8 - 10);
    
        ctx.stroke();
        ctx.closePath();
    
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fillRect(x, y, shortEdge, longEdge);
    
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 2;
    
        ctx.beginPath();
        ctx.moveTo(x + shortEdge + 1, y);
        ctx.lineTo(x + shortEdge + 1, y + longEdge);
    
        ctx.moveTo(x - 1, y);
        ctx.lineTo(x - 1, y + longEdge);
    
        ctx.stroke();
        ctx.closePath();
    }

    private cache() {
        this.cache_ctx =
            document.createElement("canvas")
            .getContext("2d");
        this.cache_ctx.canvas.width = FIELD_SIDE;
        this.cache_ctx.canvas.height = FIELD_SIDE;

        this.cache_ctx.strokeStyle = LINE_COLOR;
        this.cache_ctx.lineWidth = 5;
        this.cache_ctx.beginPath();
    
        this.cache_ctx.moveTo(FIELD_SIDE / 3, 0);
        this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE);
    
        this.cache_ctx.moveTo(FIELD_SIDE / 2 - 5, 0);
        this.cache_ctx.lineTo(FIELD_SIDE / 2 - 5, FIELD_SIDE);
        this.cache_ctx.moveTo(FIELD_SIDE / 2 + 5, 0);
        this.cache_ctx.lineTo(FIELD_SIDE / 2 + 5, FIELD_SIDE);
    
        this.cache_ctx.moveTo((FIELD_SIDE / 3) * 2, 0);
        this.cache_ctx.lineTo((FIELD_SIDE / 3) * 2, FIELD_SIDE);
    
        this.cache_ctx.moveTo((FIELD_SIDE / 6) * 4, FIELD_SIDE / 6);
        this.cache_ctx.lineTo((FIELD_SIDE / 6) * 5, 0);
    
        this.cache_ctx.moveTo((FIELD_SIDE / 6) * 2, (FIELD_SIDE / 6) * 5);
        this.cache_ctx.lineTo((FIELD_SIDE / 6) * 1, FIELD_SIDE);
    
        this.cache_ctx.stroke();
    
        this.drawPlatform(0, (FIELD_SIDE / 6) * 2, RED_ALLIANCE, this.cache_ctx);
        this.drawPlatform(
            (FIELD_SIDE / 6) * 5,
            (FIELD_SIDE / 6) * 2,
            BLUE_ALLIANCE,
            this.cache_ctx
        );
    }

    tick(mouseX: number, mouseY: number, mouseButton: number) {

    }

    render(ctx: CanvasRenderingContext2D) {

    }

    render_static(ctx: CanvasRenderingContext2D) {
        if (!this.cache_ctx) this.cache();

        ctx.drawImage(this.cache_ctx.canvas, 0, 0);
    }
}