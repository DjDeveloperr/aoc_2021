import { assertEquals } from "std/testing/asserts.ts";
import { parse, solve, solvePartTwo } from "./solution.ts";

const EXAMPLE_CASE = parse(
  Deno.readTextFileSync(new URL("./example_input.txt", import.meta.url)),
);
const INPUT_CASE = parse(
  Deno.readTextFileSync(new URL("./input.txt", import.meta.url)),
);

Deno.test("day 8", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = solve(EXAMPLE_CASE);
      assertEquals(result, 26);
    });

    await t.step("input case", () => {
      const result = solve(INPUT_CASE);
      assertEquals(result, 392);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = solvePartTwo(EXAMPLE_CASE);
      assertEquals(result, 61229);
    });

    await t.step("input case", () => {
      const result = solvePartTwo(INPUT_CASE);
      assertEquals(result, 1004688);
    });
  });
});
