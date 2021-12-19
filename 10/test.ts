import { assertEquals } from "std/testing/asserts.ts";
import { solve, solvePartTwo } from "./solution.ts";

const EXAMPLE_INPUT = Deno.readTextFileSync(
  new URL("./example_input.txt", import.meta.url),
);
const INPUT = Deno.readTextFileSync(new URL("./input.txt", import.meta.url));

Deno.test("day 10", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = solve(EXAMPLE_INPUT);
      assertEquals(result, 26397);
    });

    await t.step("input case", () => {
      const result = solve(INPUT);
      assertEquals(result, 392139);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = solvePartTwo(EXAMPLE_INPUT);
      assertEquals(result, 288957);
    });

    await t.step("input case", () => {
      const result = solvePartTwo(INPUT);
      assertEquals(result, 4001832844);
    });
  });
});
