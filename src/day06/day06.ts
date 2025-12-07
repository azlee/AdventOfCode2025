import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day06/day06.txt", "utf8");
  const lines: string[] = input.split(/\n/);
  const grid: string[][] = [];
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j].split(/\s+/);
    const row = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "") continue;
      row.push(line[i]);
    }
    grid.push(row);
  }
  return grid;
}

function getAnswer(colNum: number, grid: string[][]) {
  const operator = grid[grid.length - 1][colNum];
  let num = operator === "+" ? 0 : 1;
  for (let i = 0; i < grid.length - 1; i++) {
    if (operator === "+") {
      num += Number.parseInt(grid[i][colNum]);
    } else {
      num *= Number.parseInt(grid[i][colNum]);
    }
  }
  return num;
}
function getGrandTotal() {
  const grid = readInput();
  let total = 0;
  for (let col = 0; col < grid[0].length; col++) {
    const answer = getAnswer(col, grid);
    total += answer;
  }
  return total;
}
function getLengthOfLongest(colNum: number, grid: string[][]) {
  let longest = 0;
  let index = 0;
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    const num = row[colNum];
    if (num.length > longest) {
      longest = num.length;
      index = i;
    }
  }
  return { longest, index };
}
function getNumberToOperate(
  colNum: number,
  grid: string[][],
  digitPlace: number
) {
  let numSoFar = "";
  for (const row of grid) {
    const num = row[colNum];
    if (digitPlace < num.length && num[digitPlace] !== "x") {
      numSoFar += num[digitPlace];
    }
  }
  return Number.parseInt(numSoFar);
}

// part 2
function getGrid() {
  const input = fs.readFileSync("src/day06/day06.txt", "utf8");
  const lines: string[] = input.split(/\n/);
  const grid: string[][] = [];
  const splitPattern = /(?=\+)|(?=\*)/;
  const operators = lines[lines.length - 1].split(splitPattern);
  let currIndex = 0;
  const operatorIndexes = [];
  for (let operator of operators) {
    operatorIndexes.push(currIndex);
    currIndex += operator.length;
  }
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const row = [];
    for (let j = 0; j < line.length; j++) {
      row.push(line[j]);
    }
    grid.push(row);
  }
  return { operators, grid, operatorIndexes };
}

function getNum(colNum: number, grid: string[][]) {
  let num = "";
  for (const row of grid) {
    if (row[colNum] !== " ") {
      num += row[colNum];
    }
  }
  return num;
}
function getCephalopodNum(
  operatorNum: number,
  grid: string[][],
  operators: string[],
  operatorIndexes: number[]
) {
  const operator = operators[operatorNum];
  let totalNum = operator.includes("+") ? 0 : 1;
  const nextOperatorIndex =
    operatorNum + 1 < operators.length
      ? operatorIndexes[operatorNum + 1]
      : grid[0].length;
  for (let i = nextOperatorIndex - 1; i >= operatorIndexes[operatorNum]; i--) {
    const num = getNum(i, grid);
    if (num !== "") {
      if (operator.includes("+")) {
        totalNum += Number.parseInt(num);
      } else {
        totalNum *= Number.parseInt(num);
      }
    }
  }
  return totalNum;
}
function getGrandTotal2() {
  const { operators, grid, operatorIndexes } = getGrid();
  let total = 0;
  for (let j = 0; j < operators.length; j++) {
    const cephalopodNum = getCephalopodNum(j, grid, operators, operatorIndexes);
    total += cephalopodNum;
  }
  return total;
}

console.log("Part 1: ", getGrandTotal());
console.log("Part 2: ", getGrandTotal2());
