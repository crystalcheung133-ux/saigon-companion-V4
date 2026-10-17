const fs=require('fs'),assert=require('assert'),vm=require('vm');
const day=fs.readFileSync('day.html','utf8');
assert(day.includes("type:'custom',dayId:'day'+day,placeId:null,bookingId:null,map:null,nonPlace:true"),'new Add Activity must classify custom no-place items');
const auth=fs.readFileSync('itinerary-authority.js','utf8');
assert(auth.includes("next.type==='custom'&&!String(next.placeId||'').trim()&&next.nonPlace!==true"),'authority legacy normalizer missing');
const sync=fs.readFileSync('sync-runtime.js','utf8');
assert(sync.includes('normalizeLegacyItineraryForHydration'),'pre-authority hydrate normalizer missing');
assert(sync.includes("entry[0]==='ITINERARY_DATA'"),'itinerary hydrate wiring missing');
console.log('CUSTOM ACTIVITY NONPLACE LIFECYCLE: PASS');
