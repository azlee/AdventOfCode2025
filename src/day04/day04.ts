import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day04/day04.txt", "utf8");
  const lines: string[] = input.split(/\n/);
  const grid: string[][] = [];
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    const row = [];
    for (let i = 0; i < line.length; i++) {
      row.push(line[i]);
    }
    grid.push(row);
  }
  return grid;
}
const dirs = [
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [0, -1],
  [0, 1],
  [1, 0],
  [1, -1],
  [1, 1],
];
function getRollsAccessible(grid: string[][], removeAccessible: boolean) {
  let accessibleRolls = 0;
  let numRemoved = 0;
  const accessiblePosition: number[][] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let numRollsOfPaper = 0;
      // check all sides
      for (const dir of dirs) {
        const x = i + dir[0];
        const y = j + dir[1];
        if (
          x >= 0 &&
          y >= 0 &&
          x < grid.length &&
          y < grid[i].length &&
          grid[x][y] === "@"
        ) {
          numRollsOfPaper++;
        }
      }
      if (numRollsOfPaper < 4 && grid[i][j] === "@") {
        accessibleRolls++;
        if (removeAccessible) {
          numRemoved++;
          accessiblePosition.push([i, j]);
        }
      }
    }
    if (removeAccessible) {
      for (const pos of accessiblePosition) {
        grid[pos[0]][pos[1]] = "x";
      }
    }
  }
  return { accessibleRolls, grid, numRemoved };
}

function part1() {
  const { accessibleRolls } = getRollsAccessible(readInput(), false);
  return accessibleRolls;
}
function part2() {
  let gridSoFar = readInput();
  let { grid, numRemoved } = getRollsAccessible(gridSoFar, true);
  let totalRemoved = numRemoved;
  while (numRemoved !== 0) {
    const data = getRollsAccessible(grid, true);
    grid = data.grid;
    numRemoved = data.numRemoved;
    totalRemoved += numRemoved;
  }
  return totalRemoved;
}
console.log("Day 4 part 1", part1());
console.log("Day 4 part 2", part2());
