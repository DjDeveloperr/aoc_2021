import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { parse, solve } from "./solution.ts";

const EXAMPLE_CASE = [...parse(
  `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`,
)];

const INPUT_CASE = [...parse(
  Deno.readTextFileSync(new URL("./input.txt", import.meta.url)),
)];

Deno.test("day 5", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = solve(EXAMPLE_CASE);
      assertEquals(result, 5);
    });

    await t.step("input case", () => {
      const result = solve(INPUT_CASE);
      assertEquals(result, 5084);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = solve(EXAMPLE_CASE, true);
      assertEquals(result, 12);
    });

    await t.step("input case", () => {
      const result = solve(INPUT_CASE, true);
      assertEquals(result, 17882);
    });
  });
});
