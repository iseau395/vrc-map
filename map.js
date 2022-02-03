import { Ring, Mogo, GameObject } from "./gameobject.js";
import { drawDot } from "./drawing.js";

const PATH_COLOR = "rgb(100, 255, 100)";
const UNFINISHED_COLOR = "rgb(100, 255, 255)";
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
 * @type {Array<{x:number,y:number}}
 */
const lines = new Array();
/**
 * @type {Array<{x:number,y:number}}
 */
let undo = new Array();

// /**
//  * @type {Array<{x:number,y:number}>}
//  */
// const rings = [
//     { "x": FIELD_SIDE / 2, "y": 29.708333333333332 }, { "x": FIELD_SIDE / 2, "y": 59.416666666666664 }, { "x": FIELD_SIDE / 2, "y": 89.125 }, { "x": FIELD_SIDE / 2, "y": FIELD_SIDE / 6 }, { "x": 386.2083333333333, "y": FIELD_SIDE / 6 }, { "x": 415.91666666666663, "y": FIELD_SIDE / 6 }, { "x": 445.625, "y": FIELD_SIDE / 6 }, { "x": 475.3333333333333, "y": FIELD_SIDE / 6 }, { "x": FIELD_SIDE / 2, "y": 237.66666666666666 }, { "x": FIELD_SIDE / 2, "y": 267.375 }, { "x": FIELD_SIDE / 2, "y": 297.0833333333333 }, { "x": FIELD_SIDE / 2, "y": 475.3333333333333 }, { "x": FIELD_SIDE / 2, "y": 445.625 }, { "x": FIELD_SIDE / 2, "y": 445.625 }, { "x": FIELD_SIDE / 2, "y": 415.91666666666663 }, { "x": FIELD_SIDE / 2, "y": 594.1666666666666 }, { "x": FIELD_SIDE / 2, "y": 623.875 }, { "x": FIELD_SIDE / 2, "y": 653.5833333333333 }, { "x": FIELD_SIDE / 2, "y": 683.2916666666666 }, { "x": 326.79166666666663, "y": 594.1666666666666 }, { "x": 297.0833333333333, "y": 594.1666666666666 }, { "x": 267.375, "y": 594.1666666666666 }, { "x": 237.66666666666666, "y": 594.1666666666666 }, { "x": 475.3333333333333, "y": FIELD_SIDE / 2 }, { "x": 490.1875, "y": FIELD_SIDE / 2 }, { "x": 475.3333333333333, "y": 341.6458333333333 }, { "x": 460.47916666666663, "y": FIELD_SIDE / 2 }, { "x": 475.3333333333333, "y": 371.35416666666663 }, { "x": 475.3333333333333, "y": 475.3333333333333 }, { "x": 490.1875, "y": 475.3333333333333 }, { "x": 475.3333333333333, "y": 460.47916666666663 }, { "x": 460.47916666666663, "y": 475.3333333333333 }, { "x": 475.3333333333333, "y": 490.1875 }, { "x": 237.66666666666666, "y": FIELD_SIDE / 2 }, { "x": 252.52083333333331, "y": FIELD_SIDE / 2 }, { "x": 222.8125, "y": FIELD_SIDE / 2 }, { "x": 237.66666666666666, "y": 341.6458333333333 }, { "x": 237.66666666666666, "y": 371.35416666666663 }, { "x": 237.66666666666666, "y": 237.66666666666666 }, { "x": 237.66666666666666, "y": 222.8125 }, { "x": 252.52083333333331, "y": 237.66666666666666 }, { "x": 237.66666666666666, "y": 252.52083333333331 }, { "x": 222.8125, "y": 237.66666666666666 }
// ];

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
let clickX;
let clickY;

let mouseInCanvas = false;
let mouseX;
let mouseY;

