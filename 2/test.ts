import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { Command, solve, solvePartTwo } from "./solution.ts";

const EXAMPLE_CASE = [
  "forward 5",
  "down 5",
  "forward 8",
  "up 3",
  "down 8",
  "forward 2",
] as Command[];

const INPUT_CASE = Deno.readTextFileSync(
  new URL("./input.txt", import.meta.url),
).replaceAll("\r\n", "\n").split("\n") as Command[];

Deno.test("part one", async (t) => {
  await t.step("example case", () => {
    const result = solve(EXAMPLE_CASE);
    assertEquals(result, 150);
  });

  await t.step("input case", () => {
    const result = solve(INPUT_CASE);
    assertEquals(result, 1660158);
  });
});

Deno.test("part two", async (t) => {
  await t.step("example case", () => {
    const result = solvePartTwo(EXAMPLE_CASE);
    assertEquals(result, 900);
  });

  await t.step("input case", () => {
    const result = solvePartTwo(INPUT_CASE);
    assertEquals(result, 1604592846);
  });
});
