const fs=require('fs'),vm=require('vm');
const root=process.argv[2]||'.';
const data=fs.readFileSync(root+'/data.js','utf8');
const guide=fs.readFileSync(root+'/guide-runtime.js','utf8');
const trip=fs.readFileSync(root+'/trip-runtime.js','utf8');
const cfg=fs.readFileSync(root+'/trip-config.js','utf8');
function ok(v,m){if(!v)throw new Error(m)}
let ctx={};vm.createContext(ctx);vm.runInContext(data+';globalThis.X={PLACES,CATEGORIES,GUIDE_ORDER,BOOKINGS_DATA};',ctx);const X=ctx.X;
ok(X.BOOKINGS_DATA['bk-cu-chi'].title==='Cu Chi Tunnels Half Day Tour','canonical Cu Chi title');
ok(/bookingMasterRevision:13/.test(cfg),'booking revision must invalidate stale full-record title overrides');
for(const k of ['little-bear','nha-suga']) ok(!X.GUIDE_ORDER.includes(k)&&!Object.values(X.CATEGORIES).flat().some(x=>x.key===k),k+' must not render in Guide');
for(const k of ['social-club','the-350f','ivoire','pho-vietnam']) ok(!X.PLACES[k]&&!X.GUIDE_ORDER.includes(k)&&!Object.values(X.CATEGORIES).flat().some(x=>x.key===k),k+' must be fully removed');
const cu=X.PLACES['cu-chi'];const cutxt=JSON.stringify(cu);
for(const forbidden of ['Private tour · 4 travellers','07:30 由 Fusion','drop Mặn Mòi','skip tour lunch']) ok(!cutxt.includes(forbidden),'Cu Chi Guide repeats booking/timeline: '+forbidden);
ok(/underground|tunnel network|ventilation/i.test(cutxt),'Cu Chi Guide needs destination background');
for(const k of ['omakase-tiger','pizza4ps','lune','man-moi','qspa','ha-spa','fusion']){const txt=JSON.stringify(X.PLACES[k]);ok(!/已確認|訂金已付|07:30 private-tour pickup|D1 · Arrival Recovery · 120 min|D2 · Afternoon Reset/.test(txt),k+' Guide leaks booking/timeline facts')}
ok(guide.includes("guideModal.classList.add('guide-backgrounded-for-booking')"),'Guide -> Booking must background Guide');
ok(trip.includes('dismissAllContentOverlays'),'Closing Booking must dismiss all popup layers instead of restoring Guide');
console.log('RC29.85 GUIDE OWNERSHIP + MODAL FOREGROUND: PASS');
