import { FIELD_SIDE } from "../util/constants";

/**
 * A class for processing the grid for placing things
 */
 export default class Grid {
    private gridSize = 48;

    snap(x: number, y: number): [x: number, y: number] {
        return [
            Math.round(x / (FIELD_SIDE / this.gridSize)) * (FIELD_SIDE / this.gridSize),
            Math.round(y / (FIELD_SIDE / this.gridSize)) * (FIELD_SIDE / this.gridSize)
        ]
    }

    render(
        ctx: CanvasRenderingContext2D,
        fieldX: number,
        fieldY: number,
        fieldZoom: number
    ) {
        // const grid_spacing = FIELD_SIDE * fieldZoom / this.gridSize;
        const grid_spacing = FIELD_SIDE / this.gridSize * fieldZoom;

        // let current_x = fieldX % grid_spacing / 2;
        // let current_y = fieldY % grid_spacing / 2;
        
        let current_x = fieldX % grid_spacing;
        let current_y = fieldY % grid_spacing;

        ctx.beginPath();
        
        while (current_x < ctx.canvas.width) {
            ctx.moveTo(current_x, Math.min(-fieldY / fieldZoom, 0));
            ctx.lineTo(current_x, ctx.canvas.height);

            current_x += grid_spacing;
        }
        
        while (current_y < ctx.canvas.height) {
            ctx.moveTo(Math.min(-fieldX / fieldZoom, 0), current_y);
            ctx.lineTo(ctx.canvas.width, current_y);

            current_y += grid_spacing;
        }

        ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}