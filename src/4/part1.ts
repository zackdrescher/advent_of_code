import { read_lines } from "../utils";
import { ScratchCard } from "./scratchcard";

let cards = read_lines("data/4/input.txt").map((s) =>
  ScratchCard.from_string(s)
);
console.log(cards);
console.log(cards.map((c) => c.score()).reduce((a, b) => a + b, 0));
