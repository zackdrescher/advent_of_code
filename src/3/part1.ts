import { read_lines } from "../utils";
import { Schematic, is_symbol } from "./schematic";

let schematic = read_lines("data/3/input.txt");

let s = new Schematic(schematic);
let words = s.get_words();

let parts = words.filter((w) => {
  let adjacent = w.get_adjacent();
  for (let p of adjacent) {
    if (is_symbol(s.get_postion(p))) {
      // console.log(w, p, s.get_postion(p));
      return true;
    }
  }
  return false;
});

console.log(parts.map((p) => parseInt(p.content)).reduce((a, b) => a + b, 0));
