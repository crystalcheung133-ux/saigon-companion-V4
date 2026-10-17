const fs=require('fs'),vm=require('vm'),assert=require('assert');
const syncCode=fs.readFileSync('guide-sync-runtime.js','utf8'),authCode=fs.readFileSync('guide-authority.js','utf8');
async function main(){
 const store={},events={},remote=new Map();let fail=false,requests=0;
 const ctx={JSON,Date,Map,Set,console,clearTimeout,setTimeout,CustomEvent:function(name,options){this.type=name;this.detail=options?.detail},document:{visibilityState:'hidden',addEventListener(name,fn){events[name]=fn},dispatchEvent(){}},navigator:{onLine:true},addEventListener(){},localStorage:{getItem(k){return store[k]??null},setItem(k,v){store[k]=v}},SYNC_CONFIG:{enabled:true,url:'https://example.invalid',anonKey:'test',tripId:'test',tables:{guides:'guides'}},SUPABASE:{isConfigured:()=>true,getSession:async()=>{},getClient:()=>({from:()=>({select:()=>({eq:async()=>({data:[...remote.values()],error:null})}),upsert:async(rows)=>{requests++;if(fail)return {error:Error('offline')};rows.forEach(r=>remote.set(r.id,{id:r.id,payload:r.payload,updated_at:r.updated_at}));return {error:null}}})})}};
 ctx.globalThis=ctx;vm.runInNewContext(authCode,ctx);vm.runInNewContext(syncCode,ctx);
 ctx.GUIDE_AUTHORITY.save('cafe',{notes:'my notes'});assert.equal(ctx.GUIDE_SYNC.getState().pending,1);
 fail=true;await ctx.GUIDE_SYNC.syncNow();assert.equal(ctx.GUIDE_SYNC.getState().status,'failed');const before=requests;
 await ctx.GUIDE_SYNC.syncNow();assert.equal(requests,before,'Failed write must not auto retry');
 fail=false;await ctx.GUIDE_SYNC.retry();assert.equal(ctx.GUIDE_SYNC.getState().pending,0);assert.equal(ctx.GUIDE_SYNC.getState().status,'synced');
 assert.equal(remote.get('cafe').payload.notes,'my notes');
 ctx.GUIDE_AUTHORITY.save('cafe',{notes:'newer'});assert.equal(ctx.GUIDE_SYNC.getState().pending,1,'New manual Save must invalidate Synced');
 store.travelengine_guide_pending_v1='{broken';assert.throws(()=>ctx.GUIDE_AUTHORITY.save('cafe',{notes:'unsafe'}),/GUIDE_JOURNAL_CORRUPT/);
 assert.equal(ctx.GUIDE_SYNC.getState().status,'storage-error');
 console.log('PHASE15 GUIDE JOURNAL + REMOTE READBACK: PASS');
}
main().catch(e=>{console.error(e);process.exitCode=1});
