import type { GameRenderer } from "../generic/game-renderer";
import { FIELD_SCALE, FIELD_SIDE } from "util/constants";
import Disk from "./gameobjects/disk";
import { LINE_COLOR, RED_ALLIANCE, BLUE_ALLIANCE } from "games/generic/colors";
import Roller from "./gameobjects/roller";

export default class TippingPoint implements GameRenderer {
    private cache_ctx: CanvasRenderingContext2D;

    private selected_disk = -1;

    private readonly disks = [
        new Disk(50, 50, 0)
    ]

    private readonly rollers = [
        new Roller(0, FIELD_SIDE / 6, false),
        new Roller(FIELD_SIDE / 6, 0, true),
        new Roller(FIELD_SIDE - Roller.short_side, FIELD_SIDE / 6 * 5 - Roller.long_side, false),
        new Roller(FIELD_SIDE / 6 * 5 - Roller.long_side, FIELD_SIDE - Roller.short_side, true)
    ]

    private cache() {
        this.cache_ctx =
            document.createElement("canvas")
            .getContext("2d");
        this.cache_ctx.canvas.width = FIELD_SIDE;
        this.cache_ctx.canvas.height = FIELD_SIDE;

        this.cache_ctx.strokeStyle = LINE_COLOR;
        this.cache_ctx.lineWidth = 1.1 * FIELD_SCALE;
        this.cache_ctx.lineCap = "square";
        this.cache_ctx.beginPath();

        this.cache_ctx.moveTo(5 * FIELD_SCALE, 0);
        this.cache_ctx.lineTo(FIELD_SIDE, FIELD_SIDE - 5 * FIELD_SCALE);
        
        this.cache_ctx.moveTo(0, 5 * FIELD_SCALE);
        this.cache_ctx.lineTo(FIELD_SIDE - 5 * FIELD_SCALE, FIELD_SIDE);

        this.cache_ctx.stroke();
        this.cache_ctx.strokeStyle = RED_ALLIANCE;
        this.cache_ctx.lineWidth = 5.08 / 2 * FIELD_SCALE;
        this.cache_ctx.lineCap = "round";

        this.cache_ctx.beginPath();
        this.cache_ctx.moveTo(FIELD_SIDE / 6, FIELD_SIDE / 3 * 2);
        this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 3 * 2);
        this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 6 * 5);
        this.cache_ctx.stroke();

        this.cache_ctx.strokeStyle = BLUE_ALLIANCE;

        this.cache_ctx.beginPath();
        this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 6);
        this.cache_ctx.lineTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 3);
        this.cache_ctx.lineTo(FIELD_SIDE / 6 * 5, FIELD_SIDE / 3);
        this.cache_ctx.stroke();
    }

    tick(mouseX: number, mouseY: number, mouseButton: number, shiftKey: boolean, deltaScroll: number) {
        if (shiftKey && mouseButton == 0) {
            if (this.selected_disk == -1) {
                for (const disk of this.disks) {
                    if (disk.pointInside(mouseX, mouseY)) {
                        this.selected_disk = this.disks.indexOf(disk);

                        break;
                    }
                }
            }

            if (this.selected_disk >= 0)
                this.disks[this.selected_disk]
                    .update(
                        mouseX,
                        mouseY,
                        deltaScroll
                    );
        } else {
            this.selected_disk = -1;
        }

        for (const roller of this.rollers) {
            roller.update(mouseX, mouseY, mouseButton);
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        this.rollers.forEach(roller => {
            roller.render(ctx);
        });

        this.disks.forEach(disk => {
            disk.render(ctx);
        })
    }

    render_static(ctx: CanvasRenderingContext2D) {
        if (!this.cache_ctx) this.cache();

        ctx.drawImage(this.cache_ctx.canvas, 0, 0);
    }
}