import {
    RED_ALLIANCE, BLUE_ALLIANCE, NEUTRAL_MOGO, RING_COLOR
} from "./map.js";
import { polygon, drawCircle } from "./drawing.js";

export class GameObject {
    /**
     * Create a new {@link GameObject GameObject}
     * @param {number} x The x coordinate to start at
     * @param {number} y The y coordinate to start at
     * @param {number} rotation The rotation to start at
     * @param {number} variation The variation of the gameobject
     */
    constructor(x, y, rotation, variation) {
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
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Rotate the gameobject to a specific rotation
     * @param {number} rotation The rotation to turn to
     */
    rotateTo(rotation) {
        this.rotation = rotation;
    }

    /**
     * Draw the GameObject
     * @param {CanvasRenderingContext2D} ctx The context to draw on
     */
    render(ctx) {
        throw new Error("Unimplemented");
    }

    /**
     * Check if a point is inside of a GameObject
     * @param {number} x
     * @param {number} y
     */
    pointInside(x, y) {
        throw new Error("Unimplemented");
    }

    encode() {
        throw new Error("Unimplemented");
    }
    static decode() {
        throw new Error("Unimplemented");
    }

    static isEncode(value) {
        throw new Error("Unimplemented");
    }
}

let skills = false;
const skills_display = document.getElementById("skills-display");
document.getElementById("skills-switch").addEventListener("click", (event) => {
    skills = !skills;
    skills_display.innerText = skills ? "Skills Mode" : "Alliance Mode";
});

export class Mogo extends GameObject {
    static regex = /mogo-(?<x>(?:\d|\.)+)-(?<y>(?:\d|\.)+)-(?<rotation>(?:\d|\.)+)-(?<variation>\d)/;

    /**
     * Draw the Mogo
     * @param {CanvasRenderingContext2D} ctx The context to draw on
     */
    render(ctx) {
        if (skills) switch (this.variation) {
            case 0: ctx.fillStyle = NEUTRAL_MOGO;
                break;
            case 1: ctx.fillStyle = BLUE_ALLIANCE;
                break;
            case 2: ctx.fillStyle = RED_ALLIANCE;
                break;
        }
        else switch (this.variation) {
            case 0: ctx.fillStyle = NEUTRAL_MOGO;
                break;
            case 1: ctx.fillStyle = RED_ALLIANCE;
                break;
            case 2: ctx.fillStyle = BLUE_ALLIANCE;
                break;
        }

        let rotation = this.rotation + 14;
        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.lineWidth = 3;
        polygon(this.x, this.y, 25.94, 7, rotation, ctx);
    }

    pointInside = (x, y) =>
        (x - this.x) ** 2 + (y - this.y) ** 2 <= 25.94 ** 2;

    encode() {
        return `mogo-${this.x.toFixed(2)}-${this.y.toFixed(2)}-${this.rotation.toFixed(0)}-${this.variation}`;
    }
    static decode(string) {
        const decoded = this.regex.exec(string).groups;
        return new Mogo(
            +decoded.x,
            +decoded.y,
            +decoded.rotation,
            +decoded.variation,
        );
    }

    static isEncode = (string) =>
        this.regex.test(string);
}

export class Ring extends GameObject {
    static regex = /ring-(?<x>(?:\d|\.)+)-(?<y>(?:\d|\.)+)/;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super(x, y, 0, 0);
    }

    render(/**@type {CanvasRenderingContext2D}*/ctx) {
        ctx.lineWidth = 2;
        drawCircle(this.x, this.y, 6, "rgba(0, 0, 0, 0)", RING_COLOR, ctx);
    }

    pointInside = (x, y) =>
        (x - this.x) ** 2 + (y - this.y) ** 2 <= 14 ** 2;

    encode() {
        return `ring-${this.x.toFixed(2)}-${this.y.toFixed(2)}`;
    }
    static decode(string) {
        const decoded = this.regex.exec(string).groups;
        return new Ring(
            +decoded.x,
            +decoded.y
        );
    }

    static isEncode = (string) =>
        this.regex.test(string);
}