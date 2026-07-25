/* Stage 3.2E Vietnam canonical Expense read-shadow tests. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Provider=require('./canonical-expense-local-provider.js');
const Dual=require('./expense-dual-write.js');
const Shadow=require('./expense-read-shadow.js');

function config(){const c={};c.globalThis=c;vm.createContext(c);vm.runInContext(fs.readFileSync('trip-config.js','utf8'),c);return c.TRIP_CONFIG;}
const trip=config();
function storage(){
  const map=new Map();
  return {map,get(key,fallback=null){return map.has(key)?map.get(key):fallback;},writeJSON(key,value){map.set(key,JSON.stringify(value));return true;},remove(key){map.delete(key);return true;}};
}
function equal(item='Equal',createdAt='2026-01-01T00:00:00Z'){
  return {item,total:100,paidBy:'crystal',type:'shared',split:['christal','crystal','mero','vivian'],consumedBy:null,createdAt};
}
function personal(){
  return {item:'Personal',total:80,paidBy:'mero',type:'personal',split:['vivian'],consumedBy:'vivian',createdAt:'2026-01-02T00:00:00Z'};
}
function harness(enabled=true){
  const store=storage();const canonicalKey='canonical';const stateKey='shadow';
  const provider=Provider.createProvider({storage:store,key:canonicalKey,enabled:true});
  let tick=0;const common={project:'VN',tripId:trip.id,currency:'VND',parties:trip.parties};
  const dual=Dual.createDualWrite({...common,enabled:true,provider,now:()=>`2026-02-${String(++tick).padStart(2,'0')}T00:00:00Z`});
  const shadow=Shadow.createCoordinator({...common,enabled,provider,storage:store,canonicalKey,stateKey,now:()=>`2026-03-${String(++tick).padStart(2,'0')}T00:00:00Z`});
  return {store,provider,dual,shadow,canonicalKey,stateKey};
}
{
  const h=harness(false);assert.equal(h.shadow.observe({legacyRecords:[equal()]}).attempted,false);assert.equal(h.store.map.has(h.stateKey),false);
}
{
  const h=harness();const missing=h.shadow.observe({legacyRecords:[equal()]});
  assert.equal(missing.state.diagnostics[0].code,'CANONICAL_SNAPSHOT_MISSING');assert.equal(h.store.map.has(h.canonicalKey),false);
}
{
  const h=harness();const records=[equal(),personal()];
  assert.equal(h.dual.afterLegacyWrite({action:'create',legacyRecords:[records[0]],targetIndex:0}).success,true);
  assert.equal(h.dual.afterLegacyWrite({action:'create',legacyRecords:records,targetIndex:1}).success,true);
  const created=h.shadow.observe({action:'create',legacyRecords:records});
  assert.equal(created.healthy,true);assert.equal(created.state.canonicalActiveCount,2);assert.equal(created.state.mismatchCount,0);
  const edited={...records[0],item:'Edited',editedAt:'2026-01-03T00:00:00Z'};
  const updated=[edited,records[1]];
  assert.equal(h.dual.afterLegacyWrite({action:'update',legacyRecords:updated,targetIndex:0,previousRecord:records[0]}).success,true);
  assert.equal(h.shadow.observe({action:'edit-load',legacyRecords:updated}).healthy,true);
  const remaining=[edited];
  assert.equal(h.dual.afterLegacyWrite({action:'delete',legacyRecords:remaining,targetIndex:1,previousRecord:records[1],deletedAt:'2026-01-04T00:00:00Z'}).success,true);
  const deleted=h.shadow.observe({action:'delete',legacyRecords:remaining});
  assert.equal(deleted.healthy,true);assert.equal(deleted.state.canonicalTombstoneCount,1);
  assert.equal(h.shadow.observe({action:'reload',legacyRecords:remaining}).healthy,true);
}
{
  const htmlFiles=['index.html','trip.html','guide.html','itinerary.html','day.html','place.html','memory.html','moments.html','expenses.html'];
  htmlFiles.forEach(file=>{
    const html=fs.readFileSync(file,'utf8');
    assert(html.indexOf('expense-canonical-bootstrap.js?v=stage3-2e-1')<html.indexOf('expenses-runtime.js?v=stage3-2e-1'),file);
  });
  const bootstrap=fs.readFileSync('expense-canonical-bootstrap.js','utf8');
  assert(bootstrap.includes("if(shadow)files.push('expense-read-shadow.js')"));
  const runtime=fs.readFileSync('expenses-runtime.js','utf8');
  assert(runtime.includes("observeExpenseShadow('edit-load',arr)"));
  assert(runtime.indexOf('CCMV_EXPENSE_DUAL_WRITE?.afterLegacyWrite')<runtime.indexOf('window.renderExpenses(operation)'));
  assert(runtime.includes('Intentional: keep modal open for quick multiple expense entry.'));
  assert.equal(runtime.includes('CCMV_EXPENSE_READ_SHADOW?.getState'),false);
}
process.stdout.write('PASS VN Stage 3.2E read shadow\n');
