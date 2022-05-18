import { RoundMovableGameobject } from "games/generic/gameobject";
import { FIELD_SCALE } from "util/constants";

export default class Disk extends RoundMovableGameobject {
    diameter = 14;
    rotate_step = 1;

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgb(232, 212, 33)";
        ctx.lineWidth = 2.6985 * FIELD_SCALE;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter/2 * FIELD_SCALE, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgb(220, 200, 21)";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter/2 * FIELD_SCALE - 2.54 * FIELD_SCALE, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}