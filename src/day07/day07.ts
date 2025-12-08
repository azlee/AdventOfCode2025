import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day07/day07.txt", "utf8");
  const grid: string[][] = [];
  const lines = input.split("\n");
  for (const line of lines) {
    const row = [];
    for (let i of line) {
      row.push(i);
    }
    grid.push(row);
  }
  return grid;
}

function isValidPos(position: [number, number], grid: string[][]) {
  return (
    position[0] >= 0 &&
    position[0] < grid.length &&
    position[1] >= 0 &&
    position[1] < grid[0].length
  );
}
function formPosString(position: [number, number]) {
  return `${position[0]}-${position[1]}`;
}
function getNumberBeamSplits(
  currPosition: [number, number],
  grid: string[][],
  seenPositions: Set<string>
): number {
  if (!isValidPos(currPosition, grid)) return 0;
  // go down and see if it's a tachyon (^)
  const newPos: [number, number] = [currPosition[0] + 1, currPosition[1]];
  const positionStr = formPosString(newPos);
  if (isValidPos(newPos, grid) && !seenPositions.has(positionStr)) {
    seenPositions.add(positionStr);
    const val = grid[newPos[0]][newPos[1]];
    if (val === "^") {
      // split the beam
      return (
        1 +
        getNumberBeamSplits(
          [currPosition[0] + 1, currPosition[1] - 1],
          grid,
          seenPositions
        ) +
        getNumberBeamSplits(
          [currPosition[0] + 1, currPosition[1] + 1],
          grid,
          seenPositions
        )
      );
    } else {
      return getNumberBeamSplits(
        [currPosition[0] + 1, currPosition[1]],
        grid,
        seenPositions
      );
    }
  }
  return 0;
}

function getPart1() {
  const grid = readInput();
  const seen = new Set<string>();
  return getNumberBeamSplits([0, Math.floor(grid[0].length / 2)], grid, seen);
}

// part 2
function getNumberOfTimelines(
  position: [number, number],
  grid: string[][],
  memoGrid: (number | null)[][]
) {
  const memoVal = memoGrid[position[0]][position[1]];
  if (memoVal != null) {
    return memoVal;
  }
  if (!isValidPos(position, grid)) return 0;
  const newPos: [number, number] = [position[0] + 1, position[1]];
  if (isValidPos(newPos, grid)) {
    const val = grid[newPos[0]][newPos[1]];
    if (val === "^") {
      const leftTimelines = getNumberOfTimelines(
        [newPos[0], newPos[1] - 1],
        grid,
        memoGrid
      );
      const rightTimelines = getNumberOfTimelines(
        [newPos[0], newPos[1] + 1],
        grid,
        memoGrid
      );
      memoGrid[position[0]][position[1]] = leftTimelines + rightTimelines;
      return leftTimelines + rightTimelines;
    } else if (newPos[0] === grid.length - 1) {
      return 1;
    } else {
      const downTimeline = getNumberOfTimelines(newPos, grid, memoGrid);
      memoGrid[newPos[0]][newPos[1]] = downTimeline;
      return downTimeline;
    }
  }
  return 0;
}
function getPart2() {
  const grid = readInput();
  const memoGrid: (null | number)[][] = Array(grid.length)
    .fill(null)
    .map(() => Array(grid[0].length).fill(null));
  return getNumberOfTimelines(
    [0, Math.floor(grid[0].length / 2)],
    grid,
    memoGrid
  );
}

console.log("Part 1: ", getPart1());
console.log("Part 2: ", getPart2());
