const assert=require('assert'),fs=require('fs'),vm=require('vm');
const source=fs.readFileSync('booking-sync-runtime.js','utf8');
let releaseFirst;const hold=new Promise(r=>releaseFirst=r);let writes=[],failFirst=false;let storage={};
const root={localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v;}},TRIP_CONFIG:{bookingManagement:{sync:{enabled:true,accessToken:'fixture'}}},SYNC_CONFIG:{url:'https://test.invalid',anonKey:'fixture',tripId:'fixture'},BOOKING_PERMISSIONS:{mode:()=> 'collaborative',canEdit:()=>true,currentPartyId:()=> 'test'},BOOKING_AUTHORITY:{masterRevision:()=>1,editableStateFields:[],save:()=>({ok:true})},GenerationSelectionAdapter:{view:()=>({byId:{}})},crypto:{randomUUID:()=>String(Math.random())},navigator:{onLine:true},document:{readyState:'loading',addEventListener:()=>{},dispatchEvent:()=>{}},CustomEvent:class{},console,setInterval:()=>{},addEventListener:()=>{},fetch:async (_url,opts)=>{const body=JSON.parse(opts.body);if(body.action==='read')return {ok:true,status:200,json:async()=>({ok:true,rows:[]})};writes.push(body.mutation.payload.notes);if(writes.length===1){await hold;if(failFirst)return {ok:false,status:500,json:async()=>({ok:false,code:'FAIL'})};}return {ok:true,status:200,json:async()=>({ok:true,record:{booking_id:'fixture-booking',version:writes.length,payload:body.mutation.payload}})};}};
vm.createContext(root);vm.runInContext(source,root);
(async()=>{
 const first=root.BOOKING_SYNC.push({id:'fixture-booking',notes:'first'});await new Promise(r=>setTimeout(r,0));
 const second=await root.BOOKING_SYNC.push({id:'fixture-booking',notes:'second'});
 assert.equal(writes.length,1,'overlapping network writes');assert(second.pending);
 failFirst=true;releaseFirst();await assert.rejects(first);assert.equal(root.BOOKING_SYNC.recordStatus('fixture-booking').state,'failed');
 const third=await root.BOOKING_SYNC.push({id:'fixture-booking',notes:'third'});assert(third.pending);assert.equal(writes.length,1,'failed write auto-retried on Save');
 const restarted=Object.assign({},root,{document:{readyState:'loading',addEventListener:()=>{},dispatchEvent:()=>{}},BOOKING_AUTHORITY:{...root.BOOKING_AUTHORITY,save:()=>({ok:true})}});
 vm.createContext(restarted);vm.runInContext(source,restarted);
 assert.equal(restarted.BOOKING_SYNC.recordStatus('fixture-booking').state,'pending','pending survives reload');
 const retry=await restarted.BOOKING_SYNC.retry('fixture-booking');assert(retry.ok);assert.equal(writes.at(-1),'third');assert.equal(restarted.BOOKING_SYNC.recordStatus('fixture-booking').state,'synced');
 console.log('PHASE 6 JOURNAL / SERIALIZATION / EXPLICIT RETRY PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
