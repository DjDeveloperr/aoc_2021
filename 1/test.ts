import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { solve, solvePartTwo } from "./solution.ts";

const EXAMPLE_CASE = [
  199,
  200,
  208,
  210,
  200,
  207,
  240,
  269,
  260,
  263,
];

const INPUT_CASE = Deno.readTextFileSync(
  new URL("./input.txt", import.meta.url),
).replaceAll(
  "\r\n",
  "\n",
)
  .split("\n").map(Number);

Deno.test("part one", async (t) => {
  await t.step("example case", () => {
    const result = solve(EXAMPLE_CASE);
    assertEquals(result, 7);
  });

  await t.step("input case", () => {
    const result = solve(INPUT_CASE);
    assertEquals(result, 1228);
  });
});

Deno.test("part two", async (t) => {
  await t.step("example case", () => {
    const result = solvePartTwo(EXAMPLE_CASE);
    assertEquals(result, 5);
  });

  await t.step("input case", () => {
    const result = solvePartTwo(INPUT_CASE);
    assertEquals(result, 1257);
  });
});
