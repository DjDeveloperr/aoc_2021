type Point = [x: number, y: number];
type Line = [a: Point, b: Point];
type Lines = Iterable<Line>;

export function* parse(data: string): Lines {
  for (const line of data.replaceAll("\r\n", "\n").split("\n")) {
    const [a, b] = line.split(" -> ");
    const [pa, pb] = [a, b].map((e) => e.split(",").map(Number)) as Point[];
    yield [pa, pb];
  }
}

function* expandCoords(
  [x1, y1]: Point,
  [x2, y2]: Point,
  diag = false,
): IterableIterator<Point> {
  if (x1 === x2 && y1 === y2) {
    // Both points are same
    yield [x1, y1];
  } else if (x1 === x2 && y1 !== y2) {
    // Moves along x-axis
    [y1, y2] = [y1, y2].sort((a, b) => a - b);
    for (let y = y1; y <= y2; y++) {
      yield [x1, y];
    }
  } else if (x1 !== x2 && y1 === y2) {
    // Moves along y-axis
    [x1, x2] = [x1, x2].sort((a, b) => a - b);
    for (let x = x1; x <= x2; x++) {
      yield [x, y1];
    }
  } else {
    // Diagonal movement (moves along both axis)
    if (!diag) return;
    const ys = Math.round((y2 - y1) / (x2 - x1));
    for (
      let x = (x1 < x2 ? x1 : x2), y = (x1 < x2 ? y1 : y2);
      x <= (x1 < x2 ? x2 : x1);
      x++, y += ys
    ) {
      yield [x, y];
    }
  }
}

function packCoord([x, y]: Point) {
  return `${x},${y}`;
}

export function solve(input: Lines, diag = false) {
  const coords = new Map();

  for (const [a, b] of input) {
    for (const coord of expandCoords(a, b, diag)) {
      const v = packCoord(coord);
      if (!coords.has(v)) {
        coords.set(v, 1);
      } else {
        coords.set(v, coords.get(v) + 1);
      }
    }
  }

  return [...coords.entries()].filter(([, x]) => x > 1).length;
}