let ctrlDown = false;
let shiftDown = false;
let altDown = false;
{
    canvas.addEventListener("mousedown", (event) => {
        if (event.button != 0) return;

        mouseDown = true;
    });
    canvas.addEventListener("mouseup", (event) => {
        if (event.button != 0) return;

        mouseDown = false;

        if (!shiftDown) {
            lines.push({
                x: mouseX,
                y: mouseY
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

            lines.forEach((line, i) => {
                if ((x - line.x) ** 2 + (y - line.y) ** 2 <= 16 ** 2) {
                    selection = {
                        array: "lines",
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
            case "lines":
                lines[selection.index].x = mouseX;
                lines[selection.index].y = mouseY;
                break;
        }
    });
    canvas.addEventListener("mouseenter", () => {
        mouseInCanvas = true;
    });
    canvas.addEventListener("mouseexit", () => {
        mouseInCanvas = false;
    });

    canvas.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.code == "KeyZ") {
            const point = lines.pop();
            if (point) undo.push(point);
        }
        if (event.ctrlKey && event.code == "KeyY") {
            const point = undo.pop();
            if (point) lines.push(point);
        }

        ctrlDown = event.ctrlKey;
        shiftDown = event.shiftKey;
        altDown = event.altKey;

        if (ctrlDown || shiftDown || altDown) event.preventDefault();
    });
    canvas.addEventListener("keyup", (event) => {
        if (event.defaultPrevented) return;

        ctrlDown = event.ctrlKey;
        shiftDown = event.shiftKey;
        altDown = event.altKey;
    });
}

function drawMOGO(x, y, color, rotation) {
    rotation += 14;
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgb(50, 50, 50)";
    ctx.lineWidth = 3;
    polygon(x, y, 25.94, 7, rotation);
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
    lastX = lines[lines.length - 1]?.x ?? 0;
    lastY = lines[lines.length - 1]?.y ?? 0;

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


    for (let i = 0; i < lines.length; i++) {
        if (selection.index == i && selection.array == "lines") drawDot(lines[i].x, lines[i].y, UNFINISHED_COLOR, ctx);
        else drawDot(lines[i].x, lines[i].y, PATH_COLOR, ctx);

        ctx.strokeStyle = (selection.index == i || selection.index + 1 == i) && selection.array == "lines" ? UNFINISHED_COLOR : PATH_COLOR;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lines[i - 1]?.x ?? lines[i].x, lines[i - 1]?.y ?? lines[i].y);
        ctx.lineTo(lines[i].x, lines[i].y);

        ctx.stroke();
        ctx.closePath();

        /**
         * @type {number}
         */
        let angle = (Math.atan2(lines[i].y - lines[i + 1]?.y, lines[i].x - lines[i + 1]?.x) * 180 / Math.PI) -
            (Math.atan2(lines[i - 1]?.y - lines[i]?.y, lines[i - 1]?.x - lines[i].x) * 180 / Math.PI);

        if (i == 0)
            angle = (Math.atan2(lines[0].y - lines[1]?.y, lines[0].x - lines[1]?.x) * 180 / Math.PI);

        if (!isNaN(angle))
            ctx.fillText(`${Math.round(angle)}\u00B0`, lines[i].x + 20, lines[i].y + 20);

        ctx.fillStyle = (selection.index == i || selection.index - 1 == i) && selection.array == "lines" ? UNFINISHED_COLOR : PATH_COLOR;

        const distance = Math.sqrt(
            (lines[i].x - lines[i + 1]?.x) ** 2 +
            (lines[i].y - lines[i + 1]?.y) ** 2
        ) / 2;
        if (!isNaN(distance))
            ctx.fillText(`${Math.round(distance * 100) / 100}cm`, lines[i].x - (lines[i].x - lines[i + 1]?.x) / 2, lines[i].y - (lines[i].y - lines[i + 1]?.y) / 2 - 20);

    }

    if (mouseDown && mouseInCanvas && !shiftDown && selection.array == "none") {
        ctx.lineWidth = 3;
        ctx.strokeStyle = UNFINISHED_COLOR;

        ctx.beginPath();
        if (lines.length == 0) ctx.moveTo(mouseX, mouseY);
        else ctx.moveTo(lastX, lastY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.closePath();

        // if (lines.length == 0) drawDot(clickX, clickY, UNFINISHED_COLOR);
        drawDot(mouseX, mouseY, UNFINISHED_COLOR, ctx);
    }

}

setInterval(tick, 10);