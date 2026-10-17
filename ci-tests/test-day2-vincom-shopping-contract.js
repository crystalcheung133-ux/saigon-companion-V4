const {assert,I,P,validateDay}=require('./dynamic-consistency-helper');
validateDay(2);
const cards=I['2']?.items||[];
const routes=cards.filter(c=>c.type==='openList'&&c.guideIds?.length);
for(const route of routes){
 const original=route.placeId;route.placeId='__invalid_first_stop__';
 assert.throws(()=>validateDay(2),/missing place|wrong first-stop navigation/);route.placeId=original;
 if(route.guideGroups?.length){const old=route.guideGroups;route.guideGroups=[{guideIds:['__missing__']}];assert.throws(()=>validateDay(2),/missing group place|shopping group order mismatch/);route.guideGroups=old;}
}
// No fixed venues, shopping stop counts, dates or performance times.
validateDay(2);
console.log('DAY 2 DYNAMIC SHOPPING ROUTE CONTRACT: PASS');
