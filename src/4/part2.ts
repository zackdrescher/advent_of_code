import { read_lines } from "../utils";
import { ScratchCardGame } from "./scratchcard";

let cards = ScratchCardGame.from_lines(read_lines("data/4/input.txt"));
console.log(cards);
console.log(cards.score());
