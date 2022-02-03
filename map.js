import { Ring, Mogo, GameObject } from "./gameobject.js";
import { drawDot } from "./drawing.js";

const PATH_COLOR = "rgb(100, 255, 100)";
const UNFINISHED_COLOR = "rgb(100, 255, 255)";
const REVERSED_PATH_COLOR = "rgb(255, 100, 100)";
const REVERSED_UNFINISHED_COLOR = "rgb(255, 200, 0)";

const GRID_COLOR = "rgba(155, 155, 155, 0.5)";

export const NEUTRAL_MOGO = "rgb(255, 255, 0)";
export const RED_ALLIANCE = "rgb(255, 0, 0)";
export const BLUE_ALLIANCE = "rgb(0, 0, 255)";
export const RING_COLOR = "rgb(255, 0, 255)";
const FIELD_COLOR = "rgb(125, 125, 125)";
const LINE_COLOR = "rgb(255, 255, 255)";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("map-canvas");

canvas.focus();

const GRID_SCALE = 48;

const FIELD_SIDE = canvas.width;
const FIELD_GRID = FIELD_SIDE / GRID_SCALE;

const ctx = canvas.getContext('2d');

/**
 * @type {Array<{x:number,y:number,reversed:boolean}}
 */
const points = new Array();
/**
 * @type {Array<{x:number,y:number}}
 */
let undo = new Array();

/**
 * @type {Array<GameObject>}
 */
const gameobjects = [
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

/**
 * @type {{array:string,index:number}}
 */
let selection = {
    array: "none",
    index: NaN
};

let lastX = 0;
let lastY = 0;

let mouseDown = false;

let mouseX;
let mouseY;

let ctrlDown = false;
let shiftDown = false;
let altDown = false;
let reverseKey = false;

{
    canvas.addEventListener("mousedown", (event) => {
        if (event.button != 0) return;

        mouseDown = true;
    });
    canvas.addEventListener("mouseup", (event) => {
        if (event.button != 0) return;

        mouseDown = false;

        if (!shiftDown) {
            points.push({
                x: mouseX,
                y: mouseY,
                reversed: reverseKey
            });

            undo = [];
        }
        selection = {
            array: "none",
            index: NaN
        };
    });
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        gameobjects.push(new Ring(mouseX, mouseY));
    });

    canvas.addEventListener("mousemove", (event) => {
        const x = event.x - canvas.offsetLeft;
        const y = event.y - canvas.offsetTop;

        mouseX = !event.ctrlKey ?
            (lastX % FIELD_GRID * event.altKey) +
            Math.round((x - (lastX % FIELD_GRID * event.altKey)) / FIELD_GRID) * FIELD_GRID :
            x;

        mouseY = !event.ctrlKey ?
            (lastY % FIELD_GRID * event.altKey) +
            Math.round((y - (lastY % FIELD_GRID * event.altKey)) / FIELD_GRID) * FIELD_GRID :
            y;

        if (event.shiftKey && mouseDown && selection.array == "none") {

            gameobjects.forEach((gameobject, i) => {
                if (gameobject.pointInside(x, y)) {
                    selection = {
                        array: "gameobjects",
                        index: i
                    };
                }
            });

            points.forEach((point, i) => {
                if ((x - point.x) ** 2 + (y - point.y) ** 2 <= 16 ** 2) {
                    selection = {
                        array: "points",
                        index: i
                    };
                }
            });
        } else if (!event.shiftKey) {
            selection = {
                array: "none",
                index: NaN
            };
        }

        switch (selection.array) {
            case "gameobjects":
                gameobjects[selection.index].x = mouseX;
                gameobjects[selection.index].y = mouseY;
                break;
            case "points":
                points[selection.index].x = mouseX;
                points[selection.index].y = mouseY;
                break;
        }
    });

    canvas.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.code == "KeyZ") {
            const point = points.pop();
            if (point) undo.push(point);
        }
        if (event.ctrlKey && event.code == "KeyY") {
            const point = undo.pop();
            if (point) points.push(point);
        }

        ctrlDown = event.ctrlKey;
        shiftDown = event.shiftKey;
        altDown = event.altKey;

        if (event.key == "r") reverseKey = true;

        if (ctrlDown || shiftDown || altDown) event.preventDefault();
    });
    canvas.addEventListener("keyup", (event) => {
        ctrlDown = event.ctrlKey;
        shiftDown = event.shiftKey;
        altDown = event.altKey;

        if (event.key == "r") reverseKey = false;
    });
}

