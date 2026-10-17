const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('data.js','utf8');const ctx={};vm.createContext(ctx);
vm.runInContext(source+';globalThis.X={PLACES,CATEGORIES,GUIDE_ORDER,DAY_LINKS,ITINERARY_DATA};',ctx);
const X=ctx.X, removed=['the-350f','ivoire','pho-vietnam','social-club','bakes'];
for(const id of removed){
 assert(!Object.hasOwn(X.PLACES,id),id+' still in PLACES');
 assert(!X.GUIDE_ORDER.includes(id),id+' still in GUIDE_ORDER');
 assert(!Object.hasOwn(X.DAY_LINKS,id),id+' still in DAY_LINKS');
 assert(!Object.values(X.CATEGORIES).flat().some(x=>x.key===id),id+' still in CATEGORIES');
 assert(!Object.values(X.ITINERARY_DATA).some(day=>day.items.some(item=>item.id===id||item.placeId===id||item.guideIds?.includes(id))),id+' still in timeline');
}
assert(fs.readFileSync('shopping-directory-data.js','utf8').includes('BAKES'),'BAKES read-only directory card missing');
console.log('REMOVED FIVE STANDALONE GUIDES: PASS');
