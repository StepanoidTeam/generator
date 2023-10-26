const canvas = document.getElementById("area-editor");

const scale = 20;
const [cols, rows] = [20, 20];
const [width, height] = upscaleCoords([cols, rows]);

canvas.width = width;

canvas.height = height;

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

    transformations = "";

    angle = 0;
    draw(ctx) {
        //draw lines
        ctx.beginPath();

        ctx.rect(...upscaleCoords([...this.coords, ...sumVector(this.size, 1)]));

        ctx.fillStyle = this.selected ? "rgba(255,0,0,0.5)" : "rgba(0,255,0,0.5)";
        ctx.fill();
        ctx.stroke();

        new Point(this.coords).draw(ctx);
        new Point(sumVectors(this.coords, this.size)).draw(ctx);

        const lineHeight = 40;
        ctx.font = `${lineHeight}px VT323`;
        const center = sumVectors(this.coords, sumVectors(mulVector(this.size, 0.5), [0, 1]));

        ctx.save();

        ctx.textAlign = "center";

        // this.angle++;
        const matrix = new DOMMatrix().translate(...sumVectors(upscaleCoords(center), [0, -lineHeight / 4]), 0).rotate(this.angle);
        ctx.setTransform(matrix);

        ctx.fillStyle = "white";
        ctx.fillText("A", 0, lineHeight / 4);

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

    draw(ctx) {
        ctx.fillStyle = "black";
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
    const rect = areas.find((rect) => {
        if (
            rect.coords[0] <= coords[0] &&
            rect.coords[0] + rect.size[0] >= coords[0] &&
            rect.coords[1] <= coords[1] &&
            rect.coords[1] + rect.size[1] >= coords[1]
        ) {
            return true;
        }
    });

    return rect;
}

function findPointIndex(coords) {
    const pointIndex = areas.findIndex((point) => `${point.coords}` === `${coords}`);

    return pointIndex;
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

    scaleRect.size.splice(0, 2, ...subVectors(coords, scaleRect.coords));
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
        canvas.style.cursor = "initial";
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

        canvas.style.cursor = toolCursor;
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
}

function downscaleCoords(event) {
    const [x, y] = [event.offsetX, event.offsetY].map((coord) => Math.floor(coord / scale));
    return [x, y];
}

function prepProps(callback) {
    return function (event) {
        const coords = downscaleCoords(event);

        const tool = document.querySelector("[name=tool]:checked")?.value;

        callback({ coords, tool });
    };
}

canvas.addEventListener("mousedown", prepProps(onMouseDown));
canvas.addEventListener("mousemove", prepProps(onMouseMove));
canvas.addEventListener("mouseup", prepProps(onMouseUp));

const ctx = canvas.getContext("2d");
function draw() {
    ctx.clearRect(0, 0, width, height);

    areas.forEach((p) => p.draw(ctx));

    requestAnimationFrame(draw);
}

draw();

document.querySelector("[name=tool]").checked = true;
