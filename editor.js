function toggleRatio() {
    editorHeightBlock.hidden = keepRatio.checked;
}

// gens abc...xyz
const abc = new Array(26).fill().map((x, i) => (i + 10).toString(36));
const abcLimit = abc.length;

function changeCell(event) {
    const cell = event.target;

    let nextIndex = +cell.dataset.index + 1;

    if (nextIndex >= abcLimit) {
        nextIndex = 0;
    }

    setCellIndex(cell, nextIndex);
}

function setCellIndex(cell, index) {
    cell.dataset.index = index;
    cell.textContent = abc[index];

    // 0 - 360
    const resultRangeMax = 360;
    const deg = Math.floor((resultRangeMax * index) / abcLimit);
    cell.style.background = `hsl(${deg}deg 100% 50%)`;
}

function getColsRows() {
    const cols = editorWidth.value;
    const rows = keepRatio.checked ? cols : editorHeight.value;

    const size = cols * rows;

    return { cols, rows, size };
}

function generateMatrix() {
    const { cols, rows, size } = getColsRows();

    const editorGrid = document.querySelector(".editor-matrix");

    const newCells = [];
    for (let index = 0; index < size; index++) {
        const cell = cellTemplate.content.cloneNode(true).firstElementChild;

        setCellIndex(cell, 0);

        cell.addEventListener("click", changeCell);
        newCells.push(cell);
    }
    editorGrid.replaceChildren(...newCells);

    editorGrid.style.setProperty("--cols", cols);
    editorGrid.style.setProperty("--rows", rows);
}

function generateSample() {
    const { cols, rows, size } = getColsRows();

    const editorGrid = document.querySelector(".editor-matrix");
    const resultsGrid = document.querySelector(".results-matrix");

    const newCells = [];

    const genColors = new Map();

    [...editorGrid.children].forEach((refCell) => {
        const cell = cellTemplate.content.cloneNode(true).firstElementChild;

        const { index } = refCell.dataset;

        // gen random color for specific index
        if (!genColors.has(index)) {
            const rnd = Math.random();
            const rndColor = rnd > 0.5 ? "white" : "black";

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

// add listeners
keepRatio.addEventListener("change", toggleRatio);
generateMatrixBtn.addEventListener("click", generateMatrix);
generateSampleBtn.addEventListener("click", generateSample);

//defaults
editorWidth.value = 5;
editorHeight.value = 5;

//def

generateMatrixBtn.click();
generateSampleBtn.click();

// todo(vmyshko): disable custom ratio for now
keepRatio.click();
keepRatio.disabled = true;
