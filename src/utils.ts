import * as fs from "fs";

export function read_lines(path: string): string[] {
  return fs.readFileSync(path, "utf-8").split("\n");
}
