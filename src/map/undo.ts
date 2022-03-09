import { gameobjects as gameobjects_store, points as points_store } from '../stores/objects';
import type { GameObject } from './gameobject';
import type { Point } from './var';

let gameobjects: GameObject[];
gameobjects_store.subscribe(v => gameobjects = v);
let points: Point[];
points_store.subscribe(v => points = v);

export enum UndoType {
    Add,
    Remove,
    Move
}

export type ArrayType = "points" | "gameobjects";

interface UndoOptions {
    [UndoType.Add]: {
        array: ArrayType;
        key: number;
    },
    [UndoType.Remove]: {
        array: ArrayType;
        key: number;
        object: Point | GameObject;
    },
    [UndoType.Move]: {
        array: ArrayType;
        key: number;
        old_x: number;
        old_y: number;
    }
}

export class Undo<T extends UndoType, O = UndoOptions[T]> {
    type: T;
    options: O;

    constructor(type: T, options: O) {
        this.type = type;
        this.options = options;
    }
}

function process_change(array: "undos" | "redos") {
    const change = array == "undos" ? undos.pop() : redos.pop();

    if (!change) return;

    switch (change.type) {
        case UndoType.Add: {
            switch (change.options.array) {
                case "gameobjects": {
                    (array == "undos" ? redos : undos).push(new Undo(
                        UndoType.Remove,
                        {
                            array: "gameobjects",
                            key: change.options.key,
                            object: gameobjects[change.options.key]
                        }
                    ));

                    gameobjects.splice(change.options.key, 1);
                    gameobjects_store.set(gameobjects);

                    break;
                }
                case "points": {
                    (array == "undos" ? redos : undos).push(new Undo(
                        UndoType.Remove,
                        {
                            array: "points",
                            key: change.options.key,
                            object: points[change.options.key]
                        }
                    ));

                    points.splice(change.options.key, 1);
                    points_store.set(points);

                    break;
                }
            }

            break;
        }

        case UndoType.Remove: {
            switch (change.options.array) {
                case "gameobjects": {
                    (array == "undos" ? redos : undos).push(new Undo(
                        UndoType.Add,
                        {
                            array: "gameobjects",
                            key: change.options.key
                        }
                    ));

                    gameobjects.splice(change.options.key, 0, change.options.object as GameObject);
                    gameobjects_store.set(gameobjects);

                    break;
                }
                case "points": {
                    (array == "undos" ? redos : undos).push(new Undo(
                        UndoType.Add,
                        {
                            array: "points",
                            key: change.options.key
                        }
                    ));

                    points.splice(change.options.key, 0, change.options.object as Point);
                    points_store.set(points);

                    break;
                }
            }

            break;
        }

        case UndoType.Move: {
            switch (change.options.array) {
                case "gameobjects": {
                    (array == "undos" ? redos : undos).push(new Undo(
                        UndoType.Move,
                        {
                            ...change.options,
                            array: "gameobjects"
                        }
                    ));

                    const object = gameobjects[change.options.key];
                    object.x = change.options.old_x;
                    object.y = change.options.old_y;
                    gameobjects[change.options.key] = object;

                    gameobjects_store.set(gameobjects);

                    break;
                }
                case "points": {
                    (array == "undos" ? redos : undos).push(new Undo(
                        UndoType.Move,
                        {
                            ...change.options,
                            array: "points"
                        }
                    ));

                    const object = points[change.options.key];
                    object.x = change.options.old_x;
                    object.y = change.options.old_y;
                    points[change.options.key] = object;

                    points_store.set(points);

                    break;
                }
            }

            break;
        }
    }
}

export function undo() {
    process_change("undos");
}

export function redo() {
    process_change("redos");
}

export function add_undo<T extends UndoType>(type: T, options: UndoOptions[T]) {
    undos.push(new Undo(
        type,
        options
    ));

    redos.length = 0;
}

const undos = new Array<Undo<any>>();
const redos = new Array<Undo<any>>();