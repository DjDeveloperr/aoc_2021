export function parse(file: string) {
  const data = Deno.readTextFileSync(new URL(file, import.meta.url));
  return data.replaceAll("\r\n", "\n").split("\n").map((e) =>
    e.split("").map(Number)
  ).flat();
}

function indexFromPoint(x: number, y: number) {
  return x + y * 10;
}

function adjacent(x: number, y: number) {
  return [
    [x + 1, y],
    [x, y + 1],
    [x + 1, y + 1],
    [x - 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y - 1],
  ].filter(([x, y]) => x >= 0 && y >= 0 && x < 10 && y < 10);
}

function flash(
  data: Uint8Array,
  flashed: Set<number>,
  x: number,
  y: number,
) {
  let flashes = 0;
  const i = indexFromPoint(x, y);
  if (flashed.has(i)) return flashes;
  else flashed.add(i);
  flashes++;
  adjacent(x, y).forEach(([ax, ay]) => {
    const curr = ++data[indexFromPoint(ax, ay)];
    if (curr > 9) {
      flashes += flash(data, flashed, ax, ay);
    }
  });
  return flashes;
}

export function simulateFlashes(input: number[], steps: number) {
  const data = new Uint8Array(100);
  data.set(input);
  let flashes = 0;
  const flashed = new Set<number>();

  for (let step = 0; step < steps; step++) {
    data.forEach((_, i) => {
      data[i]++;
    });

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const curr = data[indexFromPoint(x, y)];
        if (curr > 9) {
          flashes += flash(data, flashed, x, y);
        }
      }
    }

    for (const octo of flashed) {
      data[octo] = 0;
      flashed.delete(octo);
    }
  }

  return flashes;
}

export function findAllFlashStep(input: number[]) {
  const data = new Uint8Array(100);
  data.set(input);
  const flashed = new Set<number>();

  let step = 0;
  while (true) {
    data.forEach((_, i) => {
      data[i]++;
    });

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const curr = data[indexFromPoint(x, y)];
        if (curr > 9) {
          flash(data, flashed, x, y);
        }
      }
    }

    step++;

    if (flashed.size === 100) {
      break;
    }

    for (const octo of flashed) {
      data[octo] = 0;
      flashed.delete(octo);
    }
  }

  return step;
}
