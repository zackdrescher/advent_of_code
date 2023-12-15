import * as fs from 'fs';

import { CubeGame } from './game';

function read_games(path: string): CubeGame[] {
    const data = fs.readFileSync(path, 'utf-8').split('\n');
    return data.map(s => new CubeGame(s));
}

const bag_config = { red: 12, green: 13, blue: 14 };
const games = read_games('data/2/input.txt');
console.log(games.filter(g => g.validate(bag_config)).reduce((a, b) => a + b.id, 0));