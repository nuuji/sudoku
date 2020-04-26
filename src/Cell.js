module.exports = class Cell {
    _value = null;

    constructor(colIdx, rowIdx, value, grid) {
        this.coordinates = [colIdx, rowIdx];
        this.grid = grid;
        this._value = value;
    }

    set value(v) {
        console.log(
            `Changing cell [${this.coordinates.join(', ')}] value from ${this.value} to ${v}`
        );

        this._value = v;
    }

    get value() {
        return this._value;
    }

    get colIdx() {
        return this.coordinates[0];
    }

    get rowIdx() {
        return this.coordinates[1];
    }

    col() {
        return this.grid.getCol(this.colIdx);
    }

    row() {
        return this.grid.getRow(this.rowIdx);
    }

    square() {
        const { rowIdx, colIdx, grid } = this;
        const { squareSize } = grid;
        const squareX = Math.floor(colIdx / squareSize);
        const squareY = Math.floor(rowIdx / squareSize);

        return this.grid.getSquare(squareX, squareY);
    }

    is(val) {
        return this.value === val;
    }

    empty() {
        return this.value === null;
    }

    entryValid(value) {
        return this.empty() && ![
            this.col(),
            this.row(),
            this.square()
        ].some(set => set.includes(value));
    }

    toString() {
        return `Cell [${this.coordinates.join(', ')}] value ${this.value}`;
    }
}