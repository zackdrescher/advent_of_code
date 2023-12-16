
import { read_lines } from "../utils";
import { Schematic, is_symbol } from "./schematic";

let schematic = read_lines('data/3/inputd.txt');

let s = new Schematic(schematic);
let gears = s.get_gear_positions();
let words = s.get_words();

console.log(
    gears.map(g => {
        return words.filter(w => w.is_adjacent(g))
    }).filter(w => w.length == 2).map(w => {
        return parseInt(w[0].content) * parseInt(w[1].content)
    }).reduce((a, b) => a + b, 0)
)