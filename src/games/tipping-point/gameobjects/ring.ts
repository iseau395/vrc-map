import type Gameobject from "games/generic/gameobject";

export default class Ring implements Gameobject {
    update(mouseX: number, mouseY: number, mouseButton: number) {

    }

    pointInside(x: number, y: number): boolean {
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {

    }
}