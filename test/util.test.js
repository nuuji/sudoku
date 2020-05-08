const { range, containsAll, matrix, shuffle } = require("../src/util");

describe("utils", () => {
  describe("range()", () => {
    it("generates a correct range starting at 0", () => {
      const zeroToNine = range(0, 10);

      for (let i = 0; i < 10; i++) {
        expect(zeroToNine).toContain(i);
      }

      expect(zeroToNine).not.toContain(10);
    });

    it("generates a correct range NOT starting at 0", () => {
      const oneToFour = range(1, 5);

      expect(oneToFour).not.toContain(0);
      expect(oneToFour).toContain(1);
      expect(oneToFour).toContain(2);
      expect(oneToFour).toContain(3);
      expect(oneToFour).toContain(4);
      expect(oneToFour).not.toContain(5);
    });
  });

  describe("containsAll()", () => {
    it("finds all contained values correctly", () => {
      const arr = [1, 2, "three"];
      expect(containsAll(arr, [1, 2, "three"])).toBe(true);
      expect(containsAll(arr, [2, "three"])).toBe(true);
    });

    it("does not find missing values", () => {
      const arr = [1, 2, "three"];
      expect(containsAll(arr, [1, 2, "three", "four"])).toBe(false);
      expect(containsAll(arr, [2, "three", 4])).toBe(false);
      expect(containsAll(arr, ["four"])).toBe(false);
    });
  });

  describe("*matrix()", () => {
    it("generates a zero-indexed 2x2 matrix", () => {
      const m = matrix(2, 2);
      expect(m.next().value).toEqual([0, 0]);
      expect(m.next().value).toEqual([1, 0]);
      expect(m.next().value).toEqual([0, 1]);
      expect(m.next().value).toEqual([1, 1]);
      expect(m.next().done).toBe(true);
    });

    it("generates a zero-indexed 3x3 matrix", () => {
      const m = matrix(3, 3);
      expect(m.next().value).toEqual([0, 0]);
      expect(m.next().value).toEqual([1, 0]);
      expect(m.next().value).toEqual([2, 0]);
      expect(m.next().value).toEqual([0, 1]);
      expect(m.next().value).toEqual([1, 1]);
      expect(m.next().value).toEqual([2, 1]);
      expect(m.next().value).toEqual([0, 2]);
      expect(m.next().value).toEqual([1, 2]);
      expect(m.next().value).toEqual([2, 2]);
      expect(m.next().done).toBe(true);
    });

    it("should generate a zero-indexed matrix of size x * y", () => {
      const pairs = [
        [2, 2],
        [2, 3],
        [4, 4],
        [6, 6],
        [9, 9],
        [9, 10],
      ];

      pairs.forEach(([x, y]) => {
        const matrixSize = [...matrix(x, y)].length;
        expect(matrixSize).toBe(x * y);
      });
    });
  });

  describe("shuffle()", () => {
    it("it random enough in array shuffling", () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8];
      const shuffledResults = [original];

      for (let i = 0; i < 20; i++) {
        const shuffled = shuffle(original);
        // Should be different to all the other results so far
        shuffledResults.forEach((otherShuffled) =>
          expect(otherShuffled).not.toEqual(shuffled)
        );
        shuffledResults.push(shuffled);
      }
    });
  });
});
