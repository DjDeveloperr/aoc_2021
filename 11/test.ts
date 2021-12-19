import { assertEquals } from "std/testing/asserts.ts";
import { findAllFlashStep, parse, simulateFlashes } from "./solution.ts";

const EXAMPLE_INPUT = parse("./example_input.txt");
const INPUT = parse("./input.txt");

Deno.test("day 11", async (t) => {
  await t.step("part one", async (t) => {
    await t.step("example case", () => {
      const result = simulateFlashes(EXAMPLE_INPUT, 100);
      assertEquals(result, 1656);
    });

    await t.step("input case", () => {
      const result = simulateFlashes(INPUT, 100);
      assertEquals(result, 1632);
    });
  });

  await t.step("part two", async (t) => {
    await t.step("example case", () => {
      const result = findAllFlashStep(EXAMPLE_INPUT);
      assertEquals(result, 195);
    });

    await t.step("input case", () => {
      const result = findAllFlashStep(INPUT);
      assertEquals(result, 303);
    });
  });
});
