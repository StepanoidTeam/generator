import { seededRandom } from "./seeded-random.js";

import {
    flipMatrixHorizontally,
    flipMatrixVertically,
    rotateMatrix90Clockwise,
} from "./matrix.js";

const scale = 20;
const [cols, rows] = [20, 20];
const [width, height] = upscaleCoords([cols, rows]);

$areaEditorCanvas.width = width;
$areaEditorCanvas.height = height;

$sampleCanvas.width = width;
$sampleCanvas.height = height;

function upscaleCoords(coords) {
    return mulVector(coords, scale);
}

function sumVectors(vector1, vector2) {
    return vector1.map((z, i) => z + vector2[i]);
}

function mulVector(vector1, value) {
    return vector1.map((z) => z * value);
}

function sumVector(vector1, value) {
    return vector1.map((z) => z + value);
}

function subVectors(vector1, vector2) {
    return sumVectors(vector1, mulVector(vector2, -1));
}

class Rect {
    coords = [];

    get x() {
        return this.coords[0];
    }

    get y() {
        return this.coords[1];
    }

    size = [3, 3];

    get width() {
        return this.size[0];
    }

    get height() {
        return this.size[1];
    }

    selected = false;

    constructor(coords) {
        this.coords = coords;
    }

    angle = 0;
    xflip = false;
    yflip = false;

    getCenter() {
        return sumVectors(this.coords, mulVector(this.size, 0.5));
    }

    draw(ctx) {
        //draw area
        ctx.beginPath();

        ctx.rect(...upscaleCoords([...this.coords, ...this.size]));

        ctx.fillStyle = this.selected
            ? "rgba(76,175,80,0.7)"
            : "rgba(76,175,80,0.4)";
        ctx.fill();

        // draw draggable points
        new Point(this.coords).draw(ctx, "gold");
        const bottomRightPointCoords = sumVector(
            sumVectors(this.coords, this.size),
            -1
        );
        new Point(bottomRightPointCoords).draw(ctx, "cornflowerblue");

        ctx.stroke();

        // text

        const lineHeight = 40;
        ctx.font = `${lineHeight}px VT323`;

        const centerPt = this.getCenter();

        new Point(sumVector(centerPt, -0.5)).draw(ctx, "teal");

        ctx.save();

        const matrix = new DOMMatrix()
            .translate(...upscaleCoords(centerPt))
            .rotate(this.angle)
            .scale(this.xflip ? -1 : 1, this.yflip ? -1 : 1);

        ctx.setTransform(matrix);

        ctx.textAlign = "center";
        // letters to use: "FGJLQRZ"
        ctx.fillStyle = "black";
        ctx.fillText("🔠", 0, lineHeight / 4);

        ctx.restore();
    }

    getCopy() {
        const copyRect = new Rect(this.coords);
        copyRect.size = [...this.size];

        return copyRect;
    }
}

class Point {
    constructor(coords) {
        this.coords = [...coords];
    }

    draw(ctx, color) {
        ctx.fillStyle = color || "black";
        ctx.fillRect(...upscaleCoords(this.coords), scale, scale);
    }
}

const areas = [];

function addPoint(coords) {
    areas.push(new Rect(coords));
}

let movingArea = null;
let startCoords = null;
function startMovePoint(coords) {
    const rect = findRect(coords);

    if (!rect) return;

    movingArea = rect;
    startCoords = subVectors(coords, rect.coords);
}

function movePoint(coords) {
    if (!movingArea) return;

    movingArea.coords.splice(0, 2, ...subVectors(coords, startCoords));
}

function endMovePoint() {
    movingArea = null;
    startCoords = null;
}

function findRect(coords) {
    const [x, y] = coords;
    const rect = areas.findLast((rect) => {
        if (
            rect.x <= x &&
            rect.x + rect.width > x &&
            rect.y <= y &&
            rect.y + rect.height > y
        ) {
            return true;
        }
    });

    return rect;
}

function deleteArea(coords) {
    const deleteRect = findRect(coords);
    if (!deleteRect) return; //not found

    areas.splice(areas.indexOf(deleteRect), 1);
}

function copyArea(coords) {
    const rect = findRect(coords);
    if (!rect) return; //not found

    const rectCopy = rect.getCopy();

    rectCopy.coords = sumVector(rectCopy.coords, 1);

    areas.push(rectCopy);
}

function rotateArea(coords) {
    const rect = findRect(coords);
    if (!rect) return; //not found

    rect.angle += 90;
}

function vFlipArea(coords) {
    const rect = findRect(coords);
    if (!rect) return; //not found

    rect.yflip = !rect.yflip;
}

function hFlipArea(coords) {
    const rect = findRect(coords);
    if (!rect) return; //not found

    rect.xflip = !rect.xflip;
}

function getTool() {
    const tool = document.querySelector("[name=tool]:checked")?.value;

    return tool;
}

let scaleRect = null;
function startScale(coords) {
    scaleRect = findRect(coords);
}

function moveScale(coords) {
    if (!scaleRect) return;

    const newSize = sumVector(subVectors(coords, scaleRect.coords), 1)
        // prevent zero-negative size

        .map((coord) => Math.max(coord, 1));

    scaleRect.size.splice(0, 2, ...newSize);
}

function endScale(coords) {
    scaleRect = null;
}

