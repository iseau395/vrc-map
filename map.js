const PATH_COLOR = "rgb(100, 255, 100)";
const UNFINISHED_COLOR = "rgb(100, 255, 255)";
const GRID_COLOR = "rgba(155, 155, 155, 0.5)";

const NEUTRAL_MOGO = "rgb(255, 255, 0)";
const RED_ALLIANCE = "rgb(255, 0, 0)";
const BLUE_ALLIANCE = "rgb(0, 0, 255)";
const RING_COLOR = "rgb(255, 0, 255)";
const FIELD_COLOR = "rgb(125, 125, 125)";
const LINE_COLOR = "rgb(255, 255, 255)";


/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("map-canvas");

const GRID_SCALE = 48;

const FIELD_SIDE = canvas.width;
const FIELD_GRID = FIELD_SIDE / GRID_SCALE;

if (canvas.getContext) {
    canvas.focus();
    const ctx = canvas.getContext('2d');

    /**
     * @type {Array<{x:number,y:number}}
     */
    const lines = new Array();
    /**
     * @type {Array<{x:number,y:number}}
     */
    let undo = new Array();

    /**
     * @type {Array<{x:number,y:number,style:string,rot:number}>}
     */
    const mogos = [
        {
            x: FIELD_SIDE / 2,
            y: FIELD_SIDE / 4,
            style: NEUTRAL_MOGO,
            rot: 180
        },
        {
            x: FIELD_SIDE / 2,
            y: (FIELD_SIDE / 4) * 2,
            style: NEUTRAL_MOGO,
            rot: 0
        },
        {
            x: FIELD_SIDE / 2,
            y: (FIELD_SIDE / 4) * 3,
            style: NEUTRAL_MOGO,
            rot: 0
        },
        {
            x: (FIELD_SIDE / 12) * 3,
            y: (FIELD_SIDE / 12) * 11,
            style: RED_ALLIANCE,
            rot: 270
        },
        {
            x: (FIELD_SIDE / 12) * 1,
            y: (FIELD_SIDE / 6) * 2,
            style: RED_ALLIANCE,
            rot: 0
        },
        {
            x: (FIELD_SIDE / 12) * 9,
            y: (FIELD_SIDE / 12) * 1,
            style: BLUE_ALLIANCE,
            rot: 90
        },
        {
            x: (FIELD_SIDE / 12) * 11,
            y: (FIELD_SIDE / 3) * 2,
            style: BLUE_ALLIANCE,
            rot: 180
        }
    ];
    /**
     * @type {Array<{x:number,y:number}>}
     */
    const rings = [
        { "x": 375, "y": 125 }, { "x": 375, "y": 93.75 }, { "x": 375, "y": 62.5 }, { "x": 375, "y": 31.25 }, { "x": 406.25, "y": 125 }, { "x": 437.5, "y": 125 }, { "x": 468.75, "y": 125 }, { "x": 500, "y": 125 }, { "x": 375, "y": 250 }, { "x": 375, "y": 281.25 }, { "x": 375, "y": 312.5 }, { "x": 375, "y": 437.5 }, { "x": 375, "y": 468.75 }, { "x": 375, "y": 500 }, { "x": 375, "y": 625 }, { "x": 375, "y": 656.25 }, { "x": 375, "y": 687.5 }, { "x": 375, "y": 718.75 }, { "x": 250, "y": 625 }, { "x": 281.25, "y": 625 }, { "x": 312.5, "y": 625 }, { "x": 343.75, "y": 625 }, { "x": 500, "y": 375 }, { "x": 515.625, "y": 375 }, { "x": 500, "y": 359.375 }, { "x": 484.375, "y": 375 }, { "x": 500, "y": 390.625 }, { "x": 500, "y": 500 }, { "x": 515.625, "y": 500 }, { "x": 500, "y": 484.375 }, { "x": 484.375, "y": 500 }, { "x": 500, "y": 515.625 }, { "x": 250, "y": 375 }, { "x": 265.625, "y": 375 }, { "x": 250, "y": 359.375 }, { "x": 234.375, "y": 375 }, { "x": 250, "y": 390.625 }, { "x": 250, "y": 250 }, { "x": 265.625, "y": 250 }, { "x": 250, "y": 234.375 }, { "x": 234.375, "y": 250 }, { "x": 250, "y": 265.625 }
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
            } else {
                selection = {
                    array: "none",
                    index: NaN
                };
            }
        });
        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            rings.push({
                x: Math.round((event.x - 7) / FIELD_GRID) * FIELD_GRID,
                y: Math.round((event.y - 7) / FIELD_GRID) * FIELD_GRID
            });
        });

        canvas.addEventListener("mousemove", (event) => {
            mouseX = !event.ctrlKey ?
                (lastX % FIELD_GRID * event.altKey) +
                Math.round(((event.x - 7) - (lastX % FIELD_GRID * event.altKey)) / FIELD_GRID) * FIELD_GRID :
                (event.x - 7);


            mouseY = !event.ctrlKey ?
                (lastY % FIELD_GRID * event.altKey) +
                Math.round(((event.y - 7) - (lastY % FIELD_GRID * event.altKey)) / FIELD_GRID) * FIELD_GRID :
                (event.y - 7);

            if (event.shiftKey && mouseDown && selection.array == "none") {

                mogos.forEach((mogo, i) => {
                    if ((event.x - mogo.x) ** 2 + (event.y - mogo.y) ** 2 <= 25.94 ** 2) {
                        selection = {
                            array: "mogos",
                            index: i
                        };
                    }
                });

                rings.forEach((ring, i) => {
                    if ((event.x - ring.x) ** 2 + (event.y - ring.y) ** 2 <= 16 ** 2) {
                        selection = {
                            array: "rings",
                            index: i
                        };
                    }
                });

                lines.forEach((line, i) => {
                    if ((event.x - line.x) ** 2 + (event.y - line.y) ** 2 <= 14 ** 2) {
                        selection = {
                            array: "lines",
                            index: i
                        };
                    }
                });
            }

            switch (selection.array) {
                case "mogos":
                    mogos[selection.index].x = event.x;
                    mogos[selection.index].y = event.y;
                    break;
                case "rings":
                    rings[selection.index].x = event.x;
                    rings[selection.index].y = event.y;
                    break;
                case "lines":
                    lines[selection.index].x = event.x;
                    lines[selection.index].y = event.y;
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

    /**
     * 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} radius 
     * @param {string | CanvasGradient | CanvasPattern | null} fillStyle 
     * @param {string | CanvasGradient | CanvasPattern | null} strokeStyle 
     */
    function drawCircle(centerX, centerY, radius, fillStyle, strokeStyle) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = fillStyle;
        if (fillStyle) ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = strokeStyle;
        if (strokeStyle) ctx.stroke();
        ctx.closePath();
    }

    /**
     * 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} radius 
     * @param {string | CanvasGradient | CanvasPattern} fillStyle 
     * @param {string | CanvasGradient | CanvasPattern} strokeStyle 
     */
    function drawDot(centerX, centerY, style) {
        ctx.lineWidth = 1;
        drawCircle(centerX, centerY, 13, null, style);
        drawCircle(centerX, centerY, 5, style, null);
    }

    function polygon(x, y, radius, nsides, rotation) {
        const step = 2 * Math.PI / nsides,//Precalculate step value
            shift = Math.PI + (rotation / 360) * (Math.PI * 2);//Quick fix ;)

        ctx.beginPath();
        for (let i = 0; i <= nsides; i++) {
            const curStep = i * step + shift;
            ctx.lineTo(x + radius * Math.cos(curStep), y + radius * Math.sin(curStep));
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
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


        mogos.forEach((mogo) => {
            drawMOGO(mogo.x, mogo.y, mogo.style, mogo.rot);
        });

        ctx.lineWidth = 2;
        rings.forEach((ring) => {
            drawCircle(ring.x, ring.y, 6, "rgba(0, 0, 0, 0)", RING_COLOR);
        });
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


        if (lines.length != 0) {
            drawDot(lines[0].x, lines[0].y, PATH_COLOR);

            const angle =   (Math.atan2(lines[0].y - lines[1]?.y, lines[0].x - lines[1]?.x) * 180 / Math.PI);
            if (!isNaN(angle)) 
                ctx.fillText(Math.round(angle), lines[0].x + 20, lines[0].y + 20);
        }
        for (let i = 1; i < lines.length; i++) {
            if (selection.index == i && selection.array == "lines") drawDot(lines[i].x, lines[i].y, UNFINISHED_COLOR);
            else drawDot(lines[i].x, lines[i].y, PATH_COLOR);

            ctx.strokeStyle = (selection.index == i || selection.index == i - 1) && selection.array == "lines" ? UNFINISHED_COLOR : PATH_COLOR;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(lines[i - 1].x ?? lines[i].x, lines[i - 1].y ?? lines[i].y);
            ctx.lineTo(lines[i].x, lines[i].y);
            ctx.stroke();
            ctx.closePath();

            const distance = Math.sqrt(
                (lines[i].x - lines[i+1]?.x) ** 2 + 
                (lines[i].y - lines[i+1]?.y) ** 2
            ) * 2;
            if (!isNaN(distance))
                ctx.fillText(`${Math.round(distance)}cm`, lines[i].x + (lines[i].x - lines[i+1]?.x)/2, lines[i].y + (lines[i].y - lines[i+1]?.y)/2 + 20);

            /**
             * @type {number}
             */
            const angle =   (Math.atan2(lines[i].y - lines[i+1]?.y, lines[i].x - lines[i+1]?.x) * 180 / Math.PI) -
                            (Math.atan2(lines[i-1]?.y - lines[i]?.y, lines[i-1]?.x - lines[i].x) * 180 / Math.PI);

            if (!isNaN(angle)) 
                ctx.fillText(`${Math.round(angle)}°`, lines[i].x + 20, lines[i].y + 20);

        }

        if (mouseDown && mouseInCanvas && !shiftDown) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = UNFINISHED_COLOR;

            ctx.beginPath();
            if (lines.length == 0) ctx.moveTo(mouseX, mouseY);
            else ctx.moveTo(lastX, lastY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
            ctx.closePath();

            // if (lines.length == 0) drawDot(clickX, clickY, UNFINISHED_COLOR);
            drawDot(mouseX, mouseY, UNFINISHED_COLOR);
        }

    }

    setInterval(tick, 10);
} else {
    // canvas-unsupported code here
}
