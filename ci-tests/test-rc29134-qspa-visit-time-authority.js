const fs=require('fs'),assert=require('assert'),vm=require('vm');
const html=fs.readFileSync('day.html','utf8');
const match=html.match(/  function liveBookingForItem\(item\)\{[\s\S]*?\n  function timelineCopyEligible\(/);
assert(match,'Timeline authority functions found');
const code=match[0].replace(/\n  function timelineCopyEligible\($/,'');
const booking={id:'bk-qspa',time:'D1 · D2 · D3',plannedVisits:[
 {timelineItemId:'qspa-d1',dayId:'day1',time:'12:30–14:30'},
 {timelineItemId:'qspa-d2',dayId:'day2',time:'14:30–16:30'},
 {timelineItemId:'qspa-d3',dayId:'day3',time:'16:30–18:30'}]};
const ctx={BOOKING_AUTHORITY:{get:()=>booking},window:{BOOKING_AUTHORITY:{get:()=>booking}},DAY_BOOKINGS:{'bk-qspa':booking}};
vm.createContext(ctx);vm.runInContext(code,ctx);
for(let day=1;day<=3;day++){
 const item={id:`qspa-d${day}`,dayId:`day${day}`,bookingId:'bk-qspa',time:'old stale time'};
 assert.equal(ctx.timelineStartTime(item.time,item),['12:30','14:30','16:30'][day-1]);
}
booking.plannedVisits[1].time='15:00–17:00';
assert.equal(ctx.timelineStartTime('14:30–16:30',{id:'qspa-d2',dayId:'day2',bookingId:'bk-qspa'}),'15:00');
assert.equal(ctx.timelineStartTime('',{id:'qspa-d1',dayId:'day1',bookingId:'bk-qspa'}),'12:30');
assert.equal(ctx.timelineStartTime('',{id:'qspa-d3',dayId:'day3',bookingId:'bk-qspa'}),'16:30');
const css=fs.readFileSync('styles.css','utf8');
assert(css.includes('grid-template-columns:62px minmax(0,1fr)!important'));
assert(!css.includes('.timeline-item{grid-template-columns:92px minmax(0,1fr)!important')); 
console.log('RC29.134 QSPA VISIT TIME AUTHORITY: PASS');
