import type { GameType } from "../util/constants";

async function create_tipping_point() {
    return new (await import("./tipping-point/tipping-point")).default();
}

export async function get_game(game: GameType) {

}