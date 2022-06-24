import { RoundMovableObject } from "../games/generic/object";
import { FIELD_SCALE } from "../util/constants";

class Point extends RoundMovableObject {
    protected readonly diameter = 8.5;
    protected readonly rotate_step = 0;

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

export default class BasicPath {
    private cache_ctx: CanvasRenderingContext2D;

    private selection = -1
    private added_point = false;

    private points: Point[] = [];

    tick(mouseX: number, mouseY: number, snappedMouseX: number, snappedMouseY: number, mouseButton: number, shiftKey: boolean, ctrlKey: boolean, deltaScroll: number) {
        if (shiftKey && mouseButton == 0) {
            if (this.selection == -1) {
                for (const point of this.points) {
                    if (point.pointInside(mouseX, mouseY)) {
                        this.selection = this.points.indexOf(point);

                        break;
                    }
                }
            }

            this.points[this.selection]
                .update(
                    snappedMouseX,
                    snappedMouseY,
                    deltaScroll
                );
        } else {
            console.log(mouseButton);

            if (mouseButton == 2 && this.added_point == false) {
                this.points.push(new Point(snappedMouseX, snappedMouseY, 0));
                this.added_point = true;
            } else if (mouseButton != 2) {
                this.added_point = false;
            }

            this.selection = -1;
        }

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
}