import * as fs from "fs";

interface Node {
  from: string;
  to: string[];
}

function readInput(): Node[] {
  const input = fs.readFileSync("src/day11/day11.txt", "utf8").trim();
  const nodes: Node[] = [];
  for (const line of input.split("\n")) {
    const spl = line.split(": ");
    nodes.push({
      from: spl[0],
      to: spl[1].split(" "),
    });
  }
  return nodes;
}

function createPathKey(path: string[]) {
  return path.join("-");
}

function bfsSearch(nodeMap: Map<string, string[]>) {
  const seen: Set<string> = new Set();
  const queue = ["you"];
  let numPaths = 0;
  while (queue.length > 0) {
    const path = queue.shift().split("-");
    const last = path[path.length - 1];
    if (last === "out") {
      numPaths++;
    } else {
      const tos = nodeMap.get(last);
      for (const newPos of tos) {
        const pathKey = path + "-" + newPos;
        if (!seen.has(pathKey)) {
          seen.add(pathKey);
          queue.push(pathKey);
        }
      }
    }
  }
  return numPaths;
}

function part1() {
  const nodes = readInput();
  const nodeMap = new Map();
  for (const node of nodes) {
    nodeMap.set(node.from, node.to);
  }
  return bfsSearch(nodeMap);
}
const memo = new Map<string, number>();
function dfs(
  node: string,
  dac: boolean,
  fft: boolean,
  nodeMap: Map<string, string[]>
): number {
  const key = `${node}-${dac ? 1 : 0}-${fft ? 1 : 0}`;
  if (memo.has(key)) return memo.get(key)!;
  if (node === "out" && fft && dac) {
    return 1;
  }
  if (node === "dac") {
    dac = true;
  }
  if (node === "fft") {
    fft = true;
  }
  let total = 0;
  for (const neighbor of nodeMap.get(node) || []) {
    total += dfs(neighbor, dac, fft, nodeMap);
  }
  memo.set(key, total);
  return total;
}
function part2() {
  const nodes = readInput();
  const nodeMap = new Map();
  for (const node of nodes) {
    nodeMap.set(node.from, node.to);
  }
  return dfs("svr", false, false, nodeMap);
}

console.log("Part 1: ", part1());
console.log("Part 2: ", part2());
