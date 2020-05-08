const Sudoku = require("./Sudoku");
const {
  range,
  matrix,
  shuffle,
  randomValue,
  rotate,
  randomBool,
} = require("./util");

module.exports = class Generator {
  constructor(gridSize, numberBlanks) {
    this.gridSize = gridSize;
    this.numberBlanks = numberBlanks;
    this.squareSize = Math.sqrt(gridSize);
    this.allDigits = range(1, gridSize + 1);

    // Create blank grid of gridSize x gridSize
    const blankGrid = Array(gridSize).fill(Array(gridSize).fill(null));
    this.s = new Sudoku(blankGrid);

    this.log = global.console.log;
  }

  execute() {
    this.logExclusively();
    this.fillGrid();

    this.log("Starting puzzle! Shuffling...");
    this.logGrid();

    // We have a valid puzzle but must shuffle around so users don't see patterns
    this.flipX();
    this.flipY();
    this.shuffleColumns();
    this.shuffleRows();

    this.log("Shuffling finished! Correcting coordinates...");
    this.logGrid();
    this.correctCoordinates();

    this.log("Now time to remove some values...");
    this.removeValues();

    this.log("All done! Your puzzle...");
    this.logGrid();

    this.destroyExclusiveLogger();
  }

  /**
   * Fill the grid with initial values
   */
  fillGrid() {
    let lastRow = shuffle(this.allDigits);
    for (let i = 0; i < this.gridSize; i++) {
      lastRow = rotate(lastRow, i % 3 === 0 ? 1 : 3);
      this.fillRow(this.s.getRow(i), lastRow);
    }
  }

  /**
   * Fill a row with an array of values
   * @param {Row} row to fill
   * @param {number[]} values to fill row with
   */
  fillRow(row, values) {
    let counter = 0;
    for (const cell of row) {
      cell.value = values[counter++];
    }
  }

  /**
   * Randomly flip the grid horizontally
   */
  flipX() {
    if (randomBool()) {
      this.s.g.forEach((row) => row.reverse());
      this.log("Flipped puzzle on x-axis!");
      this.logGrid();
    }
  }

  /**
   * Randomly flip the grid vertically
   */
  flipY() {
    if (randomBool()) {
      this.s.g.reverse();
      this.log("Flipped puzzle on y-axis!");
      this.logGrid();
    }
  }

  /**
   * Shuffle columns along by a random multiple of 3
   */
  shuffleColumns() {
    const columnRotation =
      this.squareSize * Math.floor(Math.random() * this.squareSize);
    if (columnRotation > 0) {
      this.s.g = this.s.g.map((row) => rotate(row, columnRotation));
      this.log(`Rotated puzzle by ${columnRotation} columns!`);
      this.logGrid();
    }
  }

  /**
   * Shuffle rows along by a random multiple of 3
   */
  shuffleRows() {
    const rowRotation =
      this.squareSize * Math.floor(Math.random() * this.squareSize);
    if (rowRotation > 0) {
      this.s.g = rotate(this.s.g, rowRotation);
      this.log(`Rotated puzzle by ${rowRotation} rows!`);
      this.logGrid();
    }
  }

  /**
   * Correct the `coordinates` properties for the
   * newly shuffled cells
   */
  correctCoordinates() {
    for (const [x, y] of matrix(this.gridSize, this.gridSize)) {
      this.s.getCell(x, y).coordinates = [x, y];
    }
  }

  removeValues() {
    let blanked = 0;
    while (blanked < this.numberBlanks) {
      const randomCell = randomValue(randomValue(this.s.g));
      if (!randomCell.empty()) {
        const { value } = randomCell;
        randomCell.value = null;

        const validCellValues = this.allDigits.filter((i) =>
          randomCell.entryValid(i)
        );

        if (validCellValues.length === 1 && validCellValues[0] === value) {
          blanked++;
        } else {
          // We can't delete this one; more than 1 path if removed
          randomCell.value = value;
        }
      }
    }
  }

  logGrid() {
    this.log(this.s.toString());
  }

  /**
   * Disable all logging from outside this class
   */
  logExclusively() {
    global.console.log = () => {};
  }

  /**
   * Enable logging from outside this class
   */
  destroyExclusiveLogger() {
    global.console.log = this.log;
  }
};
