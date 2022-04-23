export interface Renderable {
    render(ctx: CanvasRenderingContext2D): void;
}

export interface Tickable {
    tick(...inputs: unknown[]): void;
}