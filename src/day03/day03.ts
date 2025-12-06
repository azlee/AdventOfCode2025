import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day03/day03.txt", "utf8");
  const lines: string[] = input.split(/\n/);
  return lines;
}

function getOutputJoltage() {
  const input = readInput();
  let output = 0;
  for (const num of input) {
    let maxNum = 0;
    let maxIndex = 0;
    for (let i = 0; i < num.length - 1; i++) {
      const integer = Number.parseInt(num[i]);
      if (integer > maxNum) {
        maxIndex = i;
        maxNum = integer;
      }
    }
    // get the second integer
    let maxNum2 = 0;
    for (let j = maxIndex + 1; j < num.length; j++) {
      const integer = Number.parseInt(num[j]);
      if (integer > maxNum2) {
        maxIndex = j;
        maxNum2 = integer;
      }
    }
    const joltage = Number.parseInt(`${maxNum}${maxNum2}`);
    output += joltage;
  }
  return output;
}

function getBestBattery(bank: string, from: number, to: number) {
  let best = "";
  let position = 0;
  for (let index = from; index <= to; index++) {
    if (bank[index] > best) {
      best = bank[index];
      position = index;
    }
  }
  return { best, position };
}
function getOutputJoltage2() {
  const input = readInput();
  let output = 0;
  const numDigits = 12;
  for (const num of input) {
    const maxNums = new Array(numDigits).fill(0);
    let maxIndex = 0;
    let currDigit = 0;
    let startPos = 0;
    while (currDigit < numDigits) {
      const numDigitsLeft = numDigits - currDigit;
      const end = num.length - numDigitsLeft;
      const { best, position } = getBestBattery(num, startPos, end);
      maxNums[currDigit] = best;
      startPos = position + 1;
      currDigit++;
    }
    const joltage = Number.parseInt(maxNums.join(""));
    output += joltage;
  }
  return output;
}

console.log("Answer P1: ", getOutputJoltage());
console.log("Answer P2: ", getOutputJoltage2());
