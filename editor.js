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
    if (y < rows / 2) return y * cols + x;

    return (rows - y - 1) * cols + x;
}

function hMirror({ x, y, cols, rows }) {
    if (x < cols / 2) return y * cols + x;

    return (y + 1) * cols - x - 1;
}

const presets = [
    //
    vMirror,
    hMirror,

    notSet,
    noize,
];

function initPresets() {
    const presetEls = presets.map((preset) => {
        const presetEl = presetTemplate.content.cloneNode(true).firstElementChild;

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

    const selectedPresetName = document.querySelector("[name=preset]:checked").value;

    const currentPresetFn = presets.find((p) => p.name === selectedPresetName);

    const editorGrid = document.querySelector(".editor");

    const newCells = [];
    for (let index = 0; index < size; index++) {
        const cell = cellTemplate.content.cloneNode(true).firstElementChild;

        const y = (index - (index % cols)) / cols;
        const x = index - y * cols;

        setCellIndex(cell, currentPresetFn({ x, y, size, cols, rows, index }));

        cell.addEventListener("click", paintCell);
        newCells.push(cell);
    }
    editorGrid.replaceChildren(...newCells);

    editorGrid.style.setProperty("--cols", cols);
    editorGrid.style.setProperty("--rows", rows);
}

function generateSample() {
    const { cols, rows, size } = getColsRows();

    const editorGrid = document.querySelector(".editor");
    const resultsGrid = document.querySelector(".results");

    const newCells = [];

    const genColors = new Map();

    [...editorGrid.children].forEach((refCell) => {
        const cell = cellTemplate.content.cloneNode(true).firstElementChild;

        const { index } = refCell.dataset;

        // gen random color for specific index
        if (!genColors.has(index)) {
            const rnd = Math.random();

            const rndColor = rnd > 0.5 ? "white" : "black";

            // const rndColor = `rgba(0,0,0,${rnd})`;

            genColors.set(index, rndColor);
        }

        // reuse pre-gen color
        cell.style.backgroundColor = genColors.get(index);

        newCells.push(cell);
    });

    resultsGrid.replaceChildren(...newCells);

    resultsGrid.style.setProperty("--cols", cols);
    resultsGrid.style.setProperty("--rows", rows);
}

initPresets();

// add listeners
keepRatio.addEventListener("change", toggleRatio);
generateMatrixBtn.addEventListener("click", () => {
    generateMatrix();
    generatePalette();
});
generateSampleBtn.addEventListener("click", generateSample);

//defaults
editorWidth.value = 6;
editorHeight.value = 6;

//def

generateMatrixBtn.click();
generateSampleBtn.click();

keepRatio.click();
