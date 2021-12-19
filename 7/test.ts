import { assertEquals } from "std/testing/asserts.ts";
import { solve, solvePartTwo } from "./solution.ts";

const EXAMPLE_CASE = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];
const INPUT_CASE = Deno.readTextFileSync(
  new URL("./input.txt", import.meta.url),
).split(",").map(Number);

Deno.test("day 7", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = solve(EXAMPLE_CASE);
      assertEquals(result, 37);
    });

    await t.step("input case", () => {
      const result = solve(INPUT_CASE);
      assertEquals(result, 340987);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = solvePartTwo(EXAMPLE_CASE);
      assertEquals(result, 168);
    });

    await t.step("input case", () => {
      const result = solvePartTwo(INPUT_CASE);
      assertEquals(result, 96987874);
    });
  });
});
