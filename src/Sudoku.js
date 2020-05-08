// Everything is 0-indexed!

const Cell = require("./Cell");
const { Row, Col, Square } = require("./CellCollections");
const { range, matrix } = require("./util");

module.exports = class Sudoku {
  constructor(grid) {
    // Immutable copy of original grid
    Object.defineProperty(this, "grid", {
      writable: false,
      value: grid,
    });

    let missingValues = 0;

    // Mutable working copy of Cell objects to fill numbers in
    this.g = grid.map((row, rowIdx) =>
      row.map((value, colIdx) => {
        if (value === null) {
          missingValues++;
        }

        return new Cell(colIdx, rowIdx, value, this);
      })
    );

    this.missingValues = missingValues;
    this.gridSize = grid.length;
    this.squareSize = Math.sqrt(this.gridSize);
    this.INDICES = range(0, this.gridSize);

    this.candidatesGenerated = false;
  }

  cellValues() {
    return this.g.map((row) => row.map((cell) => cell.value));
  }

  getCell(colIdx, rowIdx) {
    return this.g[rowIdx][colIdx];
  }

  getRow(rowIdx) {
    return new Row(this.g[rowIdx]);
  }

  getCol(colIdx) {
    return new Col(this.g.map((row) => row[colIdx]));
  }

  /**
   * Get one of the major squares (eg. 1 of 9 3x3 squares in a 9x9 grid)
   * @param {number} squareX 0, 1 or 2 (assuming 9x9 grid)
   * @param {number} squareY 0, 1 or 2 (assuming 9x9 grid)
   */
  getSquare(squareX, squareY) {
    const offsetX = squareX * this.squareSize;
    const offsetY = squareY * this.squareSize;

    const cells = [[], [], []];

    for (const [x, y] of matrix(this.squareSize, this.squareSize)) {
      cells[y][x] = this.g[offsetY + y][offsetX + x];
    }

    return new Square(cells, squareX, squareY);
  }

  // Shortcuts for number existing in row, col, square
  rowHasNumber(rowIdx, number) {
    return this.getRow(rowIdx).includes(number);
  }
  colHasNumber(colIdx, number) {
    return this.getCol(colIdx).includes(number);
  }
  squareHasNumber(x, y, number) {
    return this.getSquare(x, y).includes(number);
  }

  getAllSets() {
    // Build rows / cols
    const rowSets = this.INDICES.map((i) => this.getRow(i));
    const colSets = this.INDICES.map((i) => this.getCol(i));

    const squareSets = [];
    // Number of squares we have same as size of squares (eg. in a 9x9 grid, 9 squares of 3x3)
    for (const [x, y] of matrix(this.squareSize, this.squareSize)) {
      // Add a square for each position in the squares matrix
      squareSets.push(this.getSquare(x, y));
    }

    return [...rowSets, ...colSets, ...squareSets];
  }

  getAllSetsSorted() {
    return this.getAllSets().sort((a, b) =>
      Math.sign(a.missing().length - b.missing().length)
    );
  }

  iterateSortedSets(fn) {
    return this.getAllSetsSorted().forEach((set) => {
      const missing = set.missing();
      const cells = set instanceof Square ? set.flat() : set.cells;

      return fn({ set, missing, cells });
    });
  }

  solve() {
    let runs = 1;
    let valueFound = false;

    do {
      valueFound =
        this.processSoleCandidates() ||
        this.processUniqueCandidates() ||
        this.processNakedPairs();

      global.console.log(
        `Run ${runs} complete, ${this.missingValues} missing values`
      );
      runs++;
    } while (valueFound && this.missingValues > 0);

    global.console.log(`Solved! \n${this}`);

    return true;
  }

  /**
   * Process cells with only 1 valid entry
   */
  processSoleCandidates() {
    let valueFound = false;

    this.iterateSortedSets(({ missing, cells }) => {
      cells.forEach((cell) => {
        if (cell.empty()) {
          const validEntries = missing.filter((mval) => cell.entryValid(mval));

          if (validEntries.length === 1) {
            global.console.log(cell.coordinates, missing);
            cell.value = validEntries.pop();

            this.missingValues--;
            valueFound = true;
          }
        }
      });
    });

    return valueFound;
  }

  /**
   * Process missing entries for a set with only 1 valid cell placement
   */
  processUniqueCandidates() {
    let valueFound = false;

    this.iterateSortedSets(({ missing, cells }) => {
      missing.forEach((mval) => {
        const validCellsForEntry = cells.filter((cell) =>
          cell.entryValid(mval)
        );

        if (validCellsForEntry.length === 1) {
          validCellsForEntry.pop().value = mval;

          this.missingValues--;
          valueFound = true;
        }
      });
    });

    return valueFound;
  }

  /**
   * Process pairs of cells in sets with the same 2 possible answers
   */
  processNakedPairs() {
    this.generateCandidates();

    let valueFound = false;

    return valueFound;
  }

  generateCandidates() {
    if (this.candidatesGenerated) return;

    this.iterateSortedSets(({ missing, cells }) => {
      cells.forEach((cell) => cell.setValidCandidates(missing));
    });
  }

  /**
   * Pretty print the sudoku grid
   */
  toString() {
    const values = this.cellValues();
    const dividerRow = `|${values[0].map(() => "---").join("|")}|\n`;
    let str = dividerRow;

    for (const row of values) {
      str += `| ${row
        .map((val) => (val === null ? "-" : val))
        .join(" | ")} |\n`;
      str += dividerRow;
    }

    return str;
  }
};
