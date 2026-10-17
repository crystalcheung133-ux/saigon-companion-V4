const fs=require('fs'),assert=require('assert');
const day=fs.readFileSync('day.html','utf8'),data=fs.readFileSync('data.js','utf8');
const order=['11 Garmentory','AASTU','RUBIES Studio','Dalla Saigon','Lane Cì','Mì Workshop','Mozaic Space · OPTIONAL'];
let last=-1;for(const x of order){const i=day.indexOf(x);assert(i>last,`Day 2 route order wrong at ${x}`);last=i;}
assert(day.includes('ChIJBzF4_bgvdTERVhe6FULA9Z8'),'Mozaic exact Google Place ID missing');
assert(day.includes('destination_place_id'),'point-to-point maps must support exact Place IDs');
assert(day.includes('111 Concept Store · OPTIONAL'),'Day 1 optional 111 must remain on Shopping Route Map');
assert(data.includes('Mì Workshop → Mozaic Space 約 5–7 min'),'Day 2 itinerary still has stale Mozaic transfer');
console.log('RC29.121 SHOPPING ROUTE: PASS');
