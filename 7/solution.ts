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

/**
 * AP: 1, 2, 3, 4, 5, ...
 * a(n) = a + (n-1)d
 * S(n) = n/2(2a + (n-1)d)
 * a = 1, d = 1
 * S(n) = n/2 (2 + n - 1)
 *      = n/2 * (1 + n)
 *      = n/2 + n2/2 = n + n2 / 2
 */

/**
 * 1 to 5
 * 1 to 2 => 1f
 * 2 to 3 => 1f + 2f = 3f
 * 3 to 4 => 1f + 2f + 3f = 6f
 * 4 to 5 => 1f + 2f + 3f + 4f = 10f
 */
