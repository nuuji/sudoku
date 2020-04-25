const { range, matrix } = require('./util');

class CellCollection {
    constructor(cells) {
        this.cells = cells;
    }

    includes(value) {
        return this.cells.some(cell => cell.is(value));
    }

    missing() {
        return range(1, 10).filter(val => !this.includes(val));
    }

    toString() {
        return `[${this.cells.join(', ')}]`;
    }

    *iterate() {
        for (const cell of this.cells) {
            yield cell;
        }
    }

    [Symbol.iterator] = this.iterate;
}

class Row extends CellCollection {}

class Col extends CellCollection {}

class Square extends CellCollection {
    constructor(cells, squareX, squareY) {
        if (cells.some(cell => !Array.isArray(cell))) {
            throw new Error(
                'Square should be constructed with an n * n matrix (eg. an array containing 3 arrays of 3 cells)'
            );
        }

        super(cells);
        this.squareX = squareX;
        this.squareY = squareY;
    }

    includes(value) {
        return this.flat().some(cell => cell.is(value));
    }

    flat() {
        return this.cells.flat();
    }

    toString() {
        this.cells.map(row => `[${row.join(', ')}]`).join(',\n');
    }

    *iterate() {
        const matrixSize = this.cells.length;

        for (const [x, y] of matrix(matrixSize, matrixSize)) {
            yield this.cells[y][x];
        }
    }
}

module.exports = {
    CellCollection,
    Row,
    Col,
    Square,
}
