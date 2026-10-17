// RC29.121 shopping baseline; exact route ordering is owned by RC29.122 regression.
const fs=require('fs'),assert=require('assert');
const day=fs.readFileSync('day.html','utf8');
assert(day.includes("'1':{title:"));assert(day.includes("'2':{title:"));assert(day.includes("'4':{title:"));
assert(!day.includes("'5':{title:"));
console.log('RC29.121 SHOPPING 1/2/4 + FREE DAY 5 (baseline): PASS');
