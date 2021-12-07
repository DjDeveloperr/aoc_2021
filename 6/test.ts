import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { simulate } from "./solution.ts";

const EXAMPLE_CASE = [3, 4, 3, 1, 2];
const INPUT_CASE = Deno.readTextFileSync(
  new URL("./input.txt", import.meta.url),
).split(",").map(Number);

Deno.test("day 6", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = simulate(EXAMPLE_CASE, 80);
      assertEquals(result, 5934n);
    });

    await t.step("input case", () => {
      const result = simulate(INPUT_CASE, 80);
      assertEquals(result, 396210n);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = simulate(EXAMPLE_CASE, 256);
      assertEquals(result, 26984457539n);
    });

    await t.step("input case", () => {
      const result = simulate(INPUT_CASE, 256);
      assertEquals(result, 1770823541496n);
    });
  });
});
