import type { Renderable } from "util/class-bases";
import { FIELD_SCALE } from "util/constants";

export interface Gameobject extends Renderable {
    update(x: number, y: number, z: number): void;

    pointInside(x: number, y: number): boolean;
}

export class MovableGameobject implements Gameobject {
    protected x: number;
    protected y: number;
    protected r: number;

    protected readonly rotate_step: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    pointInside(x: number, y: number): boolean {
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

    render(ctx: CanvasRenderingContext2D) {
        throw new Error("Unimplimented")
    }
}

export class RoundMovableGameobject extends MovableGameobject {
    protected readonly diameter: number;

    pointInside(x: number, y: number) {
        if (!this.diameter)
            throw new Error("Missing diameter!");

        return (x - this.x) ** 2 + (y - this.y) ** 2 <= (this.diameter / 2 * FIELD_SCALE + 1 * FIELD_SCALE) ** 2;
    }
}