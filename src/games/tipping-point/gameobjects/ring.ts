import { RoundMovableObject } from "games/generic/object";
import { FIELD_SCALE } from "../../../util/constants";

export default class Ring extends RoundMovableObject {
    diameter = 5.23875;
    rotate_step = 1;

    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgb(200, 100, 200)";
        ctx.lineWidth = 2.6985 * FIELD_SCALE;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter/2 * FIELD_SCALE, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill;
    }
}