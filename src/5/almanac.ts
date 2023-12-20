const seed_pattern = /seeds: ((?:\d+\s)+)/;
const map_pattern = /(\w+)-to-(\w+) map:\s((?:\d+\s?)+)/g;

export function parse_seeds(s: string): number[] {
  return s.match(seed_pattern)![1].split(" ").map(Number);
}

export class Range {
  start: number;
  length: number;
  static from_start_end(start: number, end: number): Range {
    return new Range(start, end - start + 1);
  }
  constructor(start: number, length: number) {
    this.start = start;
    this.length = length;
  }

  get end(): number {
    return this.start + this.length - 1;
  }

  contains_value(n: number): boolean {
    return this.start <= n && n < this.end;
  }

  lt(range: Range): boolean {
    return this.start < range.start;
  }

  gt(range: Range): boolean {
    return this.end > range.end;
  }

  met(range: Range): boolean {
    return this.end + 1 === range.start;
  }

  meti(range: Range): boolean {
    return this.start === range.end + 1;
  }

  overlaps(range: Range): boolean {
    return this.contains_value(range.start) || this.contains_value(range.end);
  }

  during(range: Range): boolean {
    return range.contains_value(this.start) && range.contains_value(this.end);
  }

  contains(range: Range): boolean {
    return this.contains_value(range.start) && this.contains_value(range.end);
  }

  starts(range: Range): boolean {
    return this.start === range.start;
  }

  ends(range: Range): boolean {
    return this.end === range.end;
  }

  split_accross(range: Range): Range[] {
    if (!this.overlaps(range || this.contains(range))) {
      return [this];
    }
    if (this.contains(range)) {
      return [
        Range.from_start_end(this.start, range.start - 1),
        range,
        Range.from_start_end(range.end + 1, this.end),
      ];
    }
    if (this.lt(range)) {
      return [
        Range.from_start_end(this.start, range.start - 1),
        Range.from_start_end(range.start, this.end),
      ];
    } else {
      return [
        Range.from_start_end(this.start, range.end),
        Range.from_start_end(range.end + 1, this.end),
      ];
    }
  }
}

class RangeMap extends Range {
  destination: number;
  constructor(destination: number, source: number, length: number) {
    super(source, length);
    this.destination = destination;
  }

  get destination_range(): Range {
    return new Range(this.destination, this.length);
  }

  map(n: number): number {
    return this.contains_value(n) ? this.destination + (n - this.start) : -1;
  }

  map_range(range: Range): Range[] {
    let splits = range.split_accross(this);
    return splits
      .flatMap((range) =>
        Range.from_start_end(this.map(range.start), this.map(range.end))
      )
      .sort((a, b) => (a.lt(b) ? -1 : 1));
  }
}

class Map {
  from: string;
  to: string;
  ranges: RangeMap[];

  static parse_ranges(s: string): RangeMap[] {
    return s.split("\n").map((line) => {
      let [destination, source, length] = line.split(" ").map(Number);
      return new RangeMap(destination, source, length);
    });
  }

  static from_match(match: RegExpMatchArray): Map {
    let [_, from, to, values] = match;
    return new Map(from, to, Map.parse_ranges(values));
  }

  constructor(from: string, to: string, ranges: RangeMap[]) {
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

export class Almanac {
  maps: Map[];

  static from_string(s: string): Almanac {
    let matches = s.matchAll(map_pattern);
    return new Almanac(Array.from(matches).map(Map.from_match));
  }

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
