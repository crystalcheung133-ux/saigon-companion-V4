// Day 4 contract: validate relationships, not a frozen approved itinerary.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync('data.js','utf8')+'\n;globalThis.snapshot={I:ITINERARY_DATA,B:BOOKINGS_DATA,P:PLACES};',context);
const {I,B,P}=context.snapshot;
function validate(day){
 const cards=I[String(day)]?.items||[];
 const seen=new Set();
 for(const card of cards){
  assert(card.id && !seen.has(card.id),`Day ${day}: missing/duplicate card ID ${card.id}`);seen.add(card.id);
  if(card.bookingId){
   assert(B[card.bookingId],`Day ${day}/${card.id}: missing booking`);
   const b=B[card.bookingId];
   if(b.timelineItemId===card.id && b.day!=null)assert.equal(Number(b.day),Number(day),`Day ${day}/${card.id}: booking anchor day mismatch`);
  }
  if(card.placeId)assert(P[card.placeId],`Day ${day}/${card.id}: missing navigation place`);
  for(const id of card.guideIds||[])assert(P[id],`Day ${day}/${card.id}: missing route place ${id}`);
  for(const group of card.guideGroups||[])for(const id of group.guideIds||[])assert(P[id],`Day ${day}/${card.id}: missing grouped place ${id}`);
  // Only explicit shopping open lists with a route own first-stop navigation.
  if(card.type==='openList' && (card.guideIds||[]).length){
   const route=Array.from(card.guideIds);
   assert.equal(new Set(route).size,route.length,`Day ${day}/${card.id}: duplicate route stop`);
   assert.equal(card.placeId,route[0],`Day ${day}/${card.id}: navigation must target first shopping stop`);
   if((card.guideGroups||[]).length){
    const grouped=Array.from(card.guideGroups.flatMap(g=>g.guideIds||[]));
    assert.deepStrictEqual(grouped,route,`Day ${day}/${card.id}: shopping guide order differs from route`);
   }
  }
 }
}
validate(4);
// Prove checks are live: a changed route is allowed when references are updated,
// but an out-of-sync navigation or shopping guide must fail.
const route=(I['4']?.items||[]).find(c=>c.type==='openList' && c.guideIds?.length && c.guideGroups?.length);
if(route){
 const original=route.placeId;
 route.placeId=route.guideIds.length>1?route.guideIds[1]:'__not_first__';
 assert.throws(()=>validate(4),/navigation must target first shopping stop/);
 route.placeId=original;
 const originalGroups=route.guideGroups;
 route.guideGroups=[{guideIds:['__incorrect__']}];
 assert.throws(()=>validate(4),/shopping guide order differs from route|missing grouped place/);
 route.guideGroups=originalGroups;
 validate(4);
}
console.log('DAY 4 DYNAMIC ROUTE / BOOKING REFERENCE CONSISTENCY: PASS');
