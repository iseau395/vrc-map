import { MovableObject } from "./object";
import { FIELD_SCALE } from "../../util/constants";

export default class Robot extends MovableObject {
    rotate_step = 10;

    type = "robot";

    private width = 45.72 * FIELD_SCALE;
    private height = 45.72 * FIELD_SCALE;

    constructor(x: number, y: number) {
        super(x, y, 0);
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    pointInside(x: number, y: number): boolean {
        return x > this.x - this.width / 2 &&
               y > this.y - this.height / 2 &&
               x < this.x + this.width / 2 &&
               y < this.y + this.height / 2;
    }
}