import type { Renderable } from "../../util/class-bases";
import { FIELD_SCALE } from "../../util/constants";

export interface Object extends Renderable {
    update(...params: any): void;

    pointInside(x: number, y: number): boolean;
}

export class MovableObject implements Object {
    protected type: string;

    protected x: number;
    protected y: number;
    protected r: number;

    protected readonly rotate_step: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    pointInside(_x: number, _y: number): boolean {
        throw new Error("Unimplimented")
    }

    update(mouseX: number, mouseY: number, deltaScroll: number) {
        this.x = mouseX;
        this.y = mouseY;

        deltaScroll /= 1.25;

        if (!this.rotate_step)
            throw new Error("Missing rotate_step!");

        this.r += Math.floor(deltaScroll / this.rotate_step) * this.rotate_step;
    }

    render(_ctx: CanvasRenderingContext2D) {
        throw new Error("Unimplimented")
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getRot() {
        return this.r;
    }

    getType() {
        return this.type;
    }
}

export class RoundMovableObject extends MovableObject {
    protected readonly diameter: number;

    pointInside(x: number, y: number) {
        if (!this.diameter)
            throw new Error("Missing diameter!");

        return (x - this.x) ** 2 + (y - this.y) ** 2 <= (this.diameter / 2 * FIELD_SCALE + 1 * FIELD_SCALE) ** 2;
    }
}