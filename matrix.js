function transformMatrix(matrix, transformCallback) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const [newI, newJ] = transformCallback({ i, j, rows, cols });
            result[newI][newJ] = matrix[i][j];
        }
    }

    return result;
}

function rotate90Clockwise({ i, j, rows, cols }) {
    return [j, rows - 1 - i];
}

function rotate90Counterclockwise({ i, j, rows, cols }) {
    return [cols - 1 - j, i];
}

function flipHorizontally({ i, j, rows, cols }) {
    return [i, cols - 1 - j];
}

function flipVertically({ i, j, rows, cols }) {
    return [rows - 1 - i, j];
}

// -------

export function rotateMatrix90Clockwise(matrix) {
    return transformMatrix(matrix, rotate90Clockwise);
}

export function rotateMatrix90CounterClockwise(matrix) {
    return transformMatrix(matrix, rotate90Counterclockwise);
}

export function flipMatrixHorizontally(matrix) {
    return transformMatrix(matrix, flipHorizontally);
}

export function flipMatrixVertically(matrix) {
    return transformMatrix(matrix, flipVertically);
}
