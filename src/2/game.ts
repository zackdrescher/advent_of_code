import * as fs from "fs";

const id_pattern = /Game (\d+):/;

export function read_games(path: string): CubeGame[] {
  const data = fs.readFileSync(path, "utf-8").split("\n");
  return data.map((s) => new CubeGame(s));
}

type ColorCount = { [color: string]: number };

function parse_game(game_string: string) {
  let match = id_pattern.exec(game_string);
  let games = game_string
    .substring(match![0].length)
    .split(";")
    .map((s) => {
      return Object.fromEntries(
        s.split(",").map((s) => {
          let data = s.trim().split(" ");
          return [data[1], parseInt(data[0])];
        })
      );
    });
  return { id: parseInt(match![1]), rounds: games };
}

export class CubeGame {
  game_string: string;
  id: number;
  rounds: ColorCount[];

  constructor(game_string: string) {
    this.game_string = game_string;
    let { id, rounds } = parse_game(game_string);
    this.id = id;
    this.rounds = rounds;
  }

  validate(bag_config: ColorCount): boolean {
    for (let round of this.rounds) {
      for (let color in round) {
        if (!(color in bag_config) || round[color] > bag_config[color]) {
          return false;
        }
      }
    }
    return true;
  }

  minimum_game(): ColorCount {
    let minimum: ColorCount = {};
    for (let round of this.rounds) {
      for (let color in round) {
        if (!(color in minimum) || round[color] > minimum[color]) {
          minimum[color] = round[color];
        }
      }
    }
    return minimum;
  }

  power(): number {
    return Object.values(this.minimum_game()).reduce((a, b) => a * b, 1);
  }
}
