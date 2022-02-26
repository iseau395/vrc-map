import { Ring, Mogo, GameObject } from "./gameobject";
import type { Point } from "./var";

const default_save =
    "|mogo-356.50-178.25-180-0/mogo-356.50-356.50-0-0/mogo-356.50-534.75-0-0/mogo-178.25-653.58-270-1/mogo-59.42-237.67-0-1/mogo-534.75-59.42-90-2/mogo-653.58-475.33-180-2/ring-356.50-29.71/ring-356.50-59.42/ring-356.50-89.13/ring-356.50-118.83/ring-386.21-118.83/ring-415.92-118.83/ring-445.63-118.83/ring-475.33-118.83/ring-356.50-237.67/ring-356.50-267.38/ring-356.50-297.08/ring-356.50-475.33/ring-356.50-445.63/ring-356.50-445.63/ring-356.50-415.92/ring-356.50-594.17/ring-356.50-623.88/ring-356.50-653.58/ring-356.50-683.29/ring-326.79-594.17/ring-297.08-594.17/ring-267.38-594.17/ring-237.67-594.17/ring-475.33-356.50/ring-490.19-356.50/ring-475.33-341.65/ring-460.48-356.50/ring-475.33-371.35/ring-475.33-475.33/ring-490.19-475.33/ring-475.33-460.48/ring-460.48-475.33/ring-475.33-490.19/ring-237.67-356.50/ring-252.52-356.50/ring-222.81-356.50/ring-237.67-341.65/ring-237.67-371.35/ring-237.67-237.67/ring-237.67-222.81/ring-252.52-237.67/ring-237.67-252.52/ring-222.81-237.67/";

// document.getElementById("clear-button").addEventListener("click", () => {
//     localStorage.removeItem(getSlot());
//     const slots = localStorage.getItem("all-slots-list")?.split("|");
//     if (slots)
//         localStorage.setItem(
//             "all-slots-list",
//             slots.filter((v) => v != getSlot()).join("|")
//         );
//     else localStorage.setItem("all-slots-list", getSlot());
//     load(getSlot());
// });

// document
//     .getElementById("clear-all-button")
//     .addEventListener("click", () => {
//         const settings = localStorage.getItem("settings");
//         localStorage.clear();
//         localStorage.setItem("settings", settings);

//         setSlot("slot1");
//         (document.getElementById("slot-selector") as HTMLInputElement).value = "slot1";

//         load(getSlot());
//     });

/**
 * @param {string} slot
 * @param {Array<{x:number,y:number,reversed:boolean}>} points
 * @param {Array<GameObject>} gameobjects
 */
export function save(slot, points, gameobjects) {
    slot = `slot-${slot}`;
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

    window.localStorage.setItem(slot, data);

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

/**
 * @param {string} slot
 *
 */
export async function load(slot): Promise<[Point[], GameObject[]]> {
    if (!localStorage.getItem("all-slots-list"))
        localStorage.setItem("all-slots-list", "slot-slot1");

    const data = window.localStorage.getItem(slot);
    let raw = data?.split("|");

    const points = [];
    const gameobjects = [];

    if (data == null) {
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
            points.push({
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
        if (gameobject) gameobjects.push(gameobject);
    });

    return [points, gameobjects]
}