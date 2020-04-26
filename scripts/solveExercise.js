const EXERCISE = process.argv[2];

if (!EXERCISE) throw new Error('Usage: `yarn start basic` (where `basic` is an exercise)');

// Load the exercise to solve
const grid = require(`../exercises/${EXERCISE}.js`);

new (require('../src/Sudoku'))(grid).solve();

// Any rows, cols or squares containing n - 1 of n missing items
// middle set of squares, 2 9s example
// 2 possibilities - predictions???
// When 1 of 2 cells experiencing duality is filled in, trigger other square to be filled in
// Behaviour or 2 dual cells in 1 row / col / square
