const fs=require('fs'),vm=require('vm');const root=process.argv[2]||'.';
const data=fs.readFileSync(root+'/data.js','utf8'),guide=fs.readFileSync(root+'/guide-runtime.js','utf8'),css=fs.readFileSync(root+'/styles.css','utf8');
let c={};vm.createContext(c);vm.runInContext(data+';globalThis.X={PLACES,CATEGORIES};',c);const X=c.X;
function ok(v,m){if(!v)throw new Error(m)}
for(const k of ['cu-chi','qspa','ha-spa','omakase-tiger','pizza4ps','lune','man-moi','fusion']){const g=X.PLACES[k],t=[g.sub,g.desc,...(g.signature||[]),...(g.worth||[])].join(' ');ok(/[\u3400-\u9fff]/.test(t),k+' must keep Chinese-primary Guide copy');}
const directory=fs.readFileSync(root+'/shopping-directory-data.js','utf8');
ok((directory.match(/directory-card/g)||[]).length>=14,'Shopping Directory must contain the real route cards');
ok(guide.includes("if(semantic==='SHOP'){\n  closeMiniMenus();openShoppingDirectoryView();return;"),'SHOP category must open the real route-led directory directly');
for(const f of ['documents.html','expenses.html','itinerary.html','memory.html','moments.html','place.html','trip.html']) ok(fs.readFileSync(root+'/'+f,'utf8').includes('shopping-directory-data.js'),'Shopping data missing from '+f);
ok(guide.includes("document.body.classList.add('guide-booking-stack-open','guide-foreground-over-booking')"),'Booking→Guide must request Guide foreground');
ok(css.includes('guide-foreground-over-booking #guideModal.show')&&css.includes('guide-foreground-over-booking #tripModal.show'),'bidirectional modal z-order CSS missing');
console.log('RC29.86 GUIDE LANGUAGE + SHOPPING + BIDIRECTIONAL FOREGROUND: PASS');