function drawPlatform(x, y, color) {
    const longEdge = FIELD_SIDE / 3;
    const shortEdge = FIELD_SIDE / 6;

    ctx.strokeStyle = color;
    ctx.lineWidth = 10;

    ctx.beginPath();

    ctx.moveTo(x + shortEdge / 10, y + longEdge / 8);
    ctx.lineTo(x + shortEdge - shortEdge / 10, y + longEdge / 8);
    ctx.lineTo(x + shortEdge - shortEdge / 10, y + (longEdge / 8) * 7);
    ctx.lineTo(x + shortEdge / 10, y + (longEdge / 8) * 7);
    ctx.lineTo(x + shortEdge / 10, y + longEdge / 8 - 5);

    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(x, y, shortEdge, longEdge);

    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x + shortEdge + 1, y);
    ctx.lineTo(x + shortEdge + 1, y + longEdge);

    ctx.moveTo(x - 1, y);
    ctx.lineTo(x - 1, y + longEdge);

    ctx.stroke();
    ctx.closePath();
}

function drawField() {
    ctx.fillStyle = FIELD_COLOR;
    ctx.lineWidth = 5;
    ctx.fillRect(0, 0, FIELD_SIDE, FIELD_SIDE);

    let gridScale = 6;
    let fieldGrid = FIELD_SIDE / gridScale;
    ctx.lineWidth = 3;
    ctx.strokeStyle = GRID_COLOR;
    ctx.beginPath();
    for (let i = 0; i < gridScale; i++) {
        ctx.moveTo(fieldGrid * i, 0);
        ctx.lineTo(fieldGrid * i, FIELD_SIDE);
    }
    for (let i = 0; i < gridScale; i++) {
        ctx.moveTo(0, fieldGrid * i);
        ctx.lineTo(FIELD_SIDE, fieldGrid * i);
    }
    ctx.stroke();


    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();

    ctx.moveTo(FIELD_SIDE / 3, 0);
    ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE);

    ctx.moveTo(FIELD_SIDE / 2 - 2, 0);
    ctx.lineTo(FIELD_SIDE / 2 - 2, FIELD_SIDE);
    ctx.moveTo(FIELD_SIDE / 2 + 2, 0);
    ctx.lineTo(FIELD_SIDE / 2 + 2, FIELD_SIDE);

    ctx.moveTo((FIELD_SIDE / 3) * 2, 0);
    ctx.lineTo((FIELD_SIDE / 3) * 2, FIELD_SIDE);

    ctx.moveTo((FIELD_SIDE / 6) * 4, FIELD_SIDE / 6);
    ctx.lineTo((FIELD_SIDE / 6) * 5, 0);

    ctx.moveTo((FIELD_SIDE / 6) * 2, (FIELD_SIDE / 6) * 5);
    ctx.lineTo((FIELD_SIDE / 6) * 1, FIELD_SIDE);

    ctx.stroke();

    ctx.closePath();


    drawPlatform(0, (FIELD_SIDE / 6) * 2, RED_ALLIANCE);
    drawPlatform((FIELD_SIDE / 6) * 5, (FIELD_SIDE / 6) * 2, BLUE_ALLIANCE);

    gameobjects.forEach((gameobject) =>
        gameobject.render(ctx)
    );
}

