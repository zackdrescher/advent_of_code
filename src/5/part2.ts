import fs from "fs";

import { parse_seeds, Almanac, Range } from "./almanac";

let path = "data/5/example.txt";
let data = fs.readFileSync(path, "utf-8");
let seeds = parse_seeds(data);
let a = Almanac.from_string(data);

let new_seeds = [];
for (let i = 0; i < seeds.length; i += 2) {
  let [from, to] = seeds.slice(i, i + 2);
  new_seeds.push(new Range(from, to));
}

console.log(new_seeds);
let i = 1;
let seed = new_seeds[0];
let rm = a.maps[0].ranges[i];
console.log(rm);
console.log(seed.split_accross(rm));
console.log(rm.map_range(seed));

// console.log(new_seeds.flat().length);
// console.log(Math.min(...new_seeds.flat().map((s) => a.map(s).pop()!)));
