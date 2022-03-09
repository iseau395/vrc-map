<script lang="ts">
    import { tick, onMount } from "svelte";

    import { Ring } from "./gameobject";
    import {
        drawDot,
        drawField,
        drawTrashCan,
        GRID_COLOR,
        Color,
    } from "./drawing";
    import { load, save } from "./saving";
    import { imperial } from "../stores/settings";
    import { slot } from "./var";

    import { points, gameobjects } from "../stores/objects";

    import { add_undo, ArrayType, redo, undo, UndoType } from "./undo";

    let canvas: HTMLCanvasElement;

    onMount(() => {
        const FIELD_SIDE = 713.74;

        const PATH_COLORS = [
            new Color(210, 10, 10),
            new Color(210, 110, 10),
            new Color(210, 210, 10),
            // new Color(110, 210,  10),
            new Color(10, 210, 10),
            new Color(10, 210, 110),
            new Color(10, 210, 210),
            new Color(10, 110, 210),
            new Color(10, 10, 210),
            new Color(110, 10, 210),
            new Color(210, 10, 210),
            new Color(210, 10, 110),
        ];

        function toImperial(cm: number) {
            return cm * 0.393701;
        }

        const slot_list = document.getElementById(
            "slots-list"
        ) as HTMLParagraphElement;

        canvas.focus();

        const GRID_SCALE = 48;

        const FIELD_GRID = FIELD_SIDE / GRID_SCALE;

        const ctx = canvas.getContext("2d");

        let selection: {
            array: "none" | "gameobjects" | "points",
            index: number,
            start_x: number | null,
            start_y: number | null,
        } = {
            array: "none",
            index: NaN,
            start_x: null,
            start_y: null,
        };

        let lastX = 0;
        let lastY = 0;

        let mouseDown = false;

        let mouseX = 0;
        let mouseY = 0;

        let ctrlDown = false;
        let shiftDown = false;
        let altDown = false;
        let numberKey = 0;

        {
            canvas.addEventListener("mousedown", (event) => {
                if (event.button != 0) return;

                mouseDown = true;
            });
            canvas.addEventListener("mouseup", (event) => {
                if (event.button == 0) {
                    mouseDown = false;

                    if (!shiftDown) {
                        $points.push({
                            x: mouseX,
                            y: mouseY,
                            step: numberKey,
                        });

                        if (
                            mouseX < FIELD_SIDE
                        ) {
                            add_undo(
                                UndoType.Add,
                                {
                                    array: "points",
                                    key: $points.length-1
                                }
                            );
                        }

                        return;
                    }

                    if (
                        selection.array == "gameobjects" &&
                        mouseX > FIELD_SIDE &&
                        mouseY <= 160
                    ) {
                        $gameobjects[selection.index].x = selection.start_x;
                        $gameobjects[selection.index].y = selection.start_y;

                        add_undo(
                            UndoType.Remove,
                            {
                                array: "gameobjects",
                                key: selection.index,
                                object: $gameobjects[selection.index]
                            }
                        );

                        $gameobjects.splice(selection.index, 1);
                    }
                    if (
                        selection.array == "points" &&
                        mouseX > FIELD_SIDE &&
                        mouseY <= 160
                    ) {
                        $points[selection.index].x = selection.start_x;
                        $points[selection.index].y = selection.start_y;

                        add_undo(
                            UndoType.Remove,
                            {
                                array: "points",
                                key: selection.index,
                                object: $points[selection.index]
                            }
                        );

                        $points.splice(selection.index, 1);
                    }

                    if (!(
                        mouseX > FIELD_SIDE
                    )) {
                        add_undo(
                            UndoType.Move,
                            {
                                array: selection.array as ArrayType,
                                key: selection.index,
                                old_x: selection.start_x,
                                old_y: selection.start_y
                            }
                        )
                    }

                    selection = {
                        array: "none",
                        index: NaN,
                        start_x: null,
                        start_y: null,
                    };
                }

                save($slot, $points, $gameobjects);
            });
            canvas.addEventListener("contextmenu", (event) => {
                event.preventDefault();

                if (mouseX < FIELD_SIDE) {
                    $gameobjects.push(new Ring(mouseX, mouseY));
                    add_undo(
                        UndoType.Add,
                        {
                            array: "gameobjects",
                            key: $gameobjects.length - 1
                        }
                    )
                }

                save($slot, $points, $gameobjects);
            });

            canvas.addEventListener("mousemove", (event) => {
                const x = (event.x - canvas.offsetLeft) / canvas.clientWidth * canvas.width;
                const y = (event.y - canvas.offsetTop) / canvas.clientHeight * canvas.height;

                mouseX = !event.ctrlKey
                    ? event.altKey
                        ? lastX % FIELD_GRID
                        : 0 +
                          Math.round(
                              (x - (event.altKey ? lastX % FIELD_GRID : 0)) /
                                  FIELD_GRID
                          ) *
                              FIELD_GRID
                    : x;

                mouseY = !event.ctrlKey
                    ? event.altKey
                        ? lastY % FIELD_GRID
                        : 0 +
                          Math.round(
                              (y - (event.altKey ? lastY % FIELD_GRID : 0)) /
                                  FIELD_GRID
                          ) *
                              FIELD_GRID
                    : y;

                mouseX =
                    mouseX <= FIELD_SIDE
                        ? mouseX
                        : mouseY < 160
                        ? mouseX
                        : Math.min(mouseX, FIELD_SIDE);

                if (event.shiftKey && mouseDown && selection.array == "none") {
                    $gameobjects.forEach((gameobject, i) => {
                        if (gameobject.pointInside(x, y)) {
                            selection = {
                                array: "gameobjects",
                                index: i,
                                start_x: gameobject.x,
                                start_y: gameobject.y,
                            };
                        }
                    });

                    $points.forEach((point, i) => {
                        if (
                            (x - point.x) ** 2 + (y - point.y) ** 2 <=
                            16 ** 2
                        ) {
                            selection = {
                                array: "points",
                                index: i,
                                start_x: point.x,
                                start_y: point.y,
                            };
                        }
                    });
                } else if (!event.shiftKey) {
                    selection = {
                        array: "none",
                        index: NaN,
                        start_x: null,
                        start_y: null,
                    };
                }

                switch (selection.array) {
                    case "gameobjects":
                        $gameobjects[selection.index].x = mouseX;
                        $gameobjects[selection.index].y = mouseY;
                        break;
                    case "points":
                        $points[selection.index].x = mouseX;
                        $points[selection.index].y = mouseY;
                        break;
                }
            });

            canvas.addEventListener("keydown", (event) => {
                if (event.ctrlKey && event.code == "KeyZ") {
                    undo();
                }
                if (event.ctrlKey && event.code == "KeyY") {
                    redo();
                }

                ctrlDown = event.ctrlKey;
                shiftDown = event.shiftKey;
                altDown = event.altKey;

                if (/\d/.test(event.key) && +event.key != 0)
                    numberKey = +event.key - 1;
                else if (+event.key == 0) numberKey = 10;

                if (ctrlDown || shiftDown || altDown) event.preventDefault();
            });
            canvas.addEventListener("keyup", (event) => {
                ctrlDown = event.ctrlKey;
                shiftDown = event.shiftKey;
                altDown = event.altKey;
            });
        }

        async function onTick() {
            lastX = $points[$points.length - 1]?.x ?? 0;
            lastY = $points[$points.length - 1]?.y ?? 0;

            ctx.fillStyle = "rgb(255, 50, 50)";
            ctx.fillRect(FIELD_SIDE, 0, 150, 150);
            ctx.fillStyle = "rgb(50, 50, 50)";
            ctx.fillRect(FIELD_SIDE, 150, 150, FIELD_SIDE - 150);

            drawTrashCan(FIELD_SIDE, 0, ctx);

            drawField(ctx);
            $gameobjects.forEach((gameobject) => gameobject.render(ctx));

            if (!ctrlDown) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = GRID_COLOR.toString();
                ctx.beginPath();
                for (let i = 0; i < GRID_SCALE; i++) {
                    ctx.moveTo(
                        FIELD_GRID * i + (altDown ? lastX % FIELD_GRID : 0),
                        0
                    );
                    ctx.lineTo(
                        FIELD_GRID * i + (altDown ? lastX % FIELD_GRID : 0),
                        FIELD_SIDE
                    );
                }
                for (let i = 0; i < GRID_SCALE; i++) {
                    ctx.moveTo(
                        0,
                        FIELD_GRID * i + (altDown ? lastY % FIELD_GRID : 0)
                    );
                    ctx.lineTo(
                        FIELD_SIDE,
                        FIELD_GRID * i + (altDown ? lastY % FIELD_GRID : 0)
                    );
                }
                ctx.stroke();
                ctx.closePath();
            }

            for (let i = 0; i < $points.length; i++) {
                if (selection.index == i && selection.array == "points")
                    drawDot(
                        $points[i].x,
                        $points[i].y,
                        PATH_COLORS[$points[i].step].toUnfinished().toString(),
                        ctx
                    );
                else
                    drawDot(
                        $points[i].x,
                        $points[i].y,
                        PATH_COLORS[$points[i].step].toString(),
                        ctx
                    );

                ctx.strokeStyle =
                    (selection.index == i || selection.index + 1 == i) &&
                    selection.array == "points"
                        ? PATH_COLORS[$points[i].step].toUnfinished().toString()
                        : PATH_COLORS[$points[i].step].toString();

                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(
                    $points[i - 1]?.x ?? $points[i].x,
                    $points[i - 1]?.y ?? $points[i].y
                );
                ctx.lineTo($points[i].x, $points[i].y);

                ctx.stroke();
                ctx.closePath();

                let angle =
                    (Math.atan2(
                        $points[i].y - $points[i + 1]?.y,
                        $points[i].x - $points[i + 1]?.x
                    ) *
                        180) /
                        Math.PI -
                    (Math.atan2(
                        $points[i - 1]?.y - $points[i]?.y,
                        $points[i - 1]?.x - $points[i].x
                    ) *
                        180) /
                        Math.PI;

                if (i == 0)
                    angle =
                        (Math.atan2(
                            $points[0].y - $points[1]?.y,
                            $points[0].x - $points[1]?.x
                        ) *
                            180) /
                        Math.PI;

                if (!isNaN(angle))
                    ctx.fillText(
                        `${Math.round(angle)}\u00B0`,
                        $points[i].x + 20,
                        $points[i].y + 20
                    );

                ctx.fillStyle =
                    (selection.index == i || selection.index - 1 == i) &&
                    selection.array == "points"
                        ? PATH_COLORS[$points[i + 1]?.step ?? $points[i].step]
                              .toUnfinished()
                              .toString()
                        : PATH_COLORS[
                              $points[i + 1]?.step ?? $points[i].step
                          ].toString();

                const distance =
                    Math.sqrt(
                        ($points[i].x - $points[i + 1]?.x) ** 2 +
                            ($points[i].y - $points[i + 1]?.y) ** 2
                    ) / 2;
                if (!isNaN(distance))
                    ctx.fillText(
                        `${
                            Math.round(
                                ($imperial ? toImperial(distance) : distance) *
                                    100
                            ) / 100
                        }${$imperial ? "in" : "cm"}`,
                        $points[i].x - ($points[i].x - $points[i + 1]?.x) / 2,
                        $points[i].y - ($points[i].y - $points[i + 1]?.y) / 2 - 20
                    );
            }

            if (mouseDown && !shiftDown && selection.array == "none") {
                ctx.lineWidth = 3;
                ctx.strokeStyle = PATH_COLORS[numberKey]
                    .toUnfinished()
                    .toString();

                ctx.beginPath();
                if ($points.length == 0) ctx.moveTo(mouseX, mouseY);
                else ctx.moveTo(lastX, lastY);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
                ctx.closePath();

                drawDot(
                    mouseX,
                    mouseY,
                    PATH_COLORS[numberKey].toUnfinished().toString(),
                    ctx
                );
            }

            const slots = localStorage
                .getItem("all-slots-list")
                ?.split("|");
            if (slots)
                slot_list.textContent = "Save Slots: " + slots.join(", ");

            await tick();
            setTimeout(onTick, 0);
        }

        load("slot1");

        onTick();
    });
</script>

<canvas bind:this={canvas} width="863.74" height="713.74" tabindex="0" />

<style>
    canvas {
        margin: 0px;
        padding: 0px;
        width: 100%;
    }
</style>