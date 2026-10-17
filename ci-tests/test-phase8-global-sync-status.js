'use strict';
const assert=require('assert');const fs=require('fs');const path=require('path');
const base=path.join(__dirname,'..');
const ui=fs.readFileSync(path.join(base,'booking-sync-status-ui.js'),'utf8');
assert.match(ui,/getStatus\(\)/);assert.match(ui,/Object\.entries\(s\.pending/);
assert.match(ui,/entry\.operation==='delete'/);assert.match(ui,/api\.retry\(id\)/);
assert.match(ui,/travelengine:bookingsyncstatus/);assert.match(ui,/root\.addEventListener\('storage'/);
assert.match(ui,/if\(!entries\.length\)/);assert.doesNotMatch(ui,/Synced to cloud/);
let n=0;for(const file of fs.readdirSync(base).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(path.join(base,file),'utf8');
 if(html.includes('booking-sync-runtime.js')){assert(html.includes('booking-sync-status-ui.js'),file+' lacks global status');n++;}
}
assert(n>0);assert(fs.readFileSync(path.join(base,'sw.js'),'utf8').includes("'./booking-sync-status-ui.js'"));
console.log(`PHASE 8 GLOBAL BOOKING SYNC STATUS CONTRACT PASS (${n} HTML pages)`);
