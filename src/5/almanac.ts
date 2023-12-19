import * as fs from "fs";

import { read_lines } from "../utils";

const seed_pattern = /seeds: ((?:\d+\s)+)/;
const map_pattern = /(\w+)-to-(\w+) map:\s((?:\d+\s?)+)/g;

function parse_seeds(s: string): number[] {
  return s.match(seed_pattern)![1].split(" ").map(Number);
}

class Range {
  destination: number;
  source: number;
  length: number;
  constructor(destination: number, source: number, length: number) {
    this.destination = destination;
    this.source = source;
    this.length = length;
  }

  contains(n: number): boolean {
    return this.source <= n && n < this.source + this.length;
  }

  map(n: number): number {
    return this.contains(n) ? this.destination + (n - this.source) : -1;
  }
}

class Map {
  from: string;
  to: string;
  ranges: Range[];

  static parse_ranges(s: string): Range[] {
    return s.split("\n").map((line) => {
      let [destination, source, length] = line.split(" ").map(Number);
      return new Range(destination, source, length);
    });
  }

  static from_match(match: RegExpMatchArray): Map {
    let [_, from, to, values] = match;
    return new Map(from, to, Map.parse_ranges(values));
  }

  constructor(from: string, to: string, ranges: Range[]) {
    this.from = from;
    this.to = to;
    this.ranges = ranges;
  }

  toString(): string {
    return `${this.from} -> ${this.to}`;
  }

  map(n: number): number {
    let results = this.ranges
      .map((range) => range.map(n))
      .filter((n) => n >= 0);
    if (results.length > 1) {
      throw new Error(`Ambiguous mapping for ${n} in ${this}`);
    }
    let result = results[0];
    return result >= 0 ? result : n;
  }
}

class Almanac {
  maps: Map[];

  constructor(maps: Map[]) {
    this.maps = maps;
  }

  map(n: number): number[] {
    let result = n;
    let results = [];
    for (let map of this.maps) {
      result = map.map(result);
      results.push(result);
    }
    return results;
  }
}

let path = "data/5/example.txt";
let data = fs.readFileSync(path, "utf-8");
let seeds = parse_seeds(data);

let matches = data.matchAll(map_pattern);

let a = new Almanac(Array.from(matches).map(Map.from_match));

// console.log(a);
// console.log(a.map(79));

console.log(seeds);
console.log(seeds.map((s) => a.map(s).pop()!));
