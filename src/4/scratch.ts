import { read_lines } from "../utils";

const id_pattern = /Card +(\d+):/;

class ScratchCard {
  content: string;
  id: number;
  winning_numbers: number[];
  player_numbers: number[];
  constructor(content: string) {
    this.content = content;

    let match = id_pattern.exec(content);
    this.id = parseInt(match![1]);
    let numbers = content
      .substring(match![0].length)
      .split("|")
      .map((s) =>
        s
          .trim()
          .split(" ")
          .map((s) => parseInt(s))
          .filter((n) => !isNaN(n))
      );
    this.winning_numbers = numbers[0];
    this.player_numbers = numbers[1];
  }

  score(): number {
    let hits = this.player_numbers.filter((n) =>
      this.winning_numbers.includes(n)
    ).length;
    return hits > 0 ? 2 ** (hits - 1) : 0;
  }
}

let cards = read_lines("data/4/input.txt").map((s) => new ScratchCard(s));
console.log(cards);
console.log(cards.map((c) => c.score()).reduce((a, b) => a + b, 0));
