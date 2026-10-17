const fs=require('fs'),assert=require('assert');
const guide=fs.readFileSync('guide-runtime.js','utf8');
const trip=fs.readFileSync('trip-runtime.js','utf8');
const day=fs.readFileSync('day.html','utf8');
assert(guide.includes("f('Description / About','description'"),'Guide editor needs one Description field');
assert(guide.includes("f('Useful info — one item per line','usefulInfo'"),'Guide editor needs one Useful info field');
for(const old of ["f('Subtitle','sub'","f('Price','price'","f('Booking note','bookingNote'","f('Signature / highlights","f('Practical notes"]){assert(!guide.includes(old),`legacy Guide editor field remains: ${old}`)}
assert(guide.includes("Object.assign(patch,{desc:'',sub:'',price:'',bookingNote:'',signature:[],highlights:[],worth:[],tips:[],notes:[],practical:[]})"),'Guide save must retire legacy duplicate fields');
assert(guide.includes("Object.prototype.hasOwnProperty.call(g,'usefulInfo')"),'Explicit empty Useful info must not resurrect legacy content');
assert(guide.includes("Object.prototype.hasOwnProperty.call(g,'description')"),'Explicit empty Description must not resurrect legacy content');
assert(day.includes('const DAY_PLACE_BASE = JSON.parse(JSON.stringify(DAY_PRODUCTION.guide.places||{}));'),'Timeline must thaw the deeply-frozen production Place projection before wrapping it in a resolving Proxy');
assert(day.includes('new Proxy(DAY_PLACE_BASE')&&day.includes('GUIDE_AUTHORITY.resolve(String(key),base)'),'Timeline must resolve current shared Place authority');
assert(day.includes("(place&&place.address)||(item&&item.address)"),'Timeline canonical Place address must win over item snapshot');
assert(trip.includes("return (place&&place.address)||(booking&&booking.address)"),'Booking display must prefer shared Place address');
assert(trip.includes("GUIDE_AUTHORITY.save(current.placeId,placePatch)"),'Booking edits must sync shared Place contact facts');
assert(trip.includes("booking.checkInInstructions||'',booking.lunchStatus||'',booking.notes"),'near-duplicate operational notes must merge into Important information');
console.log('RC29.80 GUIDE / SHARED PLACE OWNERSHIP: PASS');

// RC29.81 regression: GenerationSelectionAdapter projections are deeply frozen. A Proxy
// over the frozen projection cannot legally return a merged Guide object for a frozen,
// non-configurable property. Timeline therefore thaws the Place map before proxying it.
const frozenProjection=Object.freeze({pizza4ps:Object.freeze({title:'Pizza',address:'master'})});
const thawedProjection=JSON.parse(JSON.stringify(frozenProjection));
const authority={resolve:(key,base)=>Object.assign({},base,{address:'edited'})};
const resolvedPlaces=new Proxy(thawedProjection,{get(target,key){const base=target[key];return base?authority.resolve(String(key),base):base;}});
assert.equal(resolvedPlaces.pizza4ps.address,'edited','frozen projection Proxy invariant regression: shared Place must resolve without TypeError');
