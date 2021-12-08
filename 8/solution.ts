export interface Line {
  digits: string[];
  value: number[];
}
export type Input = Line[];

export function parse(data: string) {
  const res: Input = [];

  for (const line of data.replaceAll("\r\n", "\n").split("\n")) {
    const [rawDigits, rawOutput] = line.split(" | ").map((e) =>
      e.split(" ").map((e) => e.split("").sort().join(""))
    );
    const digits = new Array<string | undefined>(10).fill(undefined);

    for (const digit of rawDigits) {
      switch (digit.length) {
        case 1:
          throw new Error("unreachable");

        case 2:
          digits[1] = digit;
          break;

        case 3:
          digits[7] = digit;
          break;

        case 4:
          digits[4] = digit;
          break;

        case 5:
        case 6:
          // Multiple possible digits
          break;

        case 7:
          digits[8] = digit;
          break;
      }
    }

    // 0 - top-left
    // 1 - top
    // 2 - top-right
    // 3 - middle
    // 4 - bottom-left
    // 5 - bottom
    // 6 - bottom-right
    const wiring = new Array<string>(7).fill("");

    // one segment which 7 has but 1 doesn't is the top one
    wiring[1] = digits[7]!.split("").find((e) => !digits[1]!.includes(e))!;

    // now we can find digit 9. It will have
    // - 6 segments
    // - all segments from 4 plus 2 new ones (one of them being top)
    digits[9] = rawDigits.find((e) =>
      e.length === 6 && digits[4]!.split("").every((d) => e.includes(d)) &&
      e.includes(wiring[1]) && e.length === 6
    );
    if (typeof digits[9] === "undefined") throw new Error("digit 9");

    // by diff-ing 4 and 9 we'll get top and bottom wiring
    // we already have top, so we'll find bottom
    wiring[5] = digits[9]!.split("").find((e) =>
      !digits[4]!.includes(e) && e !== wiring[1]
    )!;

    // digit 2 is the one which has 5 segments but doesn't fit
    // in 9.
    digits[2] = rawDigits.find((e) =>
      e.length === 5 && !e.split("").every((seg) => digits[9]!.includes(seg))
    );

    // the segments present in 4 but not in 2 are top-left and bottom-right,
    // and we already know the latter exists in 7 so we find top-left.
    wiring[0] = digits[4]!.split("").find((e) =>
      !digits[2]!.includes(e) && !digits[7]!.includes(e)
    )!;

    // something like above
    wiring[6] = digits[4]!.split("").find((e) =>
      !digits[2]!.includes(e) && e !== wiring[0]
    )!;

    // now we'll find top-right using 1 since it has top-right
    // and bottom-right
    wiring[2] = digits[1]!.split("").find((e) => e !== wiring[6])!;

    // 4 only has 4 segments: top-left, top-right, middle, bottom-right
    // we know all but middle so let's find middle
    wiring[3] = digits[4]!.split("").find((e) =>
      ![wiring[0], wiring[2], wiring[6]].includes(e)
    )!;

    // 0 is the only 6 seg digit which doesn't have middle sigment
    digits[0] = rawDigits.find((e) => e.length === 6 && !e.includes(wiring[3]));

    // digit 3 should be 9 but without top-left
    digits[3] = rawDigits.find((e) =>
      e.length === 5 && e.split("").every((x) => digits[9]!.includes(x)) &&
      !e.includes(wiring[0])
    );

    // we know all other possible 5 seg digits so
    digits[5] = rawDigits.find((e) =>
      e.length === 5 && ![digits[2], digits[3]].includes(e)
    );

    // like above but 6 seg
    digits[6] = rawDigits.find((e) =>
      e.length === 6 && ![digits[9], digits[0]].includes(e)
    );

    res.push({
      digits: digits as string[],
      value: rawOutput.map((e) => digits.findIndex((x) => e === x)),
    });
  }

  return res;
}

export function solve(input: Input) {
  let result = 0;
  for (const line of input) {
    for (const digit of line.value) {
      if ([1, 4, 7, 8].includes(digit)) result++;
    }
  }
  return result;
}

export function solvePartTwo(input: Input) {
  let result = 0;
  for (const line of input) {
    let num = 0;
    for (const digit of line.value) {
      num = num * 10 + digit;
    }
    result += num;
  }
  return result;
}
