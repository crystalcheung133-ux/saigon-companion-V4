// Phase 17: mutation-based timeline consistency; no fixed dates, stops, or times.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('itinerary-authority.js','utf8');
const original=[{id:'alpha',time:'09:00',title:'A',details:['original'],route:'old',bookingId:'booking-a'},{id:'beta',time:'10:00',title:'B',details:['b'],route:'old',guideIds:['guide-b']}];
const saved=[{...original[1],time:'14:15',details:[],route:'custom'}, {id:'custom-user',time:'16:00',title:'Personal',details:['keep'],route:''}];
const updated=[{...original[0],title:'A new'},{...original[1],title:'B new',guideIds:['guide-b-new']},{id:'gamma',time:'17:00',title:'New master',details:[],route:''}];
const disk={overrides:{masterRevision:'before',dayChanges:{'8':{items:saved,baseItems:original}}}};
const c={console,ITINERARY_DATA:{'8':{items:updated}},MASTER_ITINERARY_REVISION:'after',STORAGE_CONFIG:{keys:{itineraryOverrides:'overrides',adminDraft:'draft'}},STORAGE:{local:{readJSON:(k,d)=>disk[k]===undefined?d:JSON.parse(JSON.stringify(disk[k])),writeJSON:(k,v)=>{disk[k]=JSON.parse(JSON.stringify(v));}}},getAdminDraft:()=>null};c.globalThis=c;vm.createContext(c);vm.runInContext(source,c);
function ids(items){return Array.from(items,x=>x.id)}
let out=c.ITINERARY_AUTHORITY.resolveDayItems('8',updated);
assert(!ids(out).includes('alpha'),'explicitly deleted card must not reappear');
assert(ids(out).includes('custom-user'),'user-added card must survive deployment');
assert(ids(out).includes('gamma'),'new master card should appear');
assert.equal(out.find(x=>x.id==='beta').time,'14:15');
assert.deepEqual(Array.from(out.find(x=>x.id==='beta').details),[],'cleared notes must stay empty');
assert.equal(out.find(x=>x.id==='beta').title,'B new','untouched title should update');
assert.deepEqual(Array.from(out.find(x=>x.id==='beta').guideIds),['guide-b-new'],'current relationship metadata must hydrate');
assert.equal(out.find(x=>x.id==='custom-user').details[0],'keep');
assert.deepEqual(ids(c.ITINERARY_AUTHORITY.resolveDayItems('8',updated)),ids(out),'reload must retain order');
console.log('PHASE17 TIMELINE MUTATION CONSISTENCY: PASS');
