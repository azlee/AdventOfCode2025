import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day09/day09.txt", "utf8");
  const lines = input.split("\n");
  const coords: number[][] = [];
  for (const line of lines) {
    coords.push(line.split(",").map((l) => Number.parseInt(l)));
  }
  return coords;
}

function getLargestArea() {
  const coords = readInput();
  let largestArea = 0;
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[j];
      const area = (Math.abs(y2 - y1) + 1) * (Math.abs(x2 - x1) + 1);
      largestArea = Math.max(area, largestArea);
    }
  }
  return largestArea;
}
interface Grid {
  arr: Uint8Array;
  width: number;
  height: number;
}
function getIndex(grid: Grid, x: number, y: number) {
  const { arr, width, height } = grid;
  return arr[(y - 1) * width + (x - 1)];
}
const EMPTY_CELL = 0;
const RED_CELL = 1;
const GREEN_CELL = 2;
const PERIMETER_CELL = 3;
function setIndex(grid: Grid, x: number, y: number, value: number) {
  grid.arr[(y - 1) * grid.width + (x - 1)] = value;
}
function connectLine(grid: Grid, coord1: number[], coord2: number[]) {
  const [x1, y1] = coord1;
  const [x2, y2] = coord2;
  if (x1 === x2) {
    // same column
    for (let c = Math.min(y1, y2); c <= Math.max(y1, y2); c++) {
      if (getIndex(grid, x1, c) === RED_CELL) continue;
      setIndex(grid, x1, c, PERIMETER_CELL);
    }
  } else if (y1 === y2) {
    // same row
    for (let c = Math.min(x1, x2); c <= Math.max(x1, x2); c++) {
      if (getIndex(grid, c, y1) === RED_CELL) continue;
      setIndex(grid, c, y1, PERIMETER_CELL);
    }
  }
  return grid;
}
// Day 2
function getGrid() {
  const coords = readInput();
  let maxCols = 0;
  let maxRows = 0;
  let minCols = Number.MAX_SAFE_INTEGER;
  let minRows = Number.MAX_SAFE_INTEGER;
  for (const coord of coords) {
    const [x, y] = coord;
    maxCols = Math.max(maxCols, x);
    maxRows = Math.max(maxRows, y);
    minCols = Math.min(minCols, x);
    minRows = Math.min(minRows, y);
  }
  const arr: Uint8Array = new Uint8Array(maxRows * maxCols);
  const grid = { arr: arr, width: maxCols, height: maxRows };
  for (const coord of coords) {
    setIndex(grid, coord[0], coord[1], RED_CELL);
  }
  for (let i = 0; i < coords.length; i++) {
    let j = i + 1;
    if (j >= coords.length) {
      j = 0;
    }
    connectLine(grid, coords[i], coords[j]);
  }
  return { grid, coords };
}
function scanAndFillShape(grid: Grid) {
  for (let y = 1; y <= grid.height; y++) {
    let isIn = false;

    for (let x = 1; x <= grid.width; x++) {
      const val = getIndex(grid, x, y);

      const isPerimeter = val === PERIMETER_CELL || val === RED_CELL;

      if (isPerimeter) {
        const above =
          y > 1 &&
          [PERIMETER_CELL, RED_CELL].includes(getIndex(grid, x, y - 1));
        const below =
          y < grid.height &&
          [PERIMETER_CELL, RED_CELL].includes(getIndex(grid, x, y + 1));
        const left =
          x > 1 &&
          [PERIMETER_CELL, RED_CELL].includes(getIndex(grid, x - 1, y));

        // Toggle ONLY on vertical edges, once
        if ((above || below) && !left) {
          isIn = !isIn;
        }
        continue;
      }

      if (isIn && val === EMPTY_CELL) {
        setIndex(grid, x, y, GREEN_CELL);
      }
    }
  }

  return grid;
}

function isAllEnclosingRedOrGreen(
  grid: Grid,
  coord1: number[],
  coord2: number[]
) {
  const minX = Math.min(coord1[0], coord2[0]);
  const maxX = Math.max(coord1[0], coord2[0]);
  const minY = Math.min(coord1[1], coord2[1]);
  const maxY = Math.max(coord1[1], coord2[1]);
  // console.log("Checking area", (maxX - minX) * (maxY - minY));
  // top edge
  for (let i = minY; i <= maxY; i++) {
    if (getIndex(grid, maxX, i) === EMPTY_CELL) {
      return false;
    }
  }
  // bottom edge
  for (let i = minY; i <= maxY; i++) {
    if (getIndex(grid, minX, i) === EMPTY_CELL) {
      return false;
    }
  }
  // left edge
  for (let i = minX; i <= maxX; i++) {
    if (getIndex(grid, i, minY) === EMPTY_CELL) {
      return false;
    }
  }
  // right edge
  for (let i = minX; i <= maxX; i++) {
    if (getIndex(grid, i, maxY) === EMPTY_CELL) {
      return false;
    }
  }
  // for (let i = minY; i <= maxY; i++) {
  //   for (let j = minX; j <= maxX; j++) {
  //     if (getIndex(grid, j, i) === EMPTY_CELL) {
  //       return false;
  //     }
  //   }
  // }
  return true;
}
function getGreatestAreaPart2(grid: Grid, coords: number[][]) {
  let maxArea = 0;
  for (let i = 0; i < coords.length; i++) {
    console.log("progress x", i, coords.length - 1, coords[i]);
    for (let j = i + 1; j < coords.length; j++) {
      // console.log("progress y", j, coords.length - 1, coords[j]);
      if (isAllEnclosingRedOrGreen(grid, coords[i], coords[j])) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[j];
        const area = (Math.abs(y2 - y1) + 1) * (Math.abs(x2 - x1) + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }
  return maxArea;
}
const numToStr = {
  0: ".",
  1: "#",
  2: "X",
  3: "P",
};
function printGrid(grid: Grid) {
  for (let y = 1; y <= grid.height; y++) {
    let row = "";
    for (let x = 1; x <= grid.width; x++) {
      row += numToStr[getIndex(grid, x, y)];
    }
    console.log(row);
  }
}
function getPart2() {
  const { grid, coords } = getGrid();
  console.log("permieter");
  // printGrid(grid);
  console.log("scanned grid");
  const filledInGrid = scanAndFillShape(grid);
  console.log("completed fill in grid");
  // console.log(printGrid(filledInGrid));
  return getGreatestAreaPart2(filledInGrid, coords);
  // scan and fill in the coordinates within the perimeter
}
console.log("Part 1: ", getLargestArea());
console.log("Part 2: ", getPart2());
