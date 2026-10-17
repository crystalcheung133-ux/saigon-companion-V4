// Phase 22: execute the actual timeline time resolver against mutable booking fixtures.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('day.html','utf8');
const match=html.match(/  function liveBookingForItem\(item\)\{[\s\S]*?\n  function timelineCopyEligible\(/);
assert(match,'Timeline time resolver missing');
const code=match[0].replace(/\n  function timelineCopyEligible\($/,'');
const bookings={
 'bk-single':{id:'bk-single',time:'17:30'},
 'bk-multi':{id:'bk-multi',time:'D1 · D2',plannedVisits:[
  {timelineItemId:'visit-one',dayId:'day1',time:'12:30–14:30'},
  {timelineItemId:'visit-two',dayId:'day2',time:'14:30–16:30'}
 ]}
};
const authority={get:id=>bookings[id]||null};
const context={window:{BOOKING_AUTHORITY:authority},BOOKING_AUTHORITY:authority,DAY_BOOKINGS:bookings};
vm.createContext(context);vm.runInContext(code,context);
const single={id:'event-single',bookingId:'bk-single',time:'09:00'};
assert.equal(context.timelineStartTime(single.time,single),'17:30');
bookings['bk-single'].time='18:45';
assert.equal(context.timelineStartTime(single.time,single),'18:45','single booking edit must supersede stale timeline time');
const first={id:'visit-one',dayId:'day1',bookingId:'bk-multi',time:'08:00'};
const second={id:'visit-two',dayId:'day2',bookingId:'bk-multi',time:'08:00'};
assert.equal(context.timelineStartTime(first.time,first),'12:30');
assert.equal(context.timelineStartTime(second.time,second),'14:30');
bookings['bk-multi'].plannedVisits[1].time='16:15–18:15';
assert.equal(context.timelineStartTime(second.time,second),'16:15');
assert.equal(context.timelineStartTime(first.time,first),'12:30','editing visit two must not alter visit one');
const ordinary={id:'free-activity',time:'11:15',timeDisplayMode:'fixed'};
assert.equal(context.timelineStartTime(ordinary.time,ordinary),'11:15','unlinked activity retains its own time');
console.log('PHASE22 BOOKING → TIMELINE LIVE RESOLVER MUTATIONS: PASS');
