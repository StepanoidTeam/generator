import { copyCanvasToClipboard } from "./copyCanvasToClipboard.js";

function toggleRatio() {
    editorHeightBlock.hidden = keepRatio.checked;
}

function paintCell(event) {
    const cell = event.target;

    const selectedColorEl = document.querySelector(".palette-cell:checked");

    const value = +selectedColorEl.dataset.index;

    setCellIndex(cell, value);
}

function getSymbol(index) {
    return (index + 10).toString(36);
}

function setCellIndex(cell, index) {
    const { size } = getColsRows();

    cell.dataset.index = index;

    cell.dataset.label = getSymbol(index);
    cell.textContent = getSymbol(index);

    // 0 - 360
    const resultRangeMax = 360;
    const deg = Math.floor((resultRangeMax * index) / size);
    cell.style.background = `hsl(${deg}deg 100% 50%)`;
}

function getColsRows() {
    const cols = +editorWidth.value;
    const rows = keepRatio.checked ? cols : +editorHeight.value;

    const size = cols * rows;

    return { cols, rows, size };
}

function generatePalette() {
    const { cols, rows, size } = getColsRows();

    const paletteEl = document.querySelector(".palette");

    const newCells = [];
    for (let index = 0; index < size; index++) {
        const cell = paletteTemplate.content.cloneNode(true).firstElementChild;

        setCellIndex(cell, index);

        newCells.push(cell);
    }
    paletteEl.replaceChildren(...newCells);

    newCells[0].click();
}

// presets
function notSet({ x, y, size, index }) {
    return 0;
}

function noize({ x, y, cols }) {
    return y * cols + x;
}

function vMirror({ x, y, cols, rows }) {
    if (y < rows / 2) return y * cols + x; // first half

    return (rows - y - 1) * cols + x;
}

function hMirror({ x, y, cols, rows }) {
    if (x < cols / 2) return y * cols + x; // first half

    return (y + 1) * cols - x - 1;
}

function md_Mirror({ x, y, cols, rows }) {
    // main diag

    if (x >= y) return y * cols + x;

    return x * cols + y;
}

function sd_Mirror({ x, y, cols, rows }) {
    // secondary diag

    if (x + y < cols) return y * cols + x;

    return (rows - 1 - x) * rows + (cols - 1 - y);
}

function star({ x, y, cols, rows }) {
    // todo(vmyshko): high complexity, better to work on diagonal areas in area-editor
    return 0;
}

function helix({ x, y, cols, rows }) {
    // todo(vmyshko): too complicated to code, better to work on area-editor
    const isTopPart = y < rows / 2;
    const isLeftPart = x < cols / 2;

    if (isLeftPart && isTopPart) return y * cols + x;

    if (!isLeftPart && isTopPart) return y * cols + Math.round(x - rows / 2);

    if (!isLeftPart && !isTopPart) return 180;

    if (isLeftPart && !isTopPart) return 270;

    // if (y < rows / 2) return y * cols + x; // first half

    // return (rows - y - 1) * cols + x;

    // if (x < cols / 2) return y * cols + x; // first half

    // return (y + 1) * cols - x - 1;
}

const presets = [
    //
    hMirror,
    vMirror,

    md_Mirror,
    sd_Mirror,

    // star,
    // helix,

    notSet,
    noize,
];

function initPresets() {
    const presetEls = presets.map((preset) => {
        const presetEl =
            presetTemplate.content.cloneNode(true).firstElementChild;

        presetEl.dataset.label = preset.name;
        presetEl.value = preset.name;

        return presetEl;
    });

    const presetsContainer = document.querySelector(".presets");

    presetsContainer.replaceChildren(...presetEls);

    document.querySelector("[name=preset]:first-child").checked = true;
}

function generateMatrix() {
    const { cols, rows, size } = getColsRows();

    const selectedPresetName = document.querySelector(
        "[name=preset]:checked"
    ).value;

    const currentPresetFn = presets.find((p) => p.name === selectedPresetName);

    const newCells = [];
    for (let index = 0; index < size; index++) {
        const cell = cellTemplate.content.cloneNode(true).firstElementChild;

        const y = (index - (index % cols)) / cols;
        const x = index - y * cols;

        setCellIndex(cell, currentPresetFn({ x, y, size, cols, rows, index }));

        cell.addEventListener("click", paintCell);
        newCells.push(cell);
    }
    $editorGrid.replaceChildren(...newCells);

    $editorGrid.style.setProperty("--cols", cols);
    $editorGrid.style.setProperty("--rows", rows);
}

function generatePic(indices) {
    const { cols, rows, size } = getColsRows();

    const canvas = canvasTemplate.content.cloneNode(true).firstElementChild;

    canvas.addEventListener("click", copyCanvasToClipboard);
    const ctx = canvas.getContext("2d");

    const scale = sampleScale.value;

    canvas.width = cols * scale;
    canvas.height = rows * scale;

    ctx.scale(scale, scale);

    const genColors = new Map();

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = y * cols + x;

            // gen random color for specific index
            if (!genColors.has(indices[index])) {
                const rnd = Math.random();

                const noColor = sampleTransparent.checked
                    ? "transparent"
                    : "white";

                const rndColor = rnd < 0.5 ? noColor : "black";
                // const rndColor = `rgba(0,0,0,${rnd})`;

                // todo(vmyshko): droch
                genColors.set(indices[index], rndColor);
            }

            // reuse pre-gen color
            ctx.fillStyle = genColors.get(indices[index]);
            ctx.fillRect(x, y, 1, 1);
        }
    }

    return canvas;
}

function generateSample() {
    const { cols, rows, size } = getColsRows();

    const resultsGrid = document.querySelector(".generator-results");

    const indices = [...$editorGrid.children].map((refCell) => {
        const { index } = refCell.dataset;

        return +index;
    });

    const canvases = [];
    for (let i = 0; i < sampleCount.value; i++) {
        const canvas = generatePic(indices);
        canvases.push(canvas);
    }

    resultsGrid.replaceChildren(...canvases);

    resultsGrid.style.setProperty("--cols", cols);
    resultsGrid.style.setProperty("--rows", rows);
}

initPresets();

// add listeners
keepRatio.addEventListener("change", toggleRatio);
$generateMatrixBtn.addEventListener("click", () => {
    generateMatrix();
    generatePalette();
});

$generateSampleBtn.addEventListener("click", generateSample);

$togglePaletteContainer.addEventListener("click", () => {
    $paletteContainer.hidden = !$paletteContainer.hidden;
});

$toggleMatrixContainer.addEventListener("click", () => {
    $matrixContainer.hidden = !$matrixContainer.hidden;
});

//defaults
editorWidth.value = 9;
editorHeight.value = 9;

sampleScale.value = 5;
sampleCount.value = 68;

//def

$generateMatrixBtn.click();
$generateSampleBtn.click();

keepRatio.click();

document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        $generateSampleBtn.click();
    }
});
