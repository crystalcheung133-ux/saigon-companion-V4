const fs=require('fs'),vm=require('vm'),assert=require('assert');const c={console};vm.createContext(c);vm.runInContext(fs.readFileSync('data.js','utf8')+'\n;globalThis.__X={P:PLACES,I:ITINERARY_DATA,B:BOOKINGS_DATA};',c);const {P,I,B}=c.__X;
assert(P.qspa);assert.equal(P.qspa.address,'25/1 Trương Định, Xuân Hòa, Hồ Chí Minh City');assert.equal(P['norah-spa-2'].status,'optional');assert.equal(P['nara-spa'].status,'optional');
assert(B['bk-qspa']);assert.equal(B['bk-qspa'].status,'planned');assert(!B['bk-norah-spa-2']);assert(!B['bk-nara']);assert(!B['bk-nha-suga']);
assert.equal(B['bk-pizza4ps'].title,'Pizza 4P’s Hai Bà Trưng'); assert(B['bk-pizza4ps'].address.includes('151B Hai Bà Trưng'));
const d1=I['1'].items,d2=I['2'].items,d3=I['3'].items;assert.equal(d1.find(x=>x.id==='qspa-d1').time,'12:30–14:30');assert.equal(d2.find(x=>x.id==='qspa-d2').time,'14:30–16:30');assert.equal(d3.find(x=>x.id==='qspa-d3').time,'16:30–18:30');
assert.equal(I['5'].items.find(x=>x.id==='ha-spa').time,'15:30');assert.equal(I['5'].items.find(x=>x.id==='ha-spa').timeDisplayMode,'fixed');console.log('VN QSPA D1-D3 / OPTIONAL ALTERNATIVES CONTRACT: PASS');
