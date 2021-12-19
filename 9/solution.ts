export class HeightMap extends Uint8Array {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super(width * height);
    this.width = width;
    this.height = height;
  }

  indexFromPoint(x: number, y: number) {
    return x + y * this.width;
  }

  pointFromIndex(index: number): [number, number] {
    return [
      index % this.width,
      Math.floor(index / this.width),
    ];
  }

  setHeight(x: number, y: number, v: number) {
    this[this.indexFromPoint(x, y)] = v;
  }

  getHeight(x: number, y: number) {
    return this[this.indexFromPoint(x, y)];
  }

  isPointInBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && y < this.height && x < this.width;
  }

  forEachPoint(
    stepX: (x: number, y: number, value: number) => unknown,
    stepY?: (y: number) => unknown,
  ) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        stepX(x, y, this.getHeight(x, y));
      }
      stepY?.(y);
    }
  }

  getAdjacentPoints(x: number, y: number): number[];
  getAdjacentPoints(
    x: number,
    y: number,
    includePoints: true,
  ): [x: number, y: number, v: number][];
  getAdjacentPoints(
    x: number,
    y: number,
    includePoints?: true,
  ) {
    const adjacent: unknown[] = [];

    [
      [x - 1, y],
      [x, y - 1],
      [x + 1, y],
      [x, y + 1],
    ].forEach(([x, y]) => {
      if (!this.isPointInBounds(x, y)) return;
      if (includePoints) {
        adjacent.push([x, y, this.getHeight(x, y)]);
      } else {
        adjacent.push(this.getHeight(x, y));
      }
    });

    return adjacent;
  }

  isLowPoint(x: number, y: number, v?: number) {
    v = v ?? this.getHeight(x, y);
    return this.getAdjacentPoints(x, y).every((value) => value > v!);
  }

  findLowPoints() {
    const lowPoints: [number, number, number][] = [];
    this.forEachPoint((x, y, v) => {
      if (this.isLowPoint(x, y, v)) {
        lowPoints.push([x, y, v]);
      }
    });
    return lowPoints;
  }

  findSumOfRiskLevels() {
    return this.findLowPoints().reduce((p, a) => p + a[2] + 1, 0);
  }

  getBasin(x: number, y: number, exclude = new Set<number>()) {
    const basin: number[] = [this.getHeight(x, y)];
    exclude.add(this.indexFromPoint(x, y));

    this.getAdjacentPoints(x, y, true).forEach(([ax, ay, v]) => {
      if (v === 9) return; // its too high
      const i = this.indexFromPoint(ax, ay);
      if (exclude.has(i)) return;
      else exclude.add(i);
      const innerBasin = this.getBasin(...this.pointFromIndex(i), exclude);
      basin.push(...innerBasin);
    });

    return basin;
  }

  getBasins() {
    return this.findLowPoints().map(([x, y]) => this.getBasin(x, y));
  }

  solvePartTwo() {
    return this.getBasins().sort((a, b) => b.length - a.length).filter((_, i) =>
      i < 3
    ).reduce((p, a) => p * a.length, 1);
  }

  static parse(data: string) {
    const lines = data.replaceAll("\r\n", "\n").split("\n");

    const height = lines.length;
    const width = lines[0].length;

    const map = new HeightMap(width, height);
    map.forEachPoint((x, y) => map.setHeight(x, y, Number(lines[y][x])));

    return map;
  }
}
