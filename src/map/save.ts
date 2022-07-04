import { getContext } from "svelte";
import type { GameType } from "util/constants";

export interface SaveData {
    v: number,
    g: GameType,
    d: any[]
}

export function save_data(slot: string, game: GameType, ...p_data: any[]) {
    const data: SaveData = {
        v: 0,
        g: game,
        d: p_data
    }

    localStorage.setItem(`slot-${game}-${slot}`, JSON.stringify(data));

    if (!localStorage.getItem("slots"))
        localStorage.setItem("slots", JSON.stringify([]))
    const slots = JSON.parse(localStorage.getItem("slots")) as string[];

    if (!slots.includes(slot)) {
        slots.push(slot);
        localStorage.setItem(
            "slots",
            JSON.stringify(slots)
        );
    }
}