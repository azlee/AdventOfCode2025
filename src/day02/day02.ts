import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day02/day02.txt", "utf8");
  const lines: string[] = input.split(",");
  return lines;
}

function getInvalidIds() {
  const ranges = readInput();
  const invalidNums = [];
  let invalidNumsSum = 0;
  for (const range of ranges) {
    const [lowRange, highRange] = range.split("-");
    for (let i = Number(lowRange); i <= Number(highRange); i++) {
      const num = String(i);
      if (num.length % 2 !== 0) continue;
      for (let j = 1; j <= num.length / 2; j++) {
        const sequence = num.substring(0, j);
        if (sequence + sequence === num) {
          invalidNums.push(num);
          invalidNumsSum += i;
        }
      }
    }
  }
  return invalidNumsSum;
}
function getInvalidIdsPart2() {
  const ranges = readInput();
  const invalidNums = [];
  let invalidNumsSum = 0;
  for (const range of ranges) {
    const [lowRange, highRange] = range.split("-");
    for (let i = Number(lowRange); i <= Number(highRange); i++) {
      const num = String(i);
      let breakOutOfSequenceCheck = false;
      for (let j = num.length; j >= 1; j--) {
        const sequence = num.substring(0, j);
        if (breakOutOfSequenceCheck) break;
        for (let k = 2; k * j <= num.length; k++) {
          if (sequence.repeat(k) === num) {
            invalidNums.push(num);
            invalidNumsSum += i;
            breakOutOfSequenceCheck = true;
            break;
          }
        }
      }
    }
  }
  return invalidNumsSum;
}

console.log("Answer P1: ", getInvalidIds());
console.log("Answer P2: ", getInvalidIdsPart2());
