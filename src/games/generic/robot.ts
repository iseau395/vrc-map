import { MovableObject } from "./object";
import { FIELD_SCALE } from "../../util/constants";

export default class Robot extends MovableObject {
    rotate_step = 10;

    type = "robot";

    private texture: number;

    private width = 45.72 * FIELD_SCALE;
    private height = 45.72 * FIELD_SCALE;

    constructor(x: number, y: number, texture: number) {
        super(x, y, 0);
        this.texture = texture;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgb(125, 125, 125)"
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        ctx.textAlign = "center";
        ctx.font = '100px serif';
        switch (this.texture) {
            case 0:
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillText("A", this.x, this.y + 25);
                break;
            case 1:
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillText("B", this.x, this.y + 25);
                break;
            case 2:
                ctx.fillStyle = "rgb(0, 0, 255)";
                ctx.fillText("A", this.x, this.y + 25);
                break;
            case 3:
                ctx.fillStyle = "rgb(0, 0, 255)";
                ctx.fillText("B", this.x, this.y + 25);
                break;
        }
    }

    pointInside(x: number, y: number): boolean {
        return x > this.x - this.width / 2 &&
               y > this.y - this.height / 2 &&
               x < this.x + this.width / 2 &&
               y < this.y + this.height / 2;
    }
}
