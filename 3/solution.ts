// https://adventofcode.com/2021/day/3

export function solve(numbers: string[]) {
  const commonLength = numbers[0].length;
  let gammaRate = 0;
  let epsilonRate = 0;

  for (let i = 0; i < commonLength; i++) {
    let ones = 0, zeroes = 0;
    for (const num of numbers) {
      const bit = num[commonLength - i - 1];
      if (bit === "1") ones++;
      else zeroes++;
    }

    const mcb = ones > zeroes ? 1 : 0;
    const lcb = mcb ^ 1;

    gammaRate += mcb * 2 ** i;
    epsilonRate += lcb * 2 ** i;
  }

  return gammaRate * epsilonRate;
}

function step(
  rating: 0 | 1,
  index: number,
  f: string[],
): [string[], number | undefined] {
  let ones = 0, zeroes = 0;
  for (let j = 0; j < f.length; j++) {
    f[j][index] === "1" ? ++ones : ++zeroes;
  }

  const bit = String(
    ones === zeroes ? (rating ^ 1) : ((ones > zeroes ? 1 : 0) ^ rating),
  );

  f = f.filter((e) => e[index] === bit);
  if (f.length === 1) {
    return [[], parseInt(f[0], 2)];
  } else return [f, undefined];
}

export function solvePartTwo(numbers: string[]) {
  const commonLength = numbers[0].length;
  let r1: number | undefined = undefined,
    r2: number | undefined = undefined,
    r1Filter: string[] = [...numbers],
    r2Filter: string[] = [...numbers];

  for (let i = 0; i < commonLength; i++) {
    if (typeof r1 === "undefined") {
      [r1Filter, r1] = step(0, i, r1Filter);
    }

    if (typeof r2 === "undefined") {
      [r2Filter, r2] = step(1, i, r2Filter);
    }
  }

  return r1! * r2!;
}
