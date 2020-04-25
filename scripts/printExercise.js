const Sudoku = require('../src/Sudoku');

const EXERCISE = process.argv[2];

if (!EXERCISE) throw new Error('Usage: `yarn printExercise basic` (where `basic` is an exercise)');

// Load the exercise to print
const grid = require(`../exercises/${EXERCISE}.js`);

console.log(`Printing blank '${EXERCISE}' exercise grid...`);

console.log(new Sudoku(grid).toString());
