import * as fs from "fs";

export function read_lines(path: string): string[] {
  return fs.readFileSync(path, "utf-8").split("\n");
}

export const range = (from: number, to: number, step: number = 1): number[] =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);
