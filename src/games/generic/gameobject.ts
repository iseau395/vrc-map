import type { Renderable } from "util/class-bases";

export default interface Gameobject extends Renderable {
    update(x: number, y: number, z: number): void;

    pointInside(x: number, y: number): boolean;
}