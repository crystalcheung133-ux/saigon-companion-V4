const fs=require('fs'),assert=require('assert');
const trip=fs.readFileSync('trip-runtime.js','utf8');
const auth=fs.readFileSync('booking-authority.js','utf8');
const cfg=fs.readFileSync('trip-config.js','utf8');
function between(src,a,b){const i=src.indexOf(a),j=src.indexOf(b,i+1);assert(i>=0&&j>i,`missing block ${a}`);return src.slice(i,j)}
const actions=between(trip,'function bookingActionButtonsHTML','function bookingContactSectionsHTML');
const edit=between(trip,'function bookingEditButtonHTML','function bookingField');
assert(trip.includes('bookingFixedHeaderActionsHTML(booking'),'Booking detail lost fixed Studio Edit action');
assert(edit.includes('window.isAdminMode&&window.isAdminMode()'),'Booking Edit must be visible only in Studio');
assert(auth.includes('canonicalStatusRecord'),'single-status authority canonicalizer missing');
assert(!auth.includes("'status','displayStatus','bookingName'"),'displayStatus must not remain an editable authority field');
console.log('BOOKING MASTER STATUS + STUDIO EDIT: PASS');
assert(trip.includes("['restaurant','spa','transport'].includes(booking.type)"),'Restaurant/spa/transport booking editor must expose schedule fields');
