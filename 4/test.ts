import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { parse, solve, solvePartTwo } from "./solution.ts";

assertEquals(1, 1);

const EXAMPLE_CASE = parse(
  Deno.readTextFileSync(new URL("./example_input.txt", import.meta.url)),
);
const INPUT_CASE = parse(
  Deno.readTextFileSync(new URL("./input.txt", import.meta.url)),
);

Deno.test("day 4", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const score = solve(EXAMPLE_CASE);
      assertEquals(score, 4512);
    });

    await t.step("input case", () => {
      const score = solve(INPUT_CASE);
      assertEquals(score, 45031);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const score = solvePartTwo(EXAMPLE_CASE);
      assertEquals(score, 1924);
    });

    await t.step("input case", () => {
      const score = solvePartTwo(INPUT_CASE);
      assertEquals(score, 2568);
    });
  });
});
