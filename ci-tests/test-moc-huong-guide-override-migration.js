const assert=require('assert'),fs=require('fs'),vm=require('vm');
const store={travel_engine_guide_overrides_v2:JSON.stringify({
 'moc-huong':{patch:{desc:'指定 An Khánh 分店，15:30–17:30，4 人，120 分鐘，待確認。可用 WhatsApp 預約。',signature:['120-minute treatment','4 guests · pending confirmation'],worth:['SPA 完步行去 0123 Complex','WhatsApp +84 90 975 5877'],address:'03 Đặng Hữu Phổ, An Khánh, Hồ Chí Minh City'},updatedAt:'2026-10-15T00:00:00Z'},
 'pink-church':{patch:{desc:'My own edited guide'},updatedAt:'2026-10-15T00:00:00Z'}
 })};
const localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v}};
const ctx={localStorage,document:{dispatchEvent(){}},CustomEvent:function(){},Date,JSON};ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync('guide-authority.js','utf8'),ctx);
const base={desc:'Calm wellness experience',signature:['Body relaxation'],worth:['Choose massage pressure'],address:'03 Đặng Hữu Phổ'};
const g=ctx.GUIDE_AUTHORITY.resolve('moc-huong',base);
assert.equal(g.desc,base.desc);assert.equal(g.signature[0],base.signature[0]);
assert.equal(g.worth.length,1);assert(g.worth[0].includes('0123'));
assert.equal(g.address,'03 Đặng Hữu Phổ, An Khánh, Hồ Chí Minh City');
assert.equal(ctx.GUIDE_AUTHORITY.resolve('pink-church',{desc:'Default'}).desc,'My own edited guide');
assert.equal(JSON.parse(store.travel_engine_guide_overrides_v2)['moc-huong'].patch.signature[0],'120-minute treatment','do not destroy user saved records');
assert(!('travel_engine_timeline' in store),'must not touch timeline storage');
console.log('MOC HUONG GUIDE OVERRIDE COMPATIBILITY: PASS');
