import type { GameRenderer } from "../generic/game-renderer";
import { FIELD_SCALE, FIELD_SIDE } from "util/constants";
import Disk from "./gameobjects/disk";
import { LINE_COLOR, RED_ALLIANCE, BLUE_ALLIANCE } from "games/generic/colors";
import Roller from "./gameobjects/roller";
import { HIGH_GOAL_SUPPORT } from "./colors";

export default class SpinUp implements GameRenderer {
    private cache_ctx: CanvasRenderingContext2D;

    private selected_disk = -1;

    private readonly disks = [
        new Disk(FIELD_SIDE / 12 * 1, FIELD_SIDE / 12 * 1),
        new Disk(FIELD_SIDE / 12 * 2, FIELD_SIDE / 12 * 2),
        new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 3 - 1 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 3 - 2 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 3 - 3 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 4, FIELD_SIDE / 12 * 4),
        new Disk(FIELD_SIDE / 12 * 5, FIELD_SIDE / 12 * 5),

        new Disk(FIELD_SIDE / 12 * 7, FIELD_SIDE / 12 * 7),
        new Disk(FIELD_SIDE / 12 * 8, FIELD_SIDE / 12 * 8),
        new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 9 - 1 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 9 - 2 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 9 - 3 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 10, FIELD_SIDE / 12 * 10),
        new Disk(FIELD_SIDE / 12 * 11, FIELD_SIDE / 12 * 11),


        new Disk(FIELD_SIDE / 12 * 5, FIELD_SIDE / 12 * 3),
        new Disk(FIELD_SIDE / 12 * 6, FIELD_SIDE / 12 * 4),
        new Disk(FIELD_SIDE / 12 * 7, FIELD_SIDE / 12 * 5),
        
        new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 7 - 1 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 7 - 2 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 7 - 3 * FIELD_SCALE),


        new Disk(FIELD_SIDE / 12 * 5, FIELD_SIDE / 12 * 7),
        new Disk(FIELD_SIDE / 12 * 6, FIELD_SIDE / 12 * 8),
        new Disk(FIELD_SIDE / 12 * 7, FIELD_SIDE / 12 * 9),
        
        new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 5 - 1 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 5 - 2 * FIELD_SCALE),
        new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 5 - 3 * FIELD_SCALE),

        // Preloads and Match Loads
        new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 7),
        new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 8),
        new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 13),
        new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 12),

        new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 7),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 8),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 13),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 12),
        
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 7),
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 8),
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 9),
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 10),
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 11),
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 12),
        new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 13),

        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 7),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 8),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 9),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 10),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 11),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 12),
        new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 13),
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

        ////// Tape //////

        this.cache_ctx.strokeStyle = LINE_COLOR;
        this.cache_ctx.lineWidth = 1.1 * FIELD_SCALE;
        this.cache_ctx.lineCap = "square";
        this.cache_ctx.beginPath();

        // Diagonal Lines

        this.cache_ctx.moveTo(5 * FIELD_SCALE, 0);
        this.cache_ctx.lineTo(FIELD_SIDE, FIELD_SIDE - 5 * FIELD_SCALE);

        this.cache_ctx.moveTo(0, 5 * FIELD_SCALE);
        this.cache_ctx.lineTo(FIELD_SIDE - 5 * FIELD_SCALE, FIELD_SIDE);

        // Starting lines

        this.cache_ctx.moveTo(0, FIELD_SIDE / 6);
        this.cache_ctx.lineTo(FIELD_SIDE / 12, FIELD_SIDE / 6);

        this.cache_ctx.moveTo(FIELD_SIDE / 3, 0);
        this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 12);

        this.cache_ctx.moveTo(FIELD_SIDE, FIELD_SIDE / 6 * 5);
        this.cache_ctx.lineTo(FIELD_SIDE / 12 * 11, FIELD_SIDE / 6 * 5);

        this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, FIELD_SIDE);
        this.cache_ctx.lineTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 12 * 11);

        // Low Goal Lines

        this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, 0);
        this.cache_ctx.lineTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 6);

        this.cache_ctx.moveTo(FIELD_SIDE, FIELD_SIDE / 3);
        this.cache_ctx.lineTo(FIELD_SIDE / 6 * 5, FIELD_SIDE / 3);

        this.cache_ctx.moveTo(0, FIELD_SIDE / 3 * 2);
        this.cache_ctx.lineTo(FIELD_SIDE / 6, FIELD_SIDE / 3 * 2);

        this.cache_ctx.moveTo(FIELD_SIDE / 3, FIELD_SIDE);
        this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 6 * 5);

        this.cache_ctx.stroke();

        ////// Bumpers //////

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

        ////// High Goals //////

        this.cache_ctx.strokeStyle = HIGH_GOAL_SUPPORT;
        this.cache_ctx.lineWidth = 5.08 * FIELD_SCALE;
        this.cache_ctx.lineCap = "square";

        this.cache_ctx.beginPath();
        this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, 0);
        this.cache_ctx.lineTo(FIELD_SIDE, FIELD_SIDE / 3);
        
        this.cache_ctx.moveTo(0, FIELD_SIDE / 3 * 2);
        this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE);
        this.cache_ctx.stroke();


        const high_goal_diameter = 39.9542;
        this.cache_ctx.fillStyle = RED_ALLIANCE;

        this.cache_ctx.beginPath();
        this.cache_ctx.arc(FIELD_SIDE / 6 * 5, FIELD_SIDE / 6, high_goal_diameter/2 * FIELD_SCALE, 0, Math.PI * 2);
        this.cache_ctx.closePath();
        this.cache_ctx.fill();

        this.cache_ctx.fillStyle = BLUE_ALLIANCE;

        this.cache_ctx.beginPath();
        this.cache_ctx.arc(FIELD_SIDE / 6, FIELD_SIDE / 6 * 5, high_goal_diameter/2 * FIELD_SCALE, 0, Math.PI * 2);
        this.cache_ctx.closePath();
        this.cache_ctx.fill();
    }

    tick(mouseX: number, mouseY: number, snappedMouseX: number, snappedMouseY: number, mouseButton: number, shiftKey: boolean, ctrlKey: boolean, deltaScroll: number) {
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
                        snappedMouseX,
                        snappedMouseY,
                        deltaScroll
                    );
        } else {
            this.selected_disk = -1;
        }

        if (!shiftKey)
            for (const roller of this.rollers) {
                roller.update(mouseX, mouseY, mouseButton);
            }
    }

    render(ctx: CanvasRenderingContext2D) {
        // Alliance Stations

        ctx.strokeStyle = RED_ALLIANCE;
        ctx.lineWidth = 3 * FIELD_SCALE;
        ctx.lineCap = "square";
        
        ctx.beginPath();
        ctx.moveTo(-FIELD_SIDE / 12 * 3, FIELD_SIDE / 12);
        ctx.lineTo(-FIELD_SIDE / 12 / 2, FIELD_SIDE / 12);
        ctx.lineTo(-FIELD_SIDE / 12 / 2, FIELD_SIDE / 12 * 11);
        ctx.lineTo(-FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 11);
        ctx.stroke();
        
        ctx.strokeStyle = BLUE_ALLIANCE;

        ctx.beginPath();
        ctx.moveTo(FIELD_SIDE + FIELD_SIDE / 12 * 3, FIELD_SIDE / 12);
        ctx.lineTo(FIELD_SIDE + FIELD_SIDE / 12 / 2, FIELD_SIDE / 12);
        ctx.lineTo(FIELD_SIDE + FIELD_SIDE / 12 / 2, FIELD_SIDE / 12 * 11);
        ctx.lineTo(FIELD_SIDE + FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 11);
        ctx.stroke();

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