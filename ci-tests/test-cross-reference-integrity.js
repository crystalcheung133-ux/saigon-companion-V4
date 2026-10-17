const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('data.js','utf8');
const sandbox={console,globalThis:null}; sandbox.globalThis=sandbox; vm.createContext(sandbox); vm.runInContext(code,sandbox);
const {PLACES,DAY_LINKS,BOOKINGS_DATA,ITINERARY_DATA}=sandbox.TRAVEL_DATASETS;
const errors=[];
const dayItems={}; Object.keys(ITINERARY_DATA).forEach(k=>{const d=ITINERARY_DATA[k]; const n=Number(String(k).replace(/\D/g,''))||Number(d.day); dayItems[n]=new Set((d.items||[]).map(x=>x.id));});
for(const [placeId,links] of Object.entries(DAY_LINKS||{})){
  if(!PLACES[placeId]) errors.push(`DAY_LINKS ${placeId}: place missing`);
  for(const pair of links||[]){
    const label=String(pair[0]||''), href=String(pair[1]||'');
    const m=href.match(/day\.html\?day=(\d+)#(.+)$/); if(!m){errors.push(`DAY_LINKS ${placeId}: malformed ${href}`);continue;}
    const day=Number(m[1]),anchor=m[2]; const lm=label.match(/Day\s+(\d+)/i);
    if(lm&&Number(lm[1])!==day) errors.push(`DAY_LINKS ${placeId}: label ${label} disagrees with URL day ${day}`);
    if(!dayItems[day]) errors.push(`DAY_LINKS ${placeId}: day ${day} missing`);
    else if(!dayItems[day].has(anchor)) errors.push(`DAY_LINKS ${placeId}: anchor ${anchor} missing from day ${day}`);
  }
}
for(const [id,b] of Object.entries(BOOKINGS_DATA||{})){
  if(b.placeId&&!PLACES[b.placeId]) errors.push(`${id}: placeId ${b.placeId} missing`);
  if(b.dayId&&b.day&&b.dayId!==`day${b.day}`) errors.push(`${id}: dayId ${b.dayId} disagrees with day ${b.day}`);
  if(b.timelineItemId&&b.day&&dayItems[b.day]&&!dayItems[b.day].has(b.timelineItemId)) errors.push(`${id}: timelineItemId ${b.timelineItemId} missing from day ${b.day}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);} console.log('CROSS-REFERENCE INTEGRITY: PASS — Guide day links, anchors, booking places and timeline references agree.');
