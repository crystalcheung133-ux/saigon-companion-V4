const fs=require('fs'),assert=require('assert');
const trip=fs.readFileSync('trip-runtime.js','utf8'),auth=fs.readFileSync('booking-authority.js','utf8'),css=fs.readFileSync('styles.css','utf8');
assert(trip.includes('bookingPlannedVisitEditFields'),'multi-visit editor missing');
for(const f of ['day','date','time','label','duration']) assert(trip.includes(`['day','date','time','label','duration']`),`planned visit save parser missing ${f}`);
assert(auth.includes("'plannedDays','plannedVisits'"),'plannedVisits not included in cross-device editable authority');
assert(trip.includes('booking-detail-head-actions'),'fixed booking header actions missing');
assert(!/bookingGuideButtonHTML\(booking\),\s*bookingEditButtonHTML\(booking\)/.test(trip),'Edit Booking still lives in variable action list');
assert(css.includes('RC29.121 — canonical mobile Booking detail/editor layout'),'canonical mobile booking CSS missing');
assert(css.includes('grid-template-columns:1fr!important'),'mobile booking facts must collapse to one column');
console.log('RC29.121 BOOKING MOBILE + MULTIVISIT: PASS');

const css119=fs.readFileSync('styles.css','utf8');assert(css119.includes('#tripModal>.trip-sheet>.trip-close')&&css119.includes('float:none!important'),'mobile Trip close must not float beside Booking content');assert(css119.includes('#tripModalContent{display:block!important;width:100%!important'),'mobile Trip content must own full sheet width');
