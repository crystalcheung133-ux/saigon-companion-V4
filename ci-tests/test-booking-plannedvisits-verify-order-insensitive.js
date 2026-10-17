// RC29.126/127 — Booking remote verification: plannedVisits is key-order independent; Notes ignore
// line-ending style and edge whitespace only. Real value changes must still fail.
// Fake server re-orders every object's keys the way Postgres jsonb does (shorter keys first,
// then bytewise), which is what a real round-trip can do to plannedVisits.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const SRC_PATH=process.env.BOOKING_SYNC_SRC||'booking-sync-runtime.js';
const SRC=fs.readFileSync(SRC_PATH,'utf8');

function jsonbOrder(v){
  if(Array.isArray(v))return v.map(jsonbOrder);
  if(v&&typeof v==='object'){
    const out={};
    Object.keys(v).sort((a,b)=>a.length-b.length||(a<b?-1:a>b?1:0)).forEach(k=>{out[k]=jsonbOrder(v[k]);});
    return out;
  }
  return v;
}
// Real Qspa visit shape/insertion order (data.js): day,date,time,label,duration,dayId,timelineItemId
const visit=(n,time)=>({day:'Day '+n,date:'Day '+n+' date',time:time||'~12:15–14:15',label:'Visit '+n,duration:'2h',dayId:'day'+n,timelineItemId:'tl-'+n});
const visits=[visit(1),visit(2,'~14:15–16:15'),visit(3,'~10:00–12:00')];
assert.notDeepStrictEqual(Object.keys(visits[0]),Object.keys(jsonbOrder(visits[0])),'fixture must exercise a real key re-order');

function makeCtx(server){
  const storage=new Map();const localStorage={getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)};
const ctx={localStorage,console,JSON,Date,Math,Promise,CustomEvent:function(){},
    document:{dispatchEvent(){},readyState:'loading',addEventListener(){},hidden:false},navigator:{onLine:true},
    setInterval(){},addEventListener(){},crypto:{randomUUID(){return 'uuid';}},
    TRIP_CONFIG:{storageNamespace:'ccmv-vietnam-2026',tripGeneration:1,bookingMasterRevision:13,bookingManagement:{sync:{enabled:true,accessToken:'x'}}},
    SYNC_CONFIG:{url:'https://example.test',anonKey:'k',tripId:'ccmv-vietnam-2026'},
    BOOKING_PERMISSIONS:{mode(){return 'collaborative'},currentPartyId(){return 'party-crystal'},canEdit(){return true}},
    BOOKING_AUTHORITY:{masterRevision(){return 13},editableStateFields:[],deployMaster(){return null},save(){},remove(){}},
    fetch:async(url,opt)=>{
      const b=JSON.parse(opt.body);
      if(b.action==='read')return {ok:true,status:200,json:async()=>({ok:true,rows:[server.readRow()]})};
      const res=server.write(b.mutation);
      return {ok:true,status:200,json:async()=>({ok:true,record:res})};
    }};
  ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(SRC,ctx);return ctx;
}
const baseRow=()=>({booking_id:'bk-qspa',version:7,booking_date:'2026-10-30',booking_time:'12:15:00',notes:'old',payload:{id:'bk-qspa',bookingId:'bk-qspa',_masterRevision:13}});
const record=(notes)=>({id:'bk-qspa',bookingId:'bk-qspa',date:'30 Oct – 1 Nov 2026',time:'D1 · D2 · D3',notes:notes===undefined?'new note':notes,plannedVisits:JSON.parse(JSON.stringify(visits))});
const stored=(mut,mutateVisits,mutateNotes)=>{const p=JSON.parse(JSON.stringify(mut.payload));if(mutateVisits)p.plannedVisits=mutateVisits(p.plannedVisits);if(mutateNotes)p.notes=mutateNotes(p.notes);return {...baseRow(),version:8,notes:p.notes,payload:jsonbOrder(p)};};

(async()=>{
  // A) write response echoes the saved row with jsonb-reordered keys -> must verify and resolve.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m))});
   const r=await ctx.BOOKING_SYNC.push(record());assert.equal(r.ok,true,'A: reordered-key echo must verify');}
  // B) write response is stale -> verification must re-read; the re-read row is reordered but equal -> resolves.
  {let row,reads=0;const ctx=makeCtx({readRow:()=>{reads++;return row||baseRow();},write:m=>{row=stored(m);return baseRow();}});
   const r=await ctx.BOOKING_SYNC.push(record());assert.equal(r.ok,true,'B: verification re-read with reordered keys must pass');
   assert(reads>=2,'B: verification path must re-read the row');
   assert.deepStrictEqual(r.booking.plannedVisits.map(v=>v.time),visits.map(v=>v.time),'B: visit order/values preserved');}
  // C) a real value change (visit 2 time) must still FAIL verification.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,v=>{v[1].time='~09:00–11:00';return v;}))});
   await assert.rejects(()=>ctx.BOOKING_SYNC.push(record()),/BOOKING_REMOTE_VERIFY_FAILED/,'C: changed value must not verify');}
  // D) visit ORDER (D1/D2/D3 sequence) is meaningful: reversed array must FAIL verification.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,v=>v.slice().reverse()))});
   await assert.rejects(()=>ctx.BOOKING_SYNC.push(record()),/BOOKING_REMOTE_VERIFY_FAILED/,'D: reordered array must not verify');}
  // E) a missing visit must FAIL verification.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,v=>v.slice(0,2)))});
   await assert.rejects(()=>ctx.BOOKING_SYNC.push(record()),/BOOKING_REMOTE_VERIFY_FAILED/,'E: dropped visit must not verify');}
  // G) server stores Notes with CRLF line endings -> must verify.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,null,x=>x.replace(/\n/g,'\r\n')))});
   const r=await ctx.BOOKING_SYNC.push(record('line1\nline2'));assert.equal(r.ok,true,'G: CRLF vs LF Notes must verify');}
  // H) server trims edge whitespace -> must verify.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,null,x=>x.trim()))});
   const r=await ctx.BOOKING_SYNC.push(record('  keep this  \n'));assert.equal(r.ok,true,'H: edge-whitespace-only difference must verify');}
  // I) different Notes text -> must FAIL.
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,null,()=>'someone else wrote this'))});
   await assert.rejects(()=>ctx.BOOKING_SYNC.push(record('my note')),/BOOKING_REMOTE_VERIFY_FAILED/,'I: changed Notes must not verify');}
  // J) interior whitespace change -> must FAIL (only edges/line endings are normalized).
  {let row;const ctx=makeCtx({readRow:()=>row||baseRow(),write:m=>(row=stored(m,null,x=>x.replace('a b','a  b')))});
   await assert.rejects(()=>ctx.BOOKING_SYNC.push(record('a b')),/BOOKING_REMOTE_VERIFY_FAILED/,'J: interior whitespace change must not verify');}
  // F) static guard: no raw JSON.stringify equality on plannedVisits remains.
  assert(!/JSON\.stringify\([^)]*plannedVisits[^)]*\)\s*(===|!==)/.test(SRC),'F: raw JSON.stringify equality on plannedVisits must not return');
  assert(!/String\((?:verified|booking&&booking)\.?notes\|\|''\)/.test(SRC),'raw Notes string compare must not return');
  console.log('BOOKING PLANNED-VISITS VERIFY ORDER-INSENSITIVE: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
