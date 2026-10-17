const {assert,I,P}=require('./dynamic-consistency-helper');
for(const [day,data] of Object.entries(I))for(const card of data.items||[]){
 const groups=card.guideGroups||[];
 for(const group of groups){assert(Array.isArray(group.guideIds),`Day ${day}/${card.id}: malformed guide group`);for(const id of group.guideIds)assert(P[id],`Day ${day}/${card.id}: missing guide place ${id}`);}
 if(card.type==='openList'&&card.guideIds?.length&&groups.length)assert.deepStrictEqual(Array.from(groups.flatMap(g=>g.guideIds)),Array.from(card.guideIds),`Day ${day}/${card.id}: shopping group order mismatch`);
}
console.log('DYNAMIC CONTEXTUAL GUIDE GROUPS: PASS');
