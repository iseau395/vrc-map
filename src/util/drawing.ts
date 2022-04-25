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