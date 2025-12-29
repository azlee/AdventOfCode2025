import * as fs from "fs";

interface LightInstruction {
  target: number;
  buttons: number[];
  numLights: number;
}

function readInput(): LightInstruction[] {
  const input = fs.readFileSync("src/day10/day10.txt", "utf8").trim();
  const lines = input.split("\n");
  const output: LightInstruction[] = [];

  for (const line of lines) {
    const parts = line.split(" ");
    // parse light diagram
    const diagram = parts[0];
    const numLights = diagram.length - 2;
    let target = 0;
    for (let i = 1; i <= numLights; i++) {
      if (diagram[i] === "#") {
        target |= 1 << (i - 1);
      }
    }
    // parse buttons
    const buttons: number[] = [];
    for (const part of parts) {
      if (!part.startsWith("(")) continue;
      const indices = part.slice(1, -1).split(",");
      let mask = 0;
      for (const idx of indices) {
        mask |= 1 << Number(idx);
      }
      buttons.push(mask);
    }

    output.push({ target, buttons, numLights });
  }

  return output;
}

function getFewestButtonPresses(instruction: LightInstruction): number {
  const { target, buttons } = instruction;
  const start = 0;
  const queue: [number, number][] = [[start, 0]];
  const visited = new Set<number>([start]);
  while (queue.length > 0) {
    const [state, steps] = queue.shift();
    if (state === target) return steps;
    for (const button of buttons) {
      const next = state ^ button; // xor
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([next, steps + 1]);
      }
    }
  }
  return Infinity;
}

function part1() {
  const input = readInput();
  let sum = 0;
  for (let instruction of input) {
    const presses = getFewestButtonPresses(instruction);
    sum += presses;
  }
  return sum;
}

console.log("Part 1: ", part1());
