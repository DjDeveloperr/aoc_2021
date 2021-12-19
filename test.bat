@echo off
deno test --allow-read --allow-write --import-map=./import_map.json --unstable %1
