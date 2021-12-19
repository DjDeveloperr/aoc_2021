@echo off

mkdir %1
cd %1

echo.> solution.ts
echo import {} from "std/testing/asserts.ts"; > test.ts
echo.> input.txt
echo.> example_input.txt

cd ..
