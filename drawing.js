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