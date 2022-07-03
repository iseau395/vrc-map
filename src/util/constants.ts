export const FIELD_SCALE = 5;
export const FIELD_SIDE = 357 * FIELD_SCALE;

export enum GameType {
    TIPPING_POINT,
    SPIN_UP
}

export enum CursorType {
    NORMAL,
    POINTER,
    GRAB,
    GRABBING,
    ZOOM_IN,
    ZOOM_OUT,
    PAN
}