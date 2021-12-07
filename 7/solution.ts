export function solve(positions: number[]) {
  const all = new Uint32Array(Math.max(...positions));
  for (let i = 0; i < all.length; i++) {
    all[i] = positions.map((e) => Math.abs(e - i)).reduce((p, a) => p + a, 0);
  }
  return all.sort((a, b) => a - b)[0];
}

export function solvePartTwo(positions: number[]) {
  const all = new Uint32Array(Math.max(...positions));
  for (let i = 0; i < all.length; i++) {
    all[i] = positions.map((e) => {
      const steps = Math.abs(e - i);
      return (steps + Math.pow(steps, 2)) / 2;
    }).reduce((p, a) => p + a, 0);
  }
  return all.sort((a, b) => a - b)[0];
}
