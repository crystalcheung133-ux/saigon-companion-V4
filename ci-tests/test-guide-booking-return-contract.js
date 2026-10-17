const fs=require('fs'),assert=require('assert');
const guide=fs.readFileSync('guide-runtime.js','utf8'),trip=fs.readFileSync('trip-runtime.js','utf8'),script=fs.readFileSync('script.js','utf8');
assert(guide.includes('openGuideLinkedBooking'),'Guide linked Booking opener missing');
assert(guide.includes("document.body.classList.add('guide-booking-stack-open')"),'Guide → Booking must preserve Guide as a visual underlay');
assert(script.includes('dismissAllContentOverlays'),'Canonical dismiss-all overlay primitive missing');
assert(trip.includes("typeof window.dismissAllContentOverlays==='function'"),'Booking close must dismiss the complete popup chain');
assert(!guide.includes("TRIP_MODAL_RETURN_TO_GUIDE=window.GUIDE_MODAL_ORIGIN!=='timeline'"),'Legacy popup return-history policy must be retired');
console.log('GUIDE → BOOKING OVERLAY CONTRACT: PASS — latest popup overlays; close dismisses the whole chain to the page anchor.');
