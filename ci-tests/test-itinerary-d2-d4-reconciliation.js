const {assert,I,B,validateDay}=require('./dynamic-consistency-helper');
for(const day of [1,2,4])validateDay(day);
// Legitimate changes to card counts, order, notes and booking time must not fail.
const cards=I['2'].items, snapshot=cards.slice();
const sample=cards[0];if(sample){cards.splice(0,1);validateDay(2);cards.push(sample);validateDay(2);cards.splice(0,cards.length,...snapshot);}
const b=Object.values(B).find(x=>x&&typeof x.time==='string');
if(b){const old=b.time;b.time='18:37';validateDay(2);validateDay(4);b.time=old;}
const linked=Object.entries(B).find(([id])=>Object.values(I).some(d=>(d.items||[]).some(c=>c.bookingId===id)));
if(linked){const [id,bk]=linked;delete B[id];assert.throws(()=>{for(const day of Object.keys(I))validateDay(day)},/missing booking/);B[id]=bk;}
console.log('DYNAMIC ITINERARY / BOOKING RECONCILIATION: PASS');
