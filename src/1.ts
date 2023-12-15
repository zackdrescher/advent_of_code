import * as fs from 'fs';

const data = fs.readFileSync('data/1.txt', 'utf-8');
const lines = data.split('\n');


const digits = lines.map((line) => {
    let d = line.replace(/[^0-9]/g, '')
    return parseInt(d[0] + d.slice(-1));
});

console.log(digits.reduce((a, b) => a + b, 0));