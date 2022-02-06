import { BLUE_ALLIANCE, RED_ALLIANCE, FIELD_SIDE, GRID_COLOR, gameobjects } from "./map.js";

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
export function drawCircle(centerX, centerY, radius, fillStyle, strokeStyle, ctx) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fillStyle;
    if (fillStyle) ctx.fill();
    ctx.lineWidth = 5;
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
export function drawDot(centerX, centerY, style, ctx) {
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
export function polygon(x, y, radius, nsides, rotation, ctx) {
    const step = 2 * Math.PI / nsides,
        shift = Math.PI + (rotation / 360) * (Math.PI * 2);

    ctx.beginPath();
    for (let i = 0; i <= nsides; i++) {
        const curStep = i * step + shift;
        ctx.lineTo(x + radius * Math.cos(curStep), y + radius * Math.sin(curStep));
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}


function drawPlatform(x, y, color, ctx) {
    const longEdge = FIELD_SIDE / 3;
    const shortEdge = FIELD_SIDE / 6;

    ctx.strokeStyle = color;
    ctx.lineCap = "butt";
    ctx.lineWidth = 10;

    ctx.beginPath();

    ctx.moveTo(x + shortEdge / 10, y + longEdge / 8);
    ctx.lineTo(x + shortEdge - shortEdge / 10, y + longEdge / 8);
    ctx.lineTo(x + shortEdge - shortEdge / 10, y + (longEdge / 8) * 7);
    ctx.lineTo(x + shortEdge / 10, y + (longEdge / 8) * 7);
    ctx.lineTo(x + shortEdge / 10, y + longEdge / 8 - 5);

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

export function drawField(ctx) {
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


    drawPlatform(0, (FIELD_SIDE / 6) * 2, RED_ALLIANCE, ctx);
    drawPlatform((FIELD_SIDE / 6) * 5, (FIELD_SIDE / 6) * 2, BLUE_ALLIANCE, ctx);

    gameobjects.forEach((gameobject) =>
        gameobject.render(ctx)
    );
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function drawTrashCan(x, y, ctx) {
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineCap = "round"
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(x + (150)/4, y + (150)/4);
    ctx.lineTo(x + (150)*(3/4), y + (150)/4);
    
    ctx.moveTo(x + 150 * (4/12), y + 150/4);
    ctx.lineTo(x + 150 * (4/12), y + 150*(3/4));
    ctx.moveTo(x + 150 * (5/12), y + 150/4);
    ctx.lineTo(x + 150 * (5/12), y + 150*(3/4));
    ctx.moveTo(x + 150 * (6/12), y + 150/4);
    ctx.lineTo(x + 150 * (6/12), y + 150*(3/4));
    ctx.moveTo(x + 150 * (7/12), y + 150/4);
    ctx.lineTo(x + 150 * (7/12), y + 150*(3/4));
    ctx.moveTo(x + 150 * (8/12), y + 150/4);
    ctx.lineTo(x + 150 * (8/12), y + 150*(3/4));

    ctx.moveTo(x + 150 * (1/3), y + 150*(3/4));
    ctx.lineTo(x + 150 * (2/3), y + 150*(3/4));

    ctx.moveTo(x+ 150 * (5/12), y + 150/4);
    ctx.lineTo(x+ 150 * (5/12), y + 150/4 - 10);
    ctx.lineTo(x+ 150 * (7/12), y + 150/4 - 10);
    ctx.lineTo(x+ 150 * (7/12), y + 150/4);

    ctx.stroke();
    ctx.closePath();
}