import {
    RED_ALLIANCE,
    BLUE_ALLIANCE,
    NEUTRAL_MOGO,
    RING_COLOR,
    drawPolygon,
    drawCircle
} from "./drawing";

import { skills as skills_store } from "../components/settings/settings";

let skills = false;
skills_store.subscribe(v => skills = v);

export class GameObject {
    x: number;
    y: number;
    rotation: number;
    variation: number;

    /**
     * Create a new {@link GameObject GameObject}
     * @param {number} x The x coordinate to start at
     * @param {number} y The y coordinate to start at
     * @param {number} rotation The rotation to start at
     * @param {number} variation The variation of the gameobject
     */
    constructor(x: number, y: number, rotation: number, variation: number) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.variation = variation;
    }

    /**
     * Move the gameobject to a specific x and y
     * @param {number} x The x to move to
     * @param {number} y The y to move to
     */
    moveTo(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Rotate the gameobject to a specific rotation
     * @param {number} rotation The rotation to turn to
     */
    rotateTo(rotation: number) {
        this.rotation = rotation;
    }

    /**
     * Draw the GameObject
     * @param {CanvasRenderingContext2D} ctx The context to draw on
     */
    render(ctx: CanvasRenderingContext2D) {
        throw new Error("Unimplemented");
    }

    /**
     * Check if a point is inside of a GameObject
     * @param {number} x
     * @param {number} y
     */
    pointInside(x: number, y: number) {
        throw new Error("Unimplemented");
    }

    encode() {
        throw new Error("Unimplemented");
    }
    static decode(string: string) {
        throw new Error("Unimplemented");
    }

    static isEncode(value: string) {
        throw new Error("Unimplemented");
    }
}

export class Mogo extends GameObject {
    static regex =
        /mogo-(?<x>(?:\d|\.)+)-(?<y>(?:\d|\.)+)-(?<rotation>(?:\d|\.)+)-(?<variation>\d)/;

    /**
     * Draw the Mogo
     * @param {CanvasRenderingContext2D} ctx The context to draw on
     */
    render(ctx: CanvasRenderingContext2D) {
        if (skills)
            switch (this.variation) {
                case 0:
                    ctx.fillStyle = NEUTRAL_MOGO.toString();
                    break;
                case 1:
                    ctx.fillStyle = BLUE_ALLIANCE.toString();
                    break;
                case 2:
                    ctx.fillStyle = RED_ALLIANCE.toString();
                    break;
            }
        else
            switch (this.variation) {
                case 0:
                    ctx.fillStyle = NEUTRAL_MOGO.toString();
                    break;
                case 1:
                    ctx.fillStyle = RED_ALLIANCE.toString();
                    break;
                case 2:
                    ctx.fillStyle = BLUE_ALLIANCE.toString();
                    break;
            }

        let rotation = this.rotation + 14;
        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.lineWidth = 3;
        drawPolygon(this.x, this.y, 25.94, 7, rotation, ctx);
    }

    pointInside = (x: number, y: number) =>
        (x - this.x) ** 2 + (y - this.y) ** 2 <= 25.94 ** 2;

    encode() {
        return `mogo-${this.x.toFixed(2)}-${this.y.toFixed(
            2
        )}-${this.rotation.toFixed(0)}-${this.variation}`;
    }
    static decode(string: string) {
        const decoded = this.regex.exec(string).groups;
        return new Mogo(
            +decoded.x,
            +decoded.y,
            +decoded.rotation,
            +decoded.variation
        );
    }

    static isEncode = (string: string) => this.regex.test(string);
}

export class Ring extends GameObject {
    static regex = /ring-(?<x>(?:\d|\.)+)-(?<y>(?:\d|\.)+)/;

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x: number, y: number) {
        super(x, y, 0, 0);
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 2;
        drawCircle(this.x, this.y, 6, "rgba(0, 0, 0, 0)", RING_COLOR, ctx);
    }

    pointInside = (x: number, y: number) =>
        (x - this.x) ** 2 + (y - this.y) ** 2 <= 14 ** 2;

    encode() {
        return `ring-${this.x.toFixed(2)}-${this.y.toFixed(2)}`;
    }
    static decode(string: string) {
        const decoded = this.regex.exec(string).groups;
        return new Ring(+decoded.x, +decoded.y);
    }

    static isEncode = (string: string) => this.regex.test(string);
}