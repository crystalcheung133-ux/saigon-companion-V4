#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
function read(file){return fs.readFileSync(path.join(root,file),'utf8');}
const trip=read('trip-runtime.js');
const admin=read('admin.js');
const expenses=read('expenses.js');
const moments=read('moments.js');
const styles=read('styles.css');

const failures=[];
if(trip.includes('accommodation-about-stay') || trip.includes("bookingContactSectionsHTML(booking,place),bookingSectionHTML('Cancellation'")){
  failures.push('Trip cards still include Guide-owned accommodation/operator content.');
}
if(!trip.includes('accommodation-detail-card--compact')) failures.push('Compact Trip accommodation card contract missing.');
if(!trip.includes("onclick=\"openGuideModal('${escapeTripHTML(booking.placeId)}')\"")) failures.push('Trip Booking Guide action does not open the exact Guide card in-page.');
const guide=read('guide-runtime.js');
if(!guide.includes('if(clean.length===1){openGuideModal(clean[0]);return;}')) failures.push('Timeline Guide action does not open the exact Guide card in-page.');
if(!guide.includes('openGuideAlternatives(clean,itemId)')) failures.push('Timeline alternatives do not open in-page.');
if(!guide.includes('function closeGuideModal()') || guide.includes("if(tripModal)tripModal.classList.remove('show')")) failures.push('Guide modal close must preserve the originating Trip/Day page.');

if(admin.includes('trip-studio-selector-arrow')) failures.push('Studio selector arrow returned.');
if(!admin.includes('Leave Studio Mode')) failures.push('Leave Studio Mode action missing.');
if(!expenses.includes('canManageExpense') || !expenses.includes('This cannot be undone.')) failures.push('Expense ownership/delete confirmation contract missing.');
if(!moments.includes('canManageMoment') || !moments.includes('This cannot be undone.')) failures.push('Moment ownership/delete confirmation contract missing.');


if(!guide.includes("openGuideLinkedBooking") || !guide.includes("document.body.classList.add('guide-booking-stack-open')")) failures.push('Guide Booking must open as a stacked in-page overlay.');
if(!guide.includes("BOOKING_AUTHORITY.get(bookingId)") || guide.includes("BOOKING_AUTHORITY.byId(bookingId)")) failures.push('Guide → Booking must resolve booking IDs through BOOKING_AUTHORITY.get().');
if(!trip.includes("dismissAllContentOverlays")) failures.push('Closing Booking must dismiss the complete popup chain to the page anchor.');

if(!guide.includes("document.body.classList.add('guide-booking-stack-open')")) failures.push('Guide → Booking stacked modal state is missing.');
if(!read('script.js').includes("guide-booking-stack-open")) failures.push('Global popup dismissal does not clear stacked modal state.');
if(!/body\.guide-booking-stack-open #guideModal\.show\s*\{[^}]*z-index:var\(--engine-modal-layer,7000\)!important;/s.test(styles) || !/body\.guide-booking-stack-open #tripModal\.show\s*\{[^}]*z-index:calc\(var\(--engine-modal-layer,7000\) \+ 100\)!important;/s.test(styles)) failures.push('Booking modal is not layered above the originating Guide modal.');
if(failures.length){
  console.error('UX CONTRACT: FAILED');
  failures.forEach(x=>console.error('- '+x));
  process.exit(1);
}
console.log('UX CONTRACT: PASS — Trip/Guide, Studio and shared-data permissions are enforced.');
