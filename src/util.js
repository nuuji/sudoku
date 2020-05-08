const range = (start, end) =>
  [...Array(end - start).keys()].map((i) => i + start);

const containsAll = (arr, values) => !values.some((v) => !arr.includes(v));

/**
 * Yield pairs of matricies for a grid of size `x * y`
 */
function* matrix(y, x) {
  let counterY = 0;
  let counterX = 0;

  while (counterY < y) {
    while (counterX < x) {
      yield [counterX, counterY];
      // Walk across row
      counterX++;
    }

    // Walk down column
    counterY++;
    // Move to the first position of new row
    counterX = 0;
  }
}

/**
 * Randomise the order of an array
 */
const shuffle = (arr) =>
  arr
    .map((val) => ({ val, sort: Math.random() }))
    .sort((a, b) => Math.sign(a.sort - b.sort))
    .map((item) => item.val);

/**
 * Pesudorandom array value picker
 */
const randomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Rotate elements backwards in an array
 * @param {any[]} arr to rotate
 * @param {number} places to rotate by
 */
const rotate = (arr, places) => [...arr.slice(places), ...arr.slice(0, places)];

/**
 * Pesudorandom boolean generator
 */
const randomBool = () => Math.random() > 0.5;

module.exports = {
  range,
  containsAll,
  matrix,
  shuffle,
  randomValue,
  rotate,
  randomBool,
};
