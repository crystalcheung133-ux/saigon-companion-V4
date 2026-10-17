// Contract test: synthetic booking changes must change timeline time; no fixed itinerary times.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('day.html','utf8');
const start=source.indexOf('  function liveBookingForItem(item){');
const end=source.indexOf('  function timelineStartTime(value,item,isFirstStop=false){',start);
assert(start>=0&&end>start,'booking authority functions not found');
const ctx={window:{},DAY_BOOKINGS:{}};vm.createContext(ctx);
vm.runInContext(source.slice(start,end)+'\n;globalThis.testAuthority=bookingAuthorityTime;',ctx);
const item={id:'synthetic-card',dayId:'synthetic-day',bookingId:'synthetic-booking'};
ctx.DAY_BOOKINGS['synthetic-booking']={time:'11:20–12:20'};
assert.equal(ctx.testAuthority(item),'11:20');
ctx.DAY_BOOKINGS['synthetic-booking'].time='18:35–20:00';
assert.equal(ctx.testAuthority(item),'18:35','booking time mutation must propagate');
ctx.DAY_BOOKINGS['synthetic-booking'].plannedVisits=[{timelineItemId:'synthetic-card',time:'09:45–11:00'}];
assert.equal(ctx.testAuthority(item),'09:45','visit time overrides aggregate booking time');
ctx.DAY_BOOKINGS['synthetic-booking'].plannedVisits[0].time='17:10–18:00';
assert.equal(ctx.testAuthority(item),'17:10','visit time mutation must propagate');
console.log('DYNAMIC BOOKING TIME CONTRACT: PASS');
