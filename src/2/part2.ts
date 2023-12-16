import { CubeGame, read_games } from "./game";

const bag_config = { red: 12, green: 13, blue: 14 };
const games = read_games("data/2/input.txt");
console.log(games.map((g) => g.power()).reduce((a, b) => a + b, 0));
