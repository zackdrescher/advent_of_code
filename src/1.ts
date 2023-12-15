import * as fs from 'fs';
import { parse } from 'path';
import { resourceUsage } from 'process';

const data = fs.readFileSync('data/1.txt', 'utf-8');
const lines = data.split('\n');

type Word2Num = { [id: string]: number; };
const word_2_num: Word2Num = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
}


function find_first_digit(input: string): number {

    let start = 0;
    for (let end = 1; end <= input.length; end++) {
        let word = input.slice(start, end);
        let d = parseInt(word);
        if (!isNaN(d)) {
            return d;
        } else if (word in word_2_num) {
            return word_2_num[word];
        } else if (Object.keys(word_2_num).filter((key) => key.startsWith(word)).length > 0) {
            continue;
        } else if (word.length > 1) {
            start = start + 1; // push the start back a char
            end = start; // reset the end to the next char
        } else {
            start = end;
        }
    }
    return NaN;
}

function find_last_digit(input: string): number {

    let end = input.length;
    for (let start = end - 1; start >= 0; start--) {
        let word = input.slice(start, end);
        let d = parseInt(word);
        if (!isNaN(d)) {
            return d;
        } else if (word in word_2_num) {
            return word_2_num[word];
        } else if (Object.keys(word_2_num).filter((key) => key.endsWith(word)).length > 0) {
            continue;
        } else if (word.length > 1) {
            end = end - 1; // push the start back a char
            start = end; // reset the end to the next char
        } else {
            end = start;
        }
    }
    return NaN;
}

const digits = lines.map((line) => {
    let first = find_first_digit(line);
    let last = find_last_digit(line);

    return first * 10 + last;
});
console.log(digits.map((d, i) => [d, lines[i]]));

console.log(digits.reduce((a, b) => a + b, 0));