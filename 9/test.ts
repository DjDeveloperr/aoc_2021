import { assertEquals } from "std/testing/asserts.ts";
import { HeightMap } from "./solution.ts";

const EXAMPLE_INPUT = HeightMap.parse(
  Deno.readTextFileSync(new URL("./example_input.txt", import.meta.url)),
);
const INPUT = HeightMap.parse(
  Deno.readTextFileSync(new URL("./input.txt", import.meta.url)),
);

Deno.test("day 9", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = EXAMPLE_INPUT.findSumOfRiskLevels();
      assertEquals(result, 15);
    });

    await t.step("input case", () => {
      const result = INPUT.findSumOfRiskLevels();
      assertEquals(result, 588);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = EXAMPLE_INPUT.solvePartTwo();
      assertEquals(result, 1134);
    });

    await t.step("input case", () => {
      const result = INPUT.solvePartTwo();
      assertEquals(result, 964712);
    });
  });
});
