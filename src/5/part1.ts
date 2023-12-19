import fs from "fs";

import { parse_seeds, Almanac } from "./almanac";

let path = "data/5/input.txt";
let data = fs.readFileSync(path, "utf-8");
let seeds = parse_seeds(data);
let a = Almanac.from_string(data);

console.log(seeds);
console.log(Math.min(...seeds.map((s) => a.map(s).pop()!)));
