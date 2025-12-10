import { randomUUID } from "crypto";
import * as fs from "fs";

function readInput() {
  const input = fs.readFileSync("src/day08/day08.txt", "utf8");
  const lines = input.split("\n");
  const coords: number[][] = [];
  for (const line of lines) {
    coords.push(line.split(",").map((l) => Number.parseInt(l)));
  }
  return coords;
}

function getDistance(pos1: number[], pos2: number[]) {
  const [p1, p2, p3] = pos1;
  const [q1, q2, q3] = pos2;
  return Math.sqrt(
    Math.pow(p1 - q1, 2) + Math.pow(p2 - q2, 2) + Math.pow(p3 - q3, 2)
  );
}

type DistanceKey = {
  distance: number;
  pos1: number; // this is the position in positions of the first point
  pos2: number; // this is the position in positions of the second point
};
function getSortedDistances(positions: number[][]) {
  const distances: DistanceKey[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const distance = getDistance(positions[i], positions[j]);
      distances.push({ distance, pos1: i, pos2: j });
    }
  }
  return distances.sort((d, d1) => d.distance - d1.distance);
}
// this will return a map where the key is an id for the circuit
// and the value is all the indexes in position that are in the same circuit
function getCircuits(
  sortedDistances: DistanceKey[],
  numPairs: number
): Map<string, number[]> {
  const posToCircuit: Map<number, string> = new Map();
  const circuitMap: Map<string, number[]> = new Map();
  for (let i = 0; i < numPairs; i++) {
    const { distance, pos1, pos2 } = sortedDistances[i];
    const pos1Circuit = posToCircuit.get(pos1);
    const pos2Circuit = posToCircuit.get(pos2);
    const circuitsInPos1 = pos1Circuit ? [...circuitMap.get(pos1Circuit)] : [];
    const circuitsInPos2 = pos2Circuit ? [...circuitMap.get(pos2Circuit)] : [];
    if (!pos1Circuit && !pos2Circuit) {
      const newCircuitKey = randomUUID();
      posToCircuit.set(pos1, newCircuitKey);
      posToCircuit.set(pos2, newCircuitKey);
      circuitMap.set(newCircuitKey, [pos1, pos2]);
    } else if (pos1Circuit && !pos2Circuit) {
      posToCircuit.set(pos2, pos1Circuit);
      circuitMap.set(pos1Circuit, [...circuitsInPos1, pos2]);
    } else if (pos2Circuit && !pos1Circuit) {
      posToCircuit.set(pos1, pos2Circuit);
      circuitMap.set(pos2Circuit, [...circuitsInPos2, pos1]);
    } else if (pos1Circuit === pos2Circuit) {
      // do nothing since they're in a circuit already
      continue;
    } else if (pos1Circuit && pos2Circuit) {
      // merge the circuits to pos1
      for (const circuit of circuitsInPos2) {
        posToCircuit.set(circuit, pos1Circuit);
      }
      circuitMap.set(pos1Circuit, [...circuitsInPos1, ...circuitsInPos2]);
      circuitMap.delete(pos2Circuit);
    }
  }
  return circuitMap;
}
function getPart1(numPairs: number) {
  const input = readInput();
  const distances = getSortedDistances(input);
  const circuits = getCircuits(distances, numPairs);
  const sortedCircuts = Array.from(circuits).sort(
    (a, a2) => a2[1].length - a[1].length
  );
  // get the 3 largest circuit sizes and multiply
  return (
    sortedCircuts[0][1].length *
    sortedCircuts[1][1].length *
    sortedCircuts[2][1].length
  );
}

console.log("Part 1: ", getPart1(1000));
