import type { Renderable, Tickable } from "util/class-bases";
import type { CursorType } from "util/constants";

export interface GameRenderer<T> extends Tickable, Renderable {
    tick(mouseX: number, mouseY: number, snappedMouseX: number, snappedMouseY: number, mouseButton: number, shiftKey: boolean, ctrlKey: boolean, deltaScroll: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    render_static(ctx: CanvasRenderingContext2D): void;

    getCursor(mouseX: number, mouseY: number): CursorType;

    saveData(): T;
    loadData(data: T): void;

    hasSelection(): boolean;
}