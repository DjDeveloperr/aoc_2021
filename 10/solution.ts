function isOpening(ch: string) {
  return "({[<".includes(ch);
}

function isClosing(ch: string) {
  return ")}]>".includes(ch);
}

function invert(ch: string) {
  return ({
    "(": ")",
    "{": "}",
    "[": "]",
    "<": ">",
    ")": "(",
    "}": "{",
    "]": "[",
    ">": "<",
  })[ch];
}

function parse(line: string): { error: string } | { completion: string } {
  const stack: string[] = [];
  const last = () => stack[stack.length - 1];

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (isOpening(ch)) {
      stack.push(invert(ch)!);
    } else if (isClosing(ch)) {
      const top = last();
      stack.pop();
      if (top !== ch) {
        return { error: ch };
      }
    } else throw new Error(`unexpected character: ${ch}`);
  }

  return { completion: stack.reverse().join("") };
}

export function solve(data: string) {
  let errorScore = 0;
  for (const line of data.replaceAll("\r\n", "\n").split("\n")) {
    const result = parse(line);
    if ("error" in result) {
      errorScore += ({
        "undefined": 0,
        ")": 3,
        "]": 57,
        "}": 1197,
        ">": 25137,
      })[String(result.error)]!;
    }
  }

  return errorScore;
}

export function solvePartTwo(data: string) {
  const scores: number[] = [];
  for (const line of data.replaceAll("\r\n", "\n").split("\n")) {
    const result = parse(line);
    if ("completion" in result) {
      let score = 0;
      for (const ch of result.completion) {
        score *= 5;
        score += ({
          ")": 1,
          "]": 2,
          "}": 3,
          ">": 4,
        })[ch]!;
      }
      scores.push(score);
    }
  }
  scores.sort((a, b) => a - b);
  return scores[Math.round(scores.length / 2) - 1];
}
