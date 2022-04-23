import type { Renderable, Tickable } from "../util/class-bases";
import { GameType } from "../util/constants";

export interface GameRenderer extends Tickable, Renderable {
    tick(mouseX: number, mouseY: number, mouseButton: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    render_static(ctx: CanvasRenderingContext2D): void;
}

async function create_tipping_point() {
    return new (await import("./tipping-point/tipping-point")).default();
}

export async function get_game(game: GameType) {
    switch (game) {
        case GameType.TIPPING_POINT:
            return create_tipping_point();

        default:
            throw new Error(`Unknown game type: ${game}`);
            break;
    }
}