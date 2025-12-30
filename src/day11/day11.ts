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

function bfsSearch(nodes: Node[], nodeMap: Map<string, string[]>) {
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
  return bfsSearch(nodes, nodeMap);
}

console.log("Part 1: ", part1());
