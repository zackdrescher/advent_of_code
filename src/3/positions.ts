import { get } from "http";
import { read_lines } from "../utils";

let schematic = read_lines('data/3/example.txt');

const range = (from: number, to: number, step: number = 1): number[] =>
    [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);

class Position {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x; this.y = y;
    }

    get_adjacent(): Position[] {
        return [
            new Position(this.x + 1, this.y),
            new Position(this.x - 1, this.y),
            new Position(this.x, this.y + 1),
            new Position(this.x, this.y - 1),
            new Position(this.x + 1, this.y + 1),
            new Position(this.x - 1, this.y - 1),
            new Position(this.x + 1, this.y - 1),
            new Position(this.x - 1, this.y + 1),
        ]
    }
}

class Word {
    content: string;
    x1: number;
    x2: number;
    y: number;
    constructor(content: string, x1: number, x2: number, y: number) {
        this.content = content;
        this.x1 = x1;
        this.x2 = x2;
        this.y = y;
    }

    get_adjacent(): Position[] {

        let positions = []
        for (let i of range(this.x1 - 1, this.x2 + 1)) {
            positions.push(new Position(i, this.y - 1));
            positions.push(new Position(i, this.y + 1));
        }
        return [
            ...positions,
            new Position(this.x1 - 1, this.y),
            new Position(this.x2 + 1, this.y),
        ]
    }
}

function is_symbol(s: string): boolean {
    return !parseInt(s) && s != '.' && s != '';
}

function get_symbol_positions(schematic: string[]): Position[] {

    let postions = []
    for (let i = 0; i < schematic.length; i++) {
        for (let j = 0; j < schematic[i].length; j++) {
            let token = schematic[i][j];
            if (is_symbol(token)) {
                postions.push(new Position(j, i));
            }
        }
    }
    return postions;
}

class Schematic {
    content: string[];
    hieght: number;
    width: number;
    constructor(content: string[]) {
        this.content = content;
        this.hieght = content.length;
        this.width = content[0].length;
    }

    get_symbol_positions(): Position[] {
        return get_symbol_positions(this.content);
    }

    get_postion(position: Position): string {
        return this.is_in_bounds(position) ? this.content[position.y][position.x] : '';
    }

    is_in_bounds(position: Position): boolean {
        return position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.hieght;
    }

    get_words() {
        return this.content.map((line, y) => {
            return Array.from(line.matchAll(/\d+/g)).map(m => {
                return new Word(m[0], m.index!, m.index! + m[0].length - 1, y)
            })
        }).flat();
    }
}


let s = new Schematic(schematic);
let words = s.get_words();

let parts = words.filter(w => {
    let adjacent = w.get_adjacent();
    for (let p of adjacent) {
        if (is_symbol(s.get_postion(p))) {
            // console.log(w, p, s.get_postion(p));
            return true;
        }
    }
    return false;
})

console.log(parts.map(p => parseInt(p.content)).reduce((a, b) => a + b, 0));