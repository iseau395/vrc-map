import { BLUE_ALLIANCE, RED_ALLIANCE } from "games/generic/colors";
import type { Gameobject } from "games/generic/gameobject";
import { FIELD_SCALE } from "util/constants";

export default class Roller implements Gameobject {
    static readonly long_side = 24.892 * FIELD_SCALE;
    static readonly short_side = 6.096 * FIELD_SCALE;

    private x: number;
    private y: number;
    private horrizontal: boolean;
    private state: -1 | 0 | 1;

    private was_pressed = false;

    constructor(x: number, y: number, horrizontal: boolean, state: -1 | 0 | 1 = 0) {
        this.x = x;
        this.y = y;
        this.horrizontal = horrizontal;
        this.state = state
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";

        if (this.state != 0) {
            if (this.state == -1)
                ctx.fillStyle = BLUE_ALLIANCE;
            if (this.state == 1)
                ctx.fillStyle = RED_ALLIANCE;

            ctx.fillRect(
                this.x, this.y,
                (this.horrizontal ? Roller.long_side : Roller.short_side),
                (this.horrizontal ? Roller.short_side : Roller.long_side)
            );
        } else {
            if (this.horrizontal) {
                ctx.fillStyle = BLUE_ALLIANCE;
                ctx.fillRect(
                    this.x,
                    this.y,
                    Roller.long_side,
                    Roller.short_side / 2
                );
                ctx.fillStyle = RED_ALLIANCE;
                ctx.fillRect(
                    this.x,
                    this.y + Roller.short_side / 2,
                    Roller.long_side,
                    Roller.short_side / 2
                );
            } else {
                ctx.fillStyle = BLUE_ALLIANCE;
                ctx.fillRect(
                    this.x,
                    this.y,
                    Roller.short_side / 2,
                    Roller.long_side
                );
                ctx.fillStyle = RED_ALLIANCE;
                ctx.fillRect(
                    this.x + Roller.short_side / 2,
                    this.y,
                    Roller.short_side / 2,
                    Roller.long_side
                );
            }
        }
    }

    update(mouseX: number, mouseY: number, mouseButton: number) {
        if (this.pointInside(mouseX, mouseY) && mouseButton == 0 && !this.was_pressed) {
            this.state++;
            if (this.state > 1) this.state = -1;
            console.log(this.state);
            this.was_pressed = true
        } else if (mouseButton != 0) {
            this.was_pressed = false
        }
    }

    pointInside(x: number, y: number): boolean {
        return x > this.x &&
            y > this.y &&
            x < this.x + (this.horrizontal ? Roller.long_side : Roller.short_side) &&
            y < this.y + (this.horrizontal ? Roller.short_side : Roller.long_side)
    }
}