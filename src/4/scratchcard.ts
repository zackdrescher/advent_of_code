import { range } from "../utils";

const id_pattern = /Card +(\d+):/;

export class ScratchCard {
  id: number;
  winning_numbers: number[];
  player_numbers: number[];
  constructor(id: number, winning_numbers: number[], player_numbers: number[]) {
    this.id = id;
    this.winning_numbers = winning_numbers;
    this.player_numbers = player_numbers;
  }

  static from_string(s: string): ScratchCard {
    let match = id_pattern.exec(s);
    let id = parseInt(match![1]);

    let numbers = s
      .substring(match![0].length)
      .split("|")
      .map((s) =>
        s
          .trim()
          .split(" ")
          .map((s) => parseInt(s))
          .filter((n) => !isNaN(n))
      );

    return new ScratchCard(id, numbers[0], numbers[1]);
  }

  matches(): number {
    return this.player_numbers.filter((n) => this.winning_numbers.includes(n))
      .length;
  }

  score(): number {
    let hits = this.matches();
    return hits > 0 ? 2 ** (hits - 1) : 0;
  }
}

export class ScratchCardGame {
  original_cards: ScratchCard[];
  constructor(cards: ScratchCard[]) {
    this.original_cards = cards;
  }

  static from_lines(lines: string[]): ScratchCardGame {
    return new ScratchCardGame(lines.map((s) => ScratchCard.from_string(s)));
  }

  score(): number {
    let copied_cards: ScratchCard[] = [];
    let card_copies: { [id: number]: number } = {};
    this.original_cards.forEach((c) => {
      let matches = c.matches();
      if (c.id in card_copies) {
        card_copies[c.id] += 1;
      } else {
        card_copies[c.id] = 1;
      }
      console.log(matches, range(c.id + 1, c.id + 1 + matches));
      range(c.id + 1, c.id + matches).forEach((i) => {
        if (i in card_copies) {
          card_copies[i] += card_copies[c.id];
        } else if (i <= this.original_cards.length) {
          card_copies[i] = card_copies[c.id];
        }
      });
    });
    console.log(card_copies);

    return Object.values(card_copies).reduce((a, b) => a + b, 0);
  }

  process_card(card: ScratchCard): ScratchCard[] {
    let matches = card.matches();
    // note that this is techinally card id + 1 but then back bc 0 index
    return this.original_cards.slice(card.id, card.id + matches);
  }

  process_batch(cards: ScratchCard[]): ScratchCard[] {
    return cards.flatMap((c) => this.process_card(c));
  }
}
