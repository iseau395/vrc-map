import { RoundMovableGameobject } from "games/generic/gameobject";
import { FIELD_SCALE } from "util/constants";
import { drawPolygon } from "util/drawing";
import { BLUE_ALLIANCE, NEUTRAL_MOGO, RED_ALLIANCE } from "../colors";

export enum MogoVariation {
    RED_ALLIANCE,
    BLUE_ALLIANCE,
    NEUTRAL
}

export default class Mogo extends RoundMovableGameobject {
    private static red_cache: CanvasRenderingContext2D;
    private static blue_cache: CanvasRenderingContext2D;
    private static neutral_cache: CanvasRenderingContext2D;

    protected readonly radius = 33;

    protected readonly rotate_step = 90;
    
    private variation: MogoVariation;

    private drawMogo(ctx: CanvasRenderingContext2D) {
        switch (this.variation) {
            case 0:
                ctx.fillStyle = RED_ALLIANCE;
                break;
            case 1:
                ctx.fillStyle = BLUE_ALLIANCE;
                break;
            case 2:
                ctx.fillStyle = NEUTRAL_MOGO;
                break;
        }

        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.lineWidth = 0.5 * FIELD_SCALE;
        drawPolygon(this.radius/2 * FIELD_SCALE, this.radius/2 * FIELD_SCALE, this.radius/2 * FIELD_SCALE, 7, 14, ctx);
    }

    constructor(x: number, y: number, r: number, variation: number) {
        super(x, y, r);
        this.variation = variation;
    }

    render(ctx: CanvasRenderingContext2D) {
        switch (this.variation) {
            case MogoVariation.RED_ALLIANCE: {
                if (!Mogo.red_cache) {
                    Mogo.red_cache =
                        document.createElement("canvas")
                        .getContext("2d");

                    Mogo.red_cache.canvas.width = this.radius * FIELD_SCALE;
                    Mogo.red_cache.canvas.height = this.radius * FIELD_SCALE;

                    this.drawMogo(Mogo.red_cache);
                }

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.r);
                ctx.drawImage(Mogo.red_cache.canvas, -this.radius / 2 * FIELD_SCALE, -this.radius / 2 * FIELD_SCALE);
                ctx.restore();
            } break;

            case MogoVariation.BLUE_ALLIANCE: {
                if (!Mogo.blue_cache) {
                    Mogo.blue_cache =
                        document.createElement("canvas")
                        .getContext("2d");

                    Mogo.blue_cache.canvas.width = this.radius * FIELD_SCALE;
                    Mogo.blue_cache.canvas.height = this.radius * FIELD_SCALE;

                    this.drawMogo(Mogo.blue_cache);
                }

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.r);
                ctx.drawImage(Mogo.blue_cache.canvas, -this.radius / 2 * FIELD_SCALE, -this.radius / 2 * FIELD_SCALE);
                ctx.restore();
            } break;
            
            
            case MogoVariation.NEUTRAL: {
                if (!Mogo.neutral_cache) {
                    Mogo.neutral_cache =
                        document.createElement("canvas")
                        .getContext("2d");

                    Mogo.neutral_cache.canvas.width = this.radius * FIELD_SCALE;
                    Mogo.neutral_cache.canvas.height = this.radius * FIELD_SCALE;

                    this.drawMogo(Mogo.neutral_cache);
                }

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.r);
                ctx.drawImage(Mogo.neutral_cache.canvas, -this.radius / 2 * FIELD_SCALE, -this.radius / 2 * FIELD_SCALE);
                ctx.restore();
            } break;
        }
    }
}