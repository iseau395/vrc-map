import type { GameRenderer } from "../generic/game-renderer";
import Mogo from "./gameobjects/mogo";
import Ring from "./gameobjects/ring";

import { CursorType, FIELD_SCALE, FIELD_SIDE } from "../../util/constants";
import { BLUE_ALLIANCE, LINE_COLOR, RED_ALLIANCE } from "../generic/colors";

export default class TippingPoint implements GameRenderer {
    private cache_ctx: CanvasRenderingContext2D;

    private selection = {
        arr: -1,
        index: -1
    };

    private mogos = [
        // Red Alliance Goals
        new Mogo(FIELD_SIDE/4, FIELD_SIDE/12 * 11, 90, 0),
        new Mogo(FIELD_SIDE/12, FIELD_SIDE/48 * 15, 0, 0),

        // Blue Alliance Goals
        new Mogo(FIELD_SIDE/4 * 3, FIELD_SIDE/12, 270, 1),
        new Mogo(FIELD_SIDE/12 * 11, FIELD_SIDE/48 * 33, 180, 1),

        // Neutral Goals
        new Mogo(FIELD_SIDE/2, FIELD_SIDE/4, 180, 2),
        new Mogo(FIELD_SIDE/2, FIELD_SIDE/4 * 2, 180, 2),
        new Mogo(FIELD_SIDE/2, FIELD_SIDE/4 * 3, 0, 2),
    ];
    private rings = [
        new Ring(50, 50, 0)
    ];

    private drawPlatform(x: number, y: number, color: CanvasRenderingContext2D["strokeStyle"], ctx: CanvasRenderingContext2D) {
        const longEdge = 134.62 * FIELD_SCALE;
        const shortEdge = 50.8 * FIELD_SCALE;

        x += (59.5 - 50.8 - 3.175) * FIELD_SCALE;
        y -= 8 * FIELD_SCALE;

        ctx.strokeStyle = color;
        ctx.lineCap = "butt";
        ctx.lineWidth = 4 * FIELD_SCALE;

        ctx.beginPath();

        ctx.moveTo(x + shortEdge / 9, y + longEdge / 8);
        ctx.lineTo(x + shortEdge - shortEdge / 9, y + longEdge / 8);
        ctx.lineTo(x + shortEdge - shortEdge / 9, y + (longEdge / 8) * 7);
        ctx.lineTo(x + shortEdge / 9, y + (longEdge / 8) * 7);
        ctx.lineTo(x + shortEdge / 9, y + longEdge / 8 - ctx.lineWidth / 2);

        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fillRect(x, y, shortEdge, longEdge);

        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 0.3 * FIELD_SCALE;

        ctx.beginPath();
        ctx.moveTo(x + shortEdge + 1, y);
        ctx.lineTo(x + shortEdge + 1, y + longEdge);

        ctx.moveTo(x - 1, y);
        ctx.lineTo(x - 1, y + longEdge);

        ctx.stroke();
    }

    private cache() {
        this.cache_ctx =
            document.createElement("canvas")
                .getContext("2d");
        this.cache_ctx.canvas.width = FIELD_SIDE;
        this.cache_ctx.canvas.height = FIELD_SIDE;

        this.cache_ctx.strokeStyle = LINE_COLOR;
        this.cache_ctx.lineWidth = 1.1 * FIELD_SCALE;
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

        this.drawPlatform(
            0,
            (FIELD_SIDE / 6) * 2,
            RED_ALLIANCE,
            this.cache_ctx
        );
        this.drawPlatform(
            (FIELD_SIDE / 6) * 5,
            (FIELD_SIDE / 6) * 2,
            BLUE_ALLIANCE,
            this.cache_ctx
        );
    }

    tick(mouseX: number, mouseY: number, snappedMouseX: number, snappedMouseY: number, mouseButton: number, shiftKey: boolean, ctrlKey: boolean, deltaScroll: number) {
        if (shiftKey && mouseButton == 0) {
            if (this.selection.arr == -1) {
                for (const mogo of this.mogos) {
                    if (mogo.pointInside(mouseX, mouseY)) {
                        this.selection.arr = 0;
                        this.selection.index = this.mogos.indexOf(mogo);

                        break;
                    }
                }
                
                for (const ring of this.rings) {
                    if (ring.pointInside(mouseX, mouseY)) {
                        this.selection.arr = 1;
                        this.selection.index = this.rings.indexOf(ring);

                        break;
                    }
                }
            }

            if (this.selection.arr == 0)
                this.mogos[this.selection.index]
                    .update(
                        snappedMouseX,
                        snappedMouseY,
                        deltaScroll
                    );

            if (this.selection.arr == 1)
                this.rings[this.selection.index]
                    .update(
                        snappedMouseX,
                        snappedMouseY,
                        deltaScroll
                    );
        } else {
            this.selection.arr = -1;
            this.selection.index = -1;
        }
    }

    getCursor(mouseX: number, mouseY: number): CursorType {
        if (this.has_selection())
            return CursorType.GRABBING;
        else {
            let pointInside = false;

            for (const mogo of this.mogos) {
                if (mogo.pointInside(mouseX, mouseY))
                    pointInside = true;
            }

            for (const ring of this.rings) {
                if (ring.pointInside(mouseX, mouseY))
                    pointInside = true;
            }

            if (pointInside)
                return CursorType.GRAB;
        }

        return CursorType.NORMAL;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.mogos.forEach(mogo => 
            mogo.render(
                ctx
            )
        );

        this.rings.forEach(ring => 
            ring.render(
                ctx
            )
        );
    }

    render_static(ctx: CanvasRenderingContext2D) {
        if (!this.cache_ctx) this.cache();

        ctx.drawImage(this.cache_ctx.canvas, 0, 0);
    }

    has_selection() {
        return this.selection.arr >= 0;
    }
}