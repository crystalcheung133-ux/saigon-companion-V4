const fs=require('fs'),vm=require('vm'),assert=require('assert');
const raw=fs.readFileSync('data.js','utf8');const c={};vm.createContext(c);vm.runInContext(raw+'\n;globalThis.__X={P:PLACES,B:BOOKINGS_DATA,I:ITINERARY_DATA,C:CATEGORIES,O:GUIDE_ORDER};',c);const {P,B,I,C,O}=c.__X;
const ids=d=>Array.from(I[String(d)].items,x=>x.id);
assert(P.qspa,'canonical Qspa Guide entity missing');assert.equal(Array.from(O).filter(x=>x==='qspa').length,1,'Qspa duplicated in Guide order');assert.equal(C.SPA.filter(x=>x.key==='qspa').length,1,'Qspa duplicated in SPA category');
assert.equal(P.qspa.status,'planned');assert.equal(P.qspa.address,'25/1 Trương Định, Xuân Hòa, Hồ Chí Minh City');assert(!P.qspa.worth.some(x=>/5,000,000 VND|40,000,000 VND|Buy 10/.test(x)));
assert(B['bk-qspa']);assert.equal(B['bk-qspa'].status,'planned');assert.equal(B['bk-qspa'].plannedVisits.length,3);assert(!B['bk-norah-spa-2']);assert(!B['bk-nara']);assert(!B['bk-nha-suga']);
assert.deepEqual(ids(1).slice(4,9),['shopping-nguyen-trai','qspa-d1','day1-hotel-reset','cafe-apartments-optional','omakase-tiger']);assert.equal(I['1'].items.find(x=>x.id==='qspa-d1').time,'12:30–14:30');assert(I['1'].items.some(x=>x.id==='cafe-apartments-evening'));
assert.deepEqual(ids(2),['com-tam-moc','garmentory','shopping-tqd','pizza4ps','qspa-d2','post-office','vincom-new-playground','rue-miche-ledition','lune']);assert.equal(I['2'].items.find(x=>x.id==='qspa-d2').time,'14:30–16:30');
assert.deepEqual(ids(3),['cu-chi','man-moi','war-museum','qspa-d3','maruco']);assert.equal(I['3'].items.find(x=>x.id==='qspa-d3').time,'16:30–18:30');
assert.equal(P['norah-spa-2'].status,'optional');assert.equal(P['nara-spa'].status,'optional');assert.equal(P['nha-suga'].status,'optional');
for(const stale of ['"bk-norah-spa-2"','"bk-nara"','"bk-nha-suga"'])assert(!raw.includes(stale),`stale optional spa booking survived: ${stale}`);

const shoppingRuntime=fs.readFileSync('guide-runtime.js','utf8');
const shoppingData=fs.readFileSync('shopping-directory-data.js','utf8');
for(const stale of [
  '下午 Norah 後先接 Vincom',
  'Norah 後直接走進 Vincom',
  'Norah → Vincom → Post Office / Book Street',
  '看完直接去 Nara 做 90 分鐘 reset'
]){
  assert(!raw.includes(stale)&&!shoppingRuntime.includes(stale)&&!shoppingData.includes(stale),`active stale pre-Qspa route prose survived: ${stale}`);
}
assert(shoppingRuntime.includes('Pizza 4P’s 後到 Qspa 做 Afternoon Reset'),'D2 Shopping Directory lead does not reflect Qspa canonical route');
assert(shoppingData.includes('Qspa → Cathedral / Post Office / Book Street → Vincom'),'D2 Shopping Directory planned route not reconciled to Qspa');
assert(raw.includes('看完直接去 Qspa 做 120 分鐘 War Day Recovery'),'War Museum Guide prose does not hand off to Qspa');

const trip=fs.readFileSync('trip-runtime.js','utf8'),sync=fs.readFileSync('booking-sync-runtime.js','utf8'),guide=fs.readFileSync('guide-runtime.js','utf8');
assert(trip.includes("raw==='planned'?'planned'"),'Trip runtime does not preserve PLANNED booking state');assert(sync.includes("rawStatus==='planned'?'planned'"),'Booking sync collapses PLANNED to PENDING');assert(trip.includes('bookingAlternativeGuidesHTML'),'Booking optional Guide alternatives renderer missing');assert(guide.includes('guideAlternativeLinksHTML'),'Guide Alternatives by Day renderer missing');
console.log('QSPA D1-D3 RECONCILIATION: PASS — one Guide, one planned Booking, D1/D2/D3 timeline ownership, Guide-only Norah/Nara alternatives.');
