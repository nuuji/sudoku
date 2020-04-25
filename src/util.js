const range = (start, end) => [...Array(end - start).keys()].map(i => i + start);

const containsAll = (arr, values) => !values.some(v => !arr.includes(v));

/**
 * Yield pairs of matricies for a grid of size `x * y`
 */
function *matrix(y, x) {
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

module.exports = {
    range,
    containsAll,
    matrix,
};
