const assert=require('assert'),fs=require('fs'),vm=require('vm');
const code=fs.readFileSync('guide-authority.js','utf8');
function boot(initial={},errors={}){
 const store={...initial},writes=[];
 const localStorage={getItem(k){if(errors.read===k)throw Error('read denied');return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null},setItem(k,v){if(errors.write===k)throw Error('write denied');writes.push(k);store[k]=v}};
 const ctx={localStorage,document:{dispatchEvent(){}},CustomEvent:function(){},Date,JSON};ctx.globalThis=ctx;
 return {store,writes,ctx,boot:()=>vm.runInNewContext(code,ctx)};
}
const S='travel_engine_guide_overrides_v2',D='travel_engine_guide_draft_v1',L='travel_engine_guide_overrides_v1';
// Corrupt saved data must never be interpreted as empty or replaced.
{
 const t=boot({[S]:'{broken',[D]:'{}'});t.boot();
 assert.throws(()=>t.ctx.GUIDE_AUTHORITY.save('a',{notes:'new'}),/Guide storage corrupt/);
 assert.throws(()=>t.ctx.GUIDE_AUTHORITY.mergeRemote([{id:'a',patch:{notes:'old'},updatedAt:'2099'}]),/Guide storage corrupt/);
 assert.equal(t.store[S],'{broken');assert(!t.writes.includes(S));
}
// A failed read is not permission to overwrite manual edits.
{
 const t=boot({[S]:'{"a":{"patch":{"notes":"mine"}}}'},{read:S});
 assert.throws(()=>t.boot(),/read denied/);
 assert(!t.writes.includes(S));
}
// A corrupt draft must not be silently discarded by save/commit.
{
 const t=boot({[S]:'{}',[D]:'bad json'});t.boot();
 assert.throws(()=>t.ctx.GUIDE_AUTHORITY.commit(),/Guide storage corrupt/);
 assert.equal(t.store[D],'bad json');
}
// A present empty v2 record is intentional; never resurrect v1 data.
{
 const t=boot({[S]:'{}',[L]:'{"deleted":{"notes":"obsolete"}}'});t.boot();
 assert.equal(t.ctx.GUIDE_AUTHORITY.records().deleted,undefined);
 assert.equal(t.store[S],'{}');
}
// Normal saved override remains authoritative.
{
 const t=boot({[S]:JSON.stringify({a:{patch:{notes:'mine'},updatedAt:'2026-10-17'}})});t.boot();
 assert.equal(t.ctx.GUIDE_AUTHORITY.resolve('a',{notes:'zip default'}).notes,'mine');
 t.ctx.GUIDE_AUTHORITY.save('a',{notes:'new manual'});
 assert.equal(t.ctx.GUIDE_AUTHORITY.resolve('a',{notes:'zip default'}).notes,'new manual');
}
console.log('PHASE13 GUIDE STORAGE FAIL-CLOSED: PASS');
