import { writable } from "svelte/store";

export let slot = writable("slot1");

export interface Point {
    x: number,
    y: number,
    step: number
};