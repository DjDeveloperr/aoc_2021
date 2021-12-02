// https://adventofcode.com/2021/day/2

export type ForwardCommand<X extends number> = `forward ${X}`;
export type DownCommand<X extends number> = `down ${X}`;
export type UpCommand<X extends number> = `up ${X}`;
export type Command<X extends number = number> =
  | ForwardCommand<X>
  | DownCommand<X>
  | UpCommand<X>;

export function solve(commands: Command[]) {
  let horizontal = 0;
  let depth = 0;

  for (const command of commands) {
    const x = Number(command.match(/\d+/));
    if (command.startsWith("forward")) {
      horizontal += x;
    } else if (command.startsWith("down")) {
      depth += x;
    } else if (command.startsWith("up")) {
      depth -= x;
    }
  }

  return horizontal * depth;
}

export function solvePartTwo(commands: Command[]) {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for (const command of commands) {
    const x = Number(command.match(/\d+/));
    if (command.startsWith("forward")) {
      horizontal += x;
      depth += aim * x;
    } else if (command.startsWith("down")) {
      aim += x;
    } else if (command.startsWith("up")) {
      aim -= x;
    }
  }

  return horizontal * depth;
}
