import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { solve, solvePartTwo } from "./solution.ts";

const EXAMPLE_CASE = [
  "00100",
  "11110",
  "10110",
  "10111",
  "10101",
  "01111",
  "00111",
  "11100",
  "10000",
  "11001",
  "00010",
  "01010",
];

const INPUT_CASE = Deno.readTextFileSync(
  new URL("./input.txt", import.meta.url),
).replaceAll("\r\n", "\n").split("\n");

Deno.test("day 3", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = solve(EXAMPLE_CASE);
      assertEquals(result, 198);
    });

    await t.step("input case", () => {
      const result = solve(INPUT_CASE);
      assertEquals(result, 4174964);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = solvePartTwo(EXAMPLE_CASE);
      assertEquals(result, 230);
    });

    await t.step("input case", () => {
      const result = solvePartTwo(INPUT_CASE);
      assertEquals(result, 4474944);
    });
  });
});
