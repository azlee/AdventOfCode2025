import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day01/day01input.txt", "utf8");
  const lines: string[] = input.split(/\n/);
  return lines;
}

function getPassword() {
  const instructions = readInput();
  let numZeros = 0;
  let currentPos = 50;
  for (const instruction of instructions) {
    const dir = instruction.substring(0, 1);
    const distance = Number.parseInt(instruction.substring(1));
    currentPos = (currentPos + (dir === "L" ? -1 : 1) * distance) % 100;
    if (currentPos === 0) numZeros++;
  }
  return numZeros;
}
function getPasswordPart2() {
  const instructions = readInput();
  let numZeros = 0;
  let currentPos = 50;
  for (const instruction of instructions) {
    const dir = instruction.substring(0, 1);
    const distance = Number.parseInt(instruction.substring(1));
    for (let i = 0; i < distance; i++) {
      currentPos = (currentPos + (dir === "L" ? -1 : 1)) % 100;
      if (currentPos === 0) numZeros++;
    }
  }
  return numZeros;
}

console.log("Answer P1: ", getPassword());
console.log("Answer P2: ", getPasswordPart2());
