// Dynamic referential-integrity contract. It deliberately does not freeze itinerary content.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync('data.js','utf8')+'\n;globalThis.snapshot={P:PLACES,B:BOOKINGS_DATA,I:ITINERARY_DATA};',context);
const {P,B,I}=context.snapshot;
const days=new Map(Object.entries(I).map(([day,value])=>[Number(day),value]));
const cardIndex=new Map();
for(const [day,data] of days){
  assert(Number.isInteger(day)&&day>0,`Invalid itinerary day ${day}`);
  const seen=new Set();
  for(const item of data.items||[]){
    assert(item.id,`Day ${day}: card without ID`);
    assert(!seen.has(item.id),`Day ${day}: duplicate card ${item.id}`);
    seen.add(item.id);
    cardIndex.set(`${day}:${item.id}`,item);
    if(item.bookingId){
      assert(B[item.bookingId],`Day ${day} card ${item.id}: missing booking ${item.bookingId}`);
      const booking=B[item.bookingId];
      if(booking.timelineItemId===item.id && booking.day!=null)assert.equal(Number(booking.day),day,`Card ${item.id}: primary booking day mismatch`);
      // Repeated visits may reference one booking; only its primary anchor owns the booking day.
    }
    if(item.placeId)assert(P[item.placeId],`Card ${item.id}: unknown place ${item.placeId}`);
    for(const id of item.guideIds||[])assert(P[id],`Card ${item.id}: unknown guide ${id}`);
    for(const group of item.guideGroups||[])for(const id of group.guideIds||[])assert(P[id],`Card ${item.id}: unknown grouped guide ${id}`);
    // Route authority: only cards explicitly marked as shopping routes own first-stop navigation.
    if(item.type==='openList' && item.guideIds?.length && item.guideGroups?.length){
      const route=Array.from(item.guideIds);
      const grouped=Array.from(item.guideGroups.flatMap(g=>g.guideIds||[]));
      if(grouped.length===route.length && grouped.every((id,i)=>id===route[i]) && item.placeId){
        assert.equal(item.placeId,route[0],`Card ${item.id}: navigation does not target route first stop`);
      }
    }
  }
}
for(const [id,b] of Object.entries(B)){
  if(b.placeId)assert(P[b.placeId],`${id}: unknown place ${b.placeId}`);
  if(b.day!=null)assert(days.has(Number(b.day)),`${id}: unknown day ${b.day}`);
  if(b.timelineItemId && !b.standalone){
    assert(cardIndex.has(`${Number(b.day)}:${b.timelineItemId}`),`${id}: missing timeline anchor ${b.timelineItemId}`);
    const card=cardIndex.get(`${Number(b.day)}:${b.timelineItemId}`);
    if(card.bookingId)assert.equal(card.bookingId,id,`${id}: timeline bookingId points elsewhere`);
  }
}
console.log('CROSS-SURFACE DAY CONSISTENCY: PASS — dynamic booking/card/place/guide references and route navigation.');
