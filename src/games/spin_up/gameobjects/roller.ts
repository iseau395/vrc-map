import { BLUE_ALLIANCE, RED_ALLIANCE } from "games/generic/colors";
import type { Gameobject } from "games/generic/gameobject";
import { FIELD_SCALE } from "util/constants";

export default class Roller implements Gameobject {
    private static long_side = 24.892 * FIELD_SCALE;
    private static short_side = 6.096 * FIELD_SCALE;

    private x: number;
    private y: number;
    private vetical: boolean;
    private state: -1 | 0 | 1;

    private was_pressed = false;

    constructor(x: number, y: number, vertical: boolean, state: -1 | 0 | 1 = 0) {
        this.x = x;
        this.y = y;
        this.vetical = vertical;
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
                (this.vetical ? Roller.long_side : Roller.short_side),
                (this.vetical ? Roller.short_side : Roller.long_side)
            );
        } else {
            if (this.vetical) {
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
            x < this.x + (this.vetical ? Roller.long_side : Roller.short_side) &&
            y < this.y + (this.vetical ? Roller.short_side : Roller.long_side)
    }
}