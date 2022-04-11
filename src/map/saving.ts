import { Ring, Mogo, GameObject } from "./gameobject";
import {
    points,
    gameobjects,
} from "../stores/objects";
import type { Point } from "./var";

const default_save =
    "|mogo-713.74-356.87-180-0/mogo-713.74-713.74-0-0/mogo-713.74-1070.61-0-0/mogo-356.87-1308.52-270-1/mogo-118.96-475.83-0-1/mogo-1070.61-118.96-90-2/mogo-1308.52-951.65-180-2/ring-713.74-59.48/ring-713.74-118.96/ring-713.74-178.44/ring-713.74-237.91/ring-773.22-237.91/ring-832.70-237.91/ring-892.17-237.91/ring-951.65-237.91/ring-713.74-475.83/ring-713.74-535.30/ring-713.74-594.78/ring-713.74-832.70/ring-713.74-892.17/ring-713.74-951.65/ring-713.74-1189.57/ring-713.74-1249.05/ring-713.74-1308.52/ring-713.74-1368.00/ring-654.26-1189.57/ring-594.78-1189.57/ring-535.30-1189.57/ring-475.83-1189.57/ring-951.65-713.74/ring-981.39-713.74/ring-921.91-713.74/ring-951.65-684.00/ring-951.65-743.48/ring-951.65-951.65/ring-981.39-951.65/ring-951.65-921.91/ring-921.91-951.65/ring-951.65-981.39/ring-475.83-713.74/ring-505.57-713.74/ring-475.83-684.00/ring-446.09-713.74/ring-475.83-743.48/ring-475.83-475.83/ring-475.83-505.57/ring-505.57-475.83/ring-475.83-446.09/ring-446.09-475.83/";

export function save(
    slot: string,
    points: Point[],
    gameobjects: GameObject[]
) {
    let data = "";

    points.forEach((point) => {
        data += point.x.toFixed(2) + "-";
        data += point.y.toFixed(2) + "-";
        data += point.step.toFixed(0);
        data += "/";
    });
    data += "|";
    gameobjects.forEach((gameobject) => {
        data += gameobject.encode() + "/";
    });

    localStorage.setItem(`slot-${slot}`, data);

    const slots = localStorage.getItem("all-slots-list")?.split("|");
    if (slots) {
        if (!slots.includes(slot)) {
            slots.push(slot);
            localStorage.setItem("all-slots-list", slots.join("|"));
        }
    } else {
        localStorage.setItem("all-slots-list", slot);
    }
}

export async function load(slot: string) {
    if (!localStorage.getItem("all-slots-list"))
        localStorage.setItem("all-slots-list", slot);

    const data = localStorage.getItem(`slot-${slot}`);
    let raw = data?.split("|");

    const points_temp = new Array<Point>();
    const gameobjects_temp = new Array<GameObject>();

    if (!data) {
        raw = default_save.split("|");
    }

    let raw_points = raw[0].split("/");
    let raw_gameobjects = raw[1].split("/");

    if (raw_points[raw_points.length - 1] == "") raw_points.pop();
    if (raw_gameobjects[raw_gameobjects.length - 1] == "")
        raw_gameobjects.pop();

    raw_points.forEach((raw_point) => {
        let raw = raw_point.split("-");
        let x = +raw[0];
        let y = +raw[1];
        let step = +raw[2];

        if (!isNaN(x) && !isNaN(y))
            points_temp.push({
                x,
                y,
                step,
            });
    });

    raw_gameobjects.forEach((raw_gameobject) => {
        if (!raw_gameobject) return;

        let gameobject;
        if (Ring.isEncode(raw_gameobject))
            gameobject = Ring.decode(raw_gameobject);
        if (Mogo.isEncode(raw_gameobject))
            gameobject = Mogo.decode(raw_gameobject);
        if (gameobject) gameobjects_temp.push(gameobject);
    });

    points.set(points_temp);
    gameobjects.set(gameobjects_temp);
}