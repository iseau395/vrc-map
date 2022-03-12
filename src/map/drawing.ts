const FIELD_SIDE = 1427.48;

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toUnfinished = () =>
        new Color(this.r + 40, this.g + 40, this.b + 40, this.a);

    toTransparent = () => new Color(this.r, this.g, this.b, 0.1);

    toString = () => `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
}

export const NEUTRAL_MOGO = new Color(255, 255, 0);
export const RED_ALLIANCE = new Color(255, 0, 0);
export const BLUE_ALLIANCE = new Color(0, 0, 255);
export const RING_COLOR = new Color(255, 0, 255);

export const GRID_COLOR = "rgba(155, 155, 155, 0.5)";

const FIELD_COLOR = "rgb(125, 125, 125)";
const LINE_COLOR = "rgb(255, 255, 255)";

/**
 *
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @param {string | CanvasGradient | CanvasPattern | null} fillStyle
 * @param {string | CanvasGradient | CanvasPattern | null} strokeStyle
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawCircle(
    centerX: number,
    centerY: number,
    radius: number,
    fillStyle: CanvasRenderingContext2D["fillStyle"],
    strokeStyle: CanvasRenderingContext2D["strokeStyle"],
    ctx: CanvasRenderingContext2D
) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fillStyle;
    if (fillStyle) ctx.fill();
    ctx.strokeStyle = strokeStyle;
    if (strokeStyle) ctx.stroke();
    ctx.closePath();
}

/**
 *
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @param {string | CanvasGradient | CanvasPattern} fillStyle
 * @param {string | CanvasGradient | CanvasPattern} strokeStyle
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawDot(
    centerX: number,
    centerY: number,
    style: CanvasRenderingContext2D["fillStyle"],
    ctx: CanvasRenderingContext2D) {

    ctx.lineWidth = 1;
    drawCircle(centerX, centerY, 13, null, style, ctx);
    drawCircle(centerX, centerY, 5, style, null, ctx);
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {number} nsides
 * @param {number} rotation
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawPolygon(x: number, y: number, radius: number, nsides: number, rotation: number, ctx: CanvasRenderingContext2D) {
    const step = (2 * Math.PI) / nsides,
        shift = Math.PI + (rotation / 360) * (Math.PI * 2);

    ctx.beginPath();
    for (let i = 0; i <= nsides; i++) {
        const curStep = i * step + shift;
        ctx.lineTo(
            x + radius * Math.cos(curStep),
            y + radius * Math.sin(curStep)
        );
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawPlatform(x: number, y: number, color: CanvasRenderingContext2D["strokeStyle"], ctx: CanvasRenderingContext2D) {
    const longEdge = FIELD_SIDE / 3;
    const shortEdge = FIELD_SIDE / 6;

    ctx.strokeStyle = color;
    ctx.lineCap = "butt";
    ctx.lineWidth = 20;

    ctx.beginPath();

    ctx.moveTo(x + shortEdge / 10, y + longEdge / 8);
    ctx.lineTo(x + shortEdge - shortEdge / 10, y + longEdge / 8);
    ctx.lineTo(x + shortEdge - shortEdge / 10, y + (longEdge / 8) * 7);
    ctx.lineTo(x + shortEdge / 10, y + (longEdge / 8) * 7);
    ctx.lineTo(x + shortEdge / 10, y + longEdge / 8 - 10);

    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(x, y, shortEdge, longEdge);

    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x + shortEdge + 1, y);
    ctx.lineTo(x + shortEdge + 1, y + longEdge);

    ctx.moveTo(x - 1, y);
    ctx.lineTo(x - 1, y + longEdge);

    ctx.stroke();
    ctx.closePath();
}

export function drawField(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = FIELD_COLOR;
    ctx.lineWidth = 5;
    ctx.fillRect(0, 0, FIELD_SIDE, FIELD_SIDE);

    let gridScale = 6;
    let fieldGrid = FIELD_SIDE / gridScale;
    ctx.lineWidth = 3;
    ctx.strokeStyle = GRID_COLOR;
    ctx.beginPath();
    for (let i = 0; i < gridScale; i++) {
        ctx.moveTo(fieldGrid * i, 0);
        ctx.lineTo(fieldGrid * i, FIELD_SIDE);
    }
    for (let i = 0; i < gridScale; i++) {
        ctx.moveTo(0, fieldGrid * i);
        ctx.lineTo(FIELD_SIDE, fieldGrid * i);
    }
    ctx.stroke();

    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();

    ctx.moveTo(FIELD_SIDE / 3, 0);
    ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE);

    ctx.moveTo(FIELD_SIDE / 2 - 2, 0);
    ctx.lineTo(FIELD_SIDE / 2 - 2, FIELD_SIDE);
    ctx.moveTo(FIELD_SIDE / 2 + 2, 0);
    ctx.lineTo(FIELD_SIDE / 2 + 2, FIELD_SIDE);

    ctx.moveTo((FIELD_SIDE / 3) * 2, 0);
    ctx.lineTo((FIELD_SIDE / 3) * 2, FIELD_SIDE);

    ctx.moveTo((FIELD_SIDE / 6) * 4, FIELD_SIDE / 6);
    ctx.lineTo((FIELD_SIDE / 6) * 5, 0);

    ctx.moveTo((FIELD_SIDE / 6) * 2, (FIELD_SIDE / 6) * 5);
    ctx.lineTo((FIELD_SIDE / 6) * 1, FIELD_SIDE);

    ctx.stroke();

    ctx.closePath();

    drawPlatform(0, (FIELD_SIDE / 6) * 2, RED_ALLIANCE.toString(), ctx);
    drawPlatform(
        (FIELD_SIDE / 6) * 5,
        (FIELD_SIDE / 6) * 2,
        BLUE_ALLIANCE.toString(),
        ctx
    );
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawTrashCan(x: number, y: number, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineCap = "round";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(x + 150 / 4, y + 150 / 4);
    ctx.lineTo(x + 150 * (3 / 4), y + 150 / 4);

    ctx.moveTo(x + 150 * (4 / 12), y + 150 / 4);
    ctx.lineTo(x + 150 * (4 / 12), y + 150 * (3 / 4));
    ctx.moveTo(x + 150 * (5 / 12), y + 150 / 4);
    ctx.lineTo(x + 150 * (5 / 12), y + 150 * (3 / 4));
    ctx.moveTo(x + 150 * (6 / 12), y + 150 / 4);
    ctx.lineTo(x + 150 * (6 / 12), y + 150 * (3 / 4));
    ctx.moveTo(x + 150 * (7 / 12), y + 150 / 4);
    ctx.lineTo(x + 150 * (7 / 12), y + 150 * (3 / 4));
    ctx.moveTo(x + 150 * (8 / 12), y + 150 / 4);
    ctx.lineTo(x + 150 * (8 / 12), y + 150 * (3 / 4));

    ctx.moveTo(x + 150 * (1 / 3), y + 150 * (3 / 4));
    ctx.lineTo(x + 150 * (2 / 3), y + 150 * (3 / 4));

    ctx.moveTo(x + 150 * (5 / 12), y + 150 / 4);
    ctx.lineTo(x + 150 * (5 / 12), y + 150 / 4 - 10);
    ctx.lineTo(x + 150 * (7 / 12), y + 150 / 4 - 10);
    ctx.lineTo(x + 150 * (7 / 12), y + 150 / 4);

    ctx.stroke();
    ctx.closePath();
}