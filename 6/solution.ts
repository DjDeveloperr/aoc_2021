export function simulate(initial: number[], days: number) {
  let day = 0;
  const state = new BigUint64Array(9);
  initial.forEach((e) => {
    state[e]++;
  });

  for (day = 1; day <= days; day++) {
    const oldZero = state[0];
    state[0] = 0n;
    for (let i = 1; i < 9; i++) {
      state[i - 1] += state[i];
      state[i] = 0n;
    }
    state[6] += oldZero;
    state[8] += oldZero;
  }

  return state.reduce((p, a) => p + a, 0n);
}
