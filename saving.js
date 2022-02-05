import { Ring, Mogo, GameObject } from "./gameobject.js";
import { points, gameobjects, slot } from "./map.js";

const FIELD_SIDE = 713.74;

// This isn't used
const starting_gameobjects = [
    new Mogo(
        FIELD_SIDE / 2,
        FIELD_SIDE / 4,
        180,
        0
    ),
    new Mogo(
        FIELD_SIDE / 2,
        (FIELD_SIDE / 4) * 2,
        0,
        0
    ),
    new Mogo(
        FIELD_SIDE / 2,
        (FIELD_SIDE / 4) * 3,
        0,
        0
    ),
    new Mogo(
        (FIELD_SIDE / 12) * 3,
        (FIELD_SIDE / 12) * 11,
        270,
        1
    ),
    new Mogo(
        (FIELD_SIDE / 12) * 1,
        (FIELD_SIDE / 6) * 2,
        0,
        1
    ),
    new Mogo(
        (FIELD_SIDE / 12) * 9,
        (FIELD_SIDE / 12) * 1,
        90,
        2
    ),
    new Mogo(
        (FIELD_SIDE / 12) * 11,
        (FIELD_SIDE / 3) * 2,
        180,
        2
    ),
    new Ring(FIELD_SIDE / 2, 29.708333333333332), new Ring(FIELD_SIDE / 2, 59.416666666666664), new Ring(FIELD_SIDE / 2, 89.125), new Ring(FIELD_SIDE / 2, FIELD_SIDE / 6), new Ring(386.2083333333333, FIELD_SIDE / 6), new Ring(415.91666666666663, FIELD_SIDE / 6), new Ring(445.625, FIELD_SIDE / 6), new Ring(475.3333333333333, FIELD_SIDE / 6), new Ring(FIELD_SIDE / 2, 237.66666666666666), new Ring(FIELD_SIDE / 2, 267.375), new Ring(FIELD_SIDE / 2, 297.0833333333333), new Ring(FIELD_SIDE / 2, 475.3333333333333), new Ring(FIELD_SIDE / 2, 445.625), new Ring(FIELD_SIDE / 2, 445.625), new Ring(FIELD_SIDE / 2, 415.91666666666663), new Ring(FIELD_SIDE / 2, 594.1666666666666), new Ring(FIELD_SIDE / 2, 623.875), new Ring(FIELD_SIDE / 2, 653.5833333333333), new Ring(FIELD_SIDE / 2, 683.2916666666666), new Ring(326.79166666666663, 594.1666666666666), new Ring(297.0833333333333, 594.1666666666666), new Ring(267.375, 594.1666666666666), new Ring(237.66666666666666, 594.1666666666666), new Ring(475.3333333333333, FIELD_SIDE / 2), new Ring(490.1875, FIELD_SIDE / 2), new Ring(475.3333333333333, 341.6458333333333), new Ring(460.47916666666663, FIELD_SIDE / 2), new Ring(475.3333333333333, 371.35416666666663), new Ring(475.3333333333333, 475.3333333333333), new Ring(490.1875, 475.3333333333333), new Ring(475.3333333333333, 460.47916666666663), new Ring(460.47916666666663, 475.3333333333333), new Ring(475.3333333333333, 490.1875), new Ring(237.66666666666666, FIELD_SIDE / 2), new Ring(252.52083333333331, FIELD_SIDE / 2), new Ring(222.8125, FIELD_SIDE / 2), new Ring(237.66666666666666, 341.6458333333333), new Ring(237.66666666666666, 371.35416666666663), new Ring(237.66666666666666, 237.66666666666666), new Ring(237.66666666666666, 222.8125), new Ring(252.52083333333331, 237.66666666666666), new Ring(237.66666666666666, 252.52083333333331), new Ring(222.8125, 237.66666666666666)
];

document.getElementById("clear-button").addEventListener("click", () => {
    localStorage.removeItem(slot);
    const slots = localStorage.getItem("all-slots-list")?.split("|");
    if (slots) localStorage.setItem("all-slots-list", slots.filter((v) => v != slot).join("|"));
    else localStorage.setItem("all-slots-list", slot);
    load(slot);
});

document.getElementById("clear-all-button").addEventListener("click", () => {
    localStorage.clear();
    document.getElementById("slot-selector").value = "slot1";
    load(slot);
});

/**
 * @param {string} slot
 * @param {Array<{x:number,y:number,reversed:boolean}>} points
 * @param {Array<GameObject>} gameobjects
 */
export function save(slot, points, gameobjects) {
    let data = "";

    points.forEach((point) => {
        data += point.x.toFixed(2) + "-";
        data += point.y.toFixed(2) + "-";
        data += point.step.toFixed(0);
        data += "/";
    });
    data += "|"
    gameobjects.forEach(gameobject => {
        data += gameobject.encode() + "/";
    });

    window.localStorage.setItem(slot, data);

    const slots = localStorage.getItem("all-slots-list")?.split("|");
    if (slots) {
        if (!slots.includes(slot)) {
            slots.push(slot);
            localStorage.setItem("all-slots-list", slots.join("|"));
        }
    }
    else {
        localStorage.setItem("all-slots-list", slot);
    }
}

/**
 * @param {string} slot
 * 
 */
export async function load(slot) {
    if (!localStorage.getItem("all-slots-list")) localStorage.setItem("all-slots-list", "slot1");

    const data = window.localStorage.getItem(slot);
    let raw = data?.split("|");

    if (data == null) {
        points.length = 0;
        gameobjects.length = 0;

        raw = await (await (await fetch("./default_save")).text()).split("|");
    };

    let raw_points = raw[0].split("/");
    let raw_gameobjects = raw[1].split("/");

    if (raw_points[raw_points.length-1] == '') raw_points.pop();
    if (raw_gameobjects[raw_gameobjects.length-1] == '') raw_gameobjects.pop();

    points.length = 0;
    gameobjects.length = 0;

    raw_points.forEach(raw_point => {
        let raw = raw_point.split("-")
        let x = +raw[0];
        let y = +raw[1];
        let step = +raw[2];

        if (!isNaN(x) && !isNaN(y))
            points.push({
            x,
            y,
            step
        });
    });

    raw_gameobjects.forEach(raw_gameobject => {
        if (!raw_gameobject) return;

        let gameobject;
        if (Ring.isEncode(raw_gameobject)) gameobject = Ring.decode(raw_gameobject);
        if (Mogo.isEncode(raw_gameobject)) gameobject = Mogo.decode(raw_gameobject);
        if (gameobject) gameobjects.push(gameobject);
    });
}