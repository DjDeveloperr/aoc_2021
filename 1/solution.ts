// https://adventofcode.com/2021/day/1

export function solve(measurements: number[]) {
  let result = 0;

  for (let i = 0; i < measurements.length; i++) {
    if (i > 0 && measurements[i] > measurements[i - 1]) result++;
  }

  return result;
}

export function solvePartTwo(measurements: number[]) {
  let result = 0;
  let lastGroup: number | undefined;
  let currentGroup = 0;
  let currentGroupIndex = 0;
  let index = 0;

  while (index < measurements.length) {
    currentGroup += measurements[index];

    if (currentGroupIndex === 2) {
      if (lastGroup !== undefined && currentGroup > lastGroup) {
        result++;
      }
      lastGroup = currentGroup;
      currentGroup = 0;
      currentGroupIndex = 0;
      index--;
    } else {
      currentGroupIndex++;
      index++;
    }
  }

  return result;
}
