export interface Input {
  numbers: number[];
  boards: number[][];
}

export function parse(text: string): Input {
  const [numbersText, ...boardTexts] = text.replaceAll("\r\n", "\n").split(
    "\n\n",
  );
  const numbers = numbersText.split(",").map(Number);
  const boards: number[][] = [];

  for (const boardText of boardTexts) {
    const board: number[] = [];
    for (const num of boardText.match(/( |\d)\d(\n| |)/g)!.map(Number)) {
      board.push(num);
    }

    boards.push(board);
  }

  return {
    numbers,
    boards,
  };
}

function hasRevealed(flags: number, index: number) {
  index = 1 << index;
  return (flags & index) === index;
}

function revealedEvery(flags: number, ...indices: number[]) {
  return indices.every((e) => hasRevealed(flags, e));
}

function hasWon(flags: number) {
  return revealedEvery(flags, 0, 1, 2, 3, 4) ||
    revealedEvery(flags, 5, 6, 7, 8, 9) ||
    revealedEvery(flags, 10, 11, 12, 13, 14) ||
    revealedEvery(flags, 15, 16, 17, 18, 19) ||
    revealedEvery(flags, 20, 21, 22, 23, 24) ||
    revealedEvery(flags, 0, 5, 10, 15, 20) ||
    revealedEvery(flags, 1, 6, 11, 16, 21) ||
    revealedEvery(flags, 2, 7, 12, 17, 22) ||
    revealedEvery(flags, 3, 8, 13, 18, 23) ||
    revealedEvery(4, 9, 14, 19, 24);
}

export function solve(input: Input) {
  const revealed = new Uint32Array(input.boards.length).fill(0);
  let winningBoard: number,
    numIndex = 0,
    num!: number;

  while (
    (winningBoard = revealed.findIndex(hasWon)) < 0 &&
    numIndex < input.numbers.length
  ) {
    num = input.numbers[numIndex];
    for (let i = 0; i < input.boards.length; i++) {
      const board = input.boards[i];
      const index = board.findIndex((e) => e === num);
      if (index > -1) {
        revealed[i] |= 1 << index;
      }
    }
    numIndex++;
  }

  if (winningBoard < 0) throw new Error("unreachable");

  let score = 0;
  const board = input.boards[winningBoard];
  const flags = revealed[winningBoard];
  for (let i = 0; i < board.length; i++) {
    if (!hasRevealed(flags, i)) {
      score += board[i];
    }
  }
  score *= num;

  return score;
}

export function solvePartTwo(input: Input) {
  const revealed = new Uint32Array(input.boards.length).fill(0);
  const boardsCompleted = new Set<number>();
  let lastBoardWin!: number,
    numIndex = 0,
    num!: number;

  while (numIndex < input.numbers.length) {
    num = input.numbers[numIndex];
    for (let i = 0; i < input.boards.length; i++) {
      if (boardsCompleted.has(i)) continue;
      const board = input.boards[i];
      const index = board.findIndex((e) => e === num);
      if (index > -1) {
        revealed[i] |= 1 << index;
      }
      if (hasWon(revealed[i])) {
        boardsCompleted.add(i);
        lastBoardWin = i;
      }
    }
    if (boardsCompleted.size === input.boards.length) {
      break;
    }
    numIndex++;
  }

  if (typeof lastBoardWin !== "number") throw new Error("unreachable");

  let score = 0;
  const board = input.boards[lastBoardWin];
  const flags = revealed[lastBoardWin];
  for (let i = 0; i < board.length; i++) {
    if (!hasRevealed(flags, i)) {
      score += board[i];
    }
  }
  score *= num;

  return score;
}
