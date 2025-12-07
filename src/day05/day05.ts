import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day05/day05.txt", "utf8");
  const [rangesRaw, ingredients] = input.split("\n\n");
  const ranges = rangesRaw.split("\n");
  return {
    ranges: ranges.map((r) => [
      Number.parseInt(r.split("-")[0]),
      Number.parseInt(r.split("-")[1]),
    ]),
    ingredients: ingredients.split("\n").map((i) => Number.parseInt(i)),
  };
}

function getNumFreshIngredients() {
  const { ranges, ingredients } = readInput();
  let numFresh = 0;
  for (let ingredient of ingredients) {
    for (const range of ranges) {
      if (ingredient >= range[0] && ingredient <= range[1]) {
        numFresh++;
        break;
      }
    }
  }
  return numFresh;
}

// part 2
function mergeRanges(ranges: number[][]) {
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const currentRange = ranges[i];
    const lastMergedRange = merged[merged.length - 1];
    if (currentRange[0] <= lastMergedRange[1]) {
      lastMergedRange[1] = Math.max(lastMergedRange[1], currentRange[1]);
    } else {
      merged.push(currentRange);
    }
  }
  return merged;
}
function getNumFreshIngredients2() {
  const { ranges } = readInput();
  const mergedRanges = mergeRanges(ranges);
  let numFresh = 0;
  for (const range of mergedRanges) {
    numFresh += range[1] - range[0] + 1;
  }
  return numFresh;
}
console.log("Part 1: ", getNumFreshIngredients());
console.log("Part 2: ", getNumFreshIngredients2());
