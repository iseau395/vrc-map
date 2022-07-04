import { GameType } from "../util/constants";
import type { GameRenderer } from "./generic/game-renderer";

async function create_tipping_point() {
    return new (await import("./tipping-point/tipping-point")).default();
}

async function create_spin_up() {
    return new (await import("./spin_up/spin_up")).default();
}

export async function get_game(game: GameType): Promise<GameRenderer<unknown>> {
    switch (game) {
        case GameType.TIPPING_POINT:
            return create_tipping_point();

        case GameType.SPIN_UP:
            return create_spin_up();

        default:
            throw new Error(`Unknown game type: ${game}`);
    }
}