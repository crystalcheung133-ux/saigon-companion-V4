const fs=require('fs'),vm=require('vm'),assert=require('assert');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('data.js','utf8')+'\n;globalThis.__X={P:PLACES,B:BOOKINGS_DATA,I:ITINERARY_DATA};',c);const {P,B,I}=c.__X;
assert(B['bk-qspa']&&B['bk-qspa'].status==='planned');assert(!B['bk-norah-spa-2']);assert(!B['bk-nara']);assert(!B['bk-nha-suga']);
assert(I['1'].items.find(x=>x.id==='shopping-nguyen-trai').route.includes('Qspa'));assert(I['2'].items.find(x=>x.id==='pizza4ps').route.includes('Qspa'));
assert(P.qspa&&P['norah-spa-2'].status==='optional'&&P['nara-spa'].status==='optional'&&P['nha-suga'].status==='optional');
for(const leak of ['喜歡才入，不把每間店變成 checklist','不用樂觀早回時間重排','planning anchor'])assert(!fs.readFileSync('data.js','utf8').includes(leak));
assert(!P['the-350f']&&P['norah-spa-2']); console.log('VN ITINERARY / CONTENT CONTRACT: PASS');
