import { RoundMovableObject } from "../games/generic/object";
import { CursorType, FIELD_SCALE } from "../util/constants";
import type { Renderable, Tickable } from "util/class-bases";

class Point extends RoundMovableObject {
    protected readonly diameter = 8.5;
    protected rotate_step = 1;

    render(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter/2 * FIELD_SCALE - 1.5 * FIELD_SCALE, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 1 * FIELD_SCALE;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter/2 * FIELD_SCALE, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
    }

    get_x() {
        return this.x;
    }

    get_y() {
        return this.y;
    }
}

type SaveData = {
    x: number,
    y: number
}[]

export default class BasicPath implements Renderable, Tickable {
    private cache_ctx: CanvasRenderingContext2D;

    private selection = -1
    private added_point = false;

    private points: Point[] = [];

    tick(mouseX: number, mouseY: number, snappedMouseX: number, snappedMouseY: number, mouseButton: number, shiftKey: boolean, ctrlKey: boolean, deltaScroll: number) {
        if (shiftKey && mouseButton == 0) {
            if (!this.hasSelection()) {
                for (const point of this.points) {
                    if (point.pointInside(mouseX, mouseY)) {
                        this.selection = this.points.indexOf(point);

                        break;
                    }
                }
            }

            if (this.hasSelection())
                this.points[this.selection]
                    .update(
                        snappedMouseX,
                        snappedMouseY,
                        deltaScroll
                    );
        } else {
            if (mouseButton == 2 && this.added_point == false) {
                this.points.push(new Point(snappedMouseX, snappedMouseY, 0));
                this.added_point = true;
            } else if (mouseButton != 2) {
                this.added_point = false;
            }

            this.selection = -1;
        }
    }

    saveData() {
        const data: SaveData = [];

        for (const point of this.points) {
            data.push({ x: point.get_x(), y: point.get_y() })
        }

        return data;
    }

    loadData(data: SaveData) {
        this.points.length = 0;

        for (const point of data) {
            this.points.push(
                new Point(point.x, point.y, 0)
            );
        }
    }

    getCursor(mouseX: number, mouseY: number): CursorType {
        if (this.hasSelection())
            return CursorType.GRABBING;
        else {
            let pointInside = false;

            for (const point of this.points) {
                if (point.pointInside(mouseX, mouseY))
                    pointInside = true;
            }

            if (pointInside)
                return CursorType.GRAB;
        }

        return CursorType.NORMAL;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.strokeStyle = "rgb(255, 0, 0)";
        ctx.lineWidth = 1 * FIELD_SCALE;

        ctx.beginPath()
        this.points.forEach((point, i) =>
            i == 0 ?
            ctx.moveTo(
                point.get_x(),
                point.get_y()
            ) :
            ctx.lineTo(
                point.get_x(),
                point.get_y()
            )
        );
        ctx.stroke();

        this.points.forEach(point => 
            point.render(
                ctx
            )
        );
    }

    hasSelection() {
        return this.selection >= 0;
    }
}