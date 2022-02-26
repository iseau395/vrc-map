let slot = "slot1";

export function setSlot(v: string) {
    slot = v;
}
export function getSlot(): string {
    return slot;
}

export interface Point { x: number, y: number, step: number };