let hoveredRect = null;
function handleCursorPointer(props) {
    const rect = findRect(props.coords);
    if (!rect) {
        if (hoveredRect) hoveredRect.selected = false;

        hoveredRect = null;
        $areaEditorCanvas.style.cursor = "initial";
    } else {
        if (hoveredRect) hoveredRect.selected = false;
        hoveredRect = rect;
        hoveredRect.selected = true;

        const toolCursor =
            {
                // add: "pointer",
                move: "grab",
                scale: "move",
                // delete: '',
                copy: "copy",
                "v-flip": "row-resize",
                "h-flip": "col-resize",
            }[props.tool] || "pointer";

        $areaEditorCanvas.style.cursor = toolCursor;
    }
}

function onMouseDown(props) {
    switch (getTool()) {
        case "add":
            addPoint(props.coords);
            break;
        case "move":
            startMovePoint(props.coords);
            break;
        case "scale":
            startScale(props.coords);
            break;

        case "delete":
            deleteArea(props.coords);
            break;
        case "copy":
            copyArea(props.coords);
            break;

        case "rotate":
            rotateArea(props.coords);
            break;

        case "v-flip":
            vFlipArea(props.coords);
            break;

        case "h-flip":
            hFlipArea(props.coords);
            break;
    }
}

function onMouseMove(props) {
    handleCursorPointer(props);

    switch (getTool()) {
        case "move":
            movePoint(props.coords);
            break;
        case "scale":
            moveScale(props.coords);
            break;
    }
}

function onMouseUp(props) {
    switch (getTool()) {
        case "move":
            endMovePoint(props.coords);
            break;
        case "scale":
            endScale(props.coords);
            break;
    }

    updateResult();
}

function pickRandom({ array, random, seed }) {
    const rnd = random(seed);

    const randomIndex = Math.floor(rnd * array.length);
    return array[randomIndex];
}

function generateMatrix0n({ cols, rows }) {
    return Array.from({ length: cols }, (_, col) =>
        Array.from({ length: rows }, (_, row) => col * rows + row)
    );
}

function generateMatrixRnd({ cols, rows, seed }) {
    const random = seededRandom(seed);

    return Array.from({ length: cols }, (_, col) =>
        Array.from({ length: rows }, (_, row) => random())
    );
}

let updateSeed = Math.random();
function updateResult(seed = updateSeed) {
    updateSeed = seed;
    const ctx = $sampleCanvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    const globalGenerationSeed = seed;

    areas.forEach(drawAreaSample);

    function drawAreaSample(area) {
        // make matrix and fill with seeds/indexes
        let matrix = generateMatrixRnd({
            cols: area.height,
            rows: area.width,
            seed: globalGenerationSeed,
        });

        // rotate n times
        for (let rotation = 0; rotation < area.angle / 90; rotation++) {
            console.log("rot", rotation);
            matrix = rotateMatrix90Clockwise(matrix);
        }

        // todo(vmyshko): flip flop
        if (area.xflip) {
            console.log("flipped X");
            matrix = flipMatrixHorizontally(matrix);
        }
        if (area.yflip) {
            console.log("flipped Y");
            matrix = flipMatrixVertically(matrix);
        }

        // todo(vmyshko): draw it
        // const random = seededRandom(seed);

        for (let col = 0; col < area.width; col++) {
            for (let row = 0; row < area.height; row++) {
                const pointCoords = sumVectors(area.coords, [col, row]);

                const matrixCellSeed = matrix[row][col];

                // todo(vmyshko): prevent shit random
                const cellRandom = seededRandom(
                    globalGenerationSeed * 100 + matrixCellSeed * 1000
                );

                // todo(vmyshko): to fix first pseudo random

                new Point(pointCoords).draw(
                    ctx,
                    pickRandom({
                        array: ["transparent", "dimgray"],
                        random: cellRandom,
                        seed: matrixCellSeed,
                    })

                    // [("darkgray", "dimgray")][matrixCellSeed % 2]
                );
                // debug
                // const lineHeight = 20;
                // ctx.font = `${lineHeight}px VT323`;

                // ctx.textAlign = "center";
                // ctx.fillStyle = "lime";
                // ctx.fillText(
                //     matrixCellSeed,
                //     ...sumVectors(upscaleCoords(pointCoords), [
                //         lineHeight / 2,
                //         (lineHeight * 3) / 4,
                //     ])
                // );
            }
        }

        ctx.strokeStyle = "black";
        ctx.strokeRect(
            ...upscaleCoords(area.coords),
            ...upscaleCoords(area.size)
        );
    }
}

$btnGenerate.addEventListener("click", () => updateResult(Math.random()));

function downscaleCoords(event) {
    const [x, y] = [event.offsetX, event.offsetY].map((coord) =>
        Math.floor(coord / scale)
    );
    return [x, y];
}

function prepProps(callback) {
    return function (event) {
        const coords = downscaleCoords(event);

        const tool = document.querySelector("[name=tool]:checked")?.value;

        callback({ coords, tool });
    };
}

$areaEditorCanvas.addEventListener("mousedown", prepProps(onMouseDown));
$areaEditorCanvas.addEventListener("mousemove", prepProps(onMouseMove));
$areaEditorCanvas.addEventListener("mouseup", prepProps(onMouseUp));

function getPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length - 1; i++) {
        pairs.push([arr[i], arr[i + 1]]);
    }
    return pairs;
}

const ctx = $areaEditorCanvas.getContext("2d");
function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "gray";
    ctx.lineWidth = 3;
    getPairs(areas).forEach(([area1, area2]) => {
        ctx.beginPath();
        ctx.moveTo(...upscaleCoords(area1.getCenter()));
        ctx.lineTo(...upscaleCoords(area2.getCenter()));
        ctx.stroke();
    });

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    areas.forEach((area) => area.draw(ctx));

    requestAnimationFrame(draw);
}

draw();

document.querySelector("[name=tool]").checked = true;