function tick() {
    lastX = points[points.length - 1]?.x ?? 0;
    lastY = points[points.length - 1]?.y ?? 0;

    drawField();

    if (!ctrlDown) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = GRID_COLOR;
        ctx.beginPath();
        for (let i = 0; i < GRID_SCALE; i++) {
            ctx.moveTo(FIELD_GRID * i + (lastX % FIELD_GRID * altDown), 0);
            ctx.lineTo(FIELD_GRID * i + (lastX % FIELD_GRID * altDown), FIELD_SIDE);
        }
        for (let i = 0; i < GRID_SCALE; i++) {
            ctx.moveTo(0, FIELD_GRID * i + (lastY % FIELD_GRID * altDown));
            ctx.lineTo(FIELD_SIDE, FIELD_GRID * i + (lastY % FIELD_GRID * altDown));
        }
        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 0; i < points.length; i++) {
        if (points[i].reversed) {
            if (selection.index == i && selection.array == "points") drawDot(points[i].x, points[i].y, REVERSED_UNFINISHED_COLOR, ctx);
            else drawDot(points[i].x, points[i].y, REVERSED_PATH_COLOR, ctx);
        } else {
            if (selection.index == i && selection.array == "points") drawDot(points[i].x, points[i].y, UNFINISHED_COLOR, ctx);
            else drawDot(points[i].x, points[i].y, PATH_COLOR, ctx);
        }

        ctx.strokeStyle = (selection.index == i || selection.index + 1 == i) && selection.array == "points" ? UNFINISHED_COLOR : PATH_COLOR;
        if (points[i].reversed && points[i-1]?.reversed) ctx.strokeStyle = (selection.index == i || selection.index + 1 == i) && selection.array == "points" ? REVERSED_UNFINISHED_COLOR : REVERSED_PATH_COLOR;

        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[i - 1]?.x ?? points[i].x, points[i - 1]?.y ?? points[i].y);
        ctx.lineTo(points[i].x, points[i].y);

        ctx.stroke();
        ctx.closePath();

        /**
         * @type {number}
         */
        let angle = (Math.atan2(points[i].y - points[i + 1]?.y, points[i].x - points[i + 1]?.x) * 180 / Math.PI) -
            (Math.atan2(points[i - 1]?.y - points[i]?.y, points[i - 1]?.x - points[i].x) * 180 / Math.PI);

        if (i == 0)
            angle = (Math.atan2(points[0].y - points[1]?.y, points[0].x - points[1]?.x) * 180 / Math.PI);

        if (!isNaN(angle))
            ctx.fillText(`${Math.round(angle)}\u00B0`, points[i].x + 20, points[i].y + 20);

        ctx.fillStyle = (selection.index == i || selection.index - 1 == i) && selection.array == "points" ? UNFINISHED_COLOR : PATH_COLOR;
        if (points[i].reversed && points[i+1]?.reversed) ctx.fillStyle = (selection.index == i || selection.index - 1 == i) && selection.array == "points" ? REVERSED_UNFINISHED_COLOR : REVERSED_PATH_COLOR;

        const distance = Math.sqrt(
            (points[i].x - points[i + 1]?.x) ** 2 +
            (points[i].y - points[i + 1]?.y) ** 2
        ) / 2;
        if (!isNaN(distance))
            ctx.fillText(`${Math.round(distance * 100) / 100}cm`, points[i].x - (points[i].x - points[i + 1]?.x) / 2, points[i].y - (points[i].y - points[i + 1]?.y) / 2 - 20);

    }

    if (mouseDown && !shiftDown && selection.array == "none") {
        ctx.lineWidth = 3;
        ctx.strokeStyle = UNFINISHED_COLOR;

        ctx.beginPath();
        if (points.length == 0) ctx.moveTo(mouseX, mouseY);
        else ctx.moveTo(lastX, lastY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.closePath();

        // if (points.length == 0) drawDot(clickX, clickY, UNFINISHED_COLOR);
        drawDot(mouseX, mouseY, UNFINISHED_COLOR, ctx);
    }

}

setInterval(tick, 10);