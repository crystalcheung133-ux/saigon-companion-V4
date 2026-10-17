const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync('data.js','utf8')+'\n;globalThis.snapshot={I:ITINERARY_DATA,B:BOOKINGS_DATA,P:PLACES};',c);
const {I,B,P}=c.snapshot;
function validateDay(day){
 const cards=I[String(day)]?.items||[], seen=new Set();
 for(const card of cards){
  assert(card.id&&!seen.has(card.id),`Day ${day}: duplicate or missing card ID ${card.id}`);seen.add(card.id);
  if(card.bookingId){
   assert(B[card.bookingId],`Day ${day}/${card.id}: missing booking ${card.bookingId}`);
   const b=B[card.bookingId];
   if(b.timelineItemId===card.id&&b.day!=null)assert.equal(Number(b.day),Number(day),`Day ${day}/${card.id}: booking anchor day mismatch`);
  }
  if(card.placeId)assert(P[card.placeId],`Day ${day}/${card.id}: missing place ${card.placeId}`);
  for(const id of card.guideIds||[])assert(P[id],`Day ${day}/${card.id}: missing guide place ${id}`);
  for(const group of card.guideGroups||[])for(const id of group.guideIds||[])assert(P[id],`Day ${day}/${card.id}: missing group place ${id}`);
  if(card.type==='openList'&&(card.guideIds||[]).length){
   const route=Array.from(card.guideIds);
   assert.equal(new Set(route).size,route.length,`Day ${day}/${card.id}: duplicate shopping stop`);
   assert.equal(card.placeId,route[0],`Day ${day}/${card.id}: wrong first-stop navigation`);
   if((card.guideGroups||[]).length)assert.deepStrictEqual(Array.from(card.guideGroups.flatMap(g=>g.guideIds||[])),route,`Day ${day}/${card.id}: shopping group order mismatch`);
  }
 }
}
module.exports={assert,I,B,P,validateDay};
