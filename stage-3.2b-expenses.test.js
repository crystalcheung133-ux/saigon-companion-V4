/* Stage 3.2B source-derived characterization and foundation validation. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Calculator=require('./expense-calculator.js');
const Adapter=require('./legacy-expense-adapter.js');

const tests=[];
function test(name,fn){tests.push({name,fn});}
function loadTripConfig(){
  const context={};context.globalThis=context;vm.createContext(context);
  vm.runInContext(fs.readFileSync('trip-config.js','utf8'),context);
  return context.TRIP_CONFIG;
}
const config=loadTripConfig();
const options={project:'VN',tripId:config.id,currency:'VND',parties:config.parties};
const adapt=(record,index=0)=>Adapter.adapt(record,index,options);

test('Party directory resolves four legacy aliases without changing labels/order',()=>{
  assert.deepEqual(Array.from(config.parties.order),['party-christal','party-crystal','party-mero','party-vivian']);
  assert.equal(config.parties.identities['party-christal'].displayName,'Christal');
  assert.equal(config.parties.identities['party-crystal'].legacyAliases[0],'crystal');
});
test('equal split by four',()=>{
  const expense=adapt({item:'Dinner',total:100,paidBy:'crystal',type:'shared',split:['christal','crystal','mero','vivian'],createdAt:'2026-01-01T00:00:00Z'});
  assert.deepEqual(expense.allocations.map(x=>x.amount),[25,25,25,25]);
});
test('personal expense',()=>{
  const expense=adapt({item:'Shoes',total:80,paidBy:'crystal',type:'personal',consumedBy:'vivian',split:['vivian']});
  assert.deepEqual(expense.allocations,[{partyId:'party-vivian',amount:80}]);
});
test('payer and consumer combinations',()=>{
  const same=adapt({item:'Same',total:40,paidBy:'mero',type:'personal',consumedBy:'mero'});
  const other=adapt({item:'Other',total:40,paidBy:'mero',type:'personal',consumedBy:'christal'});
  assert.deepEqual(Calculator.netSettlementPosition([same],config.parties.order),{'party-christal':0,'party-crystal':0,'party-mero':0,'party-vivian':0});
  assert.deepEqual(Calculator.netSettlementPosition([other],config.parties.order),{'party-christal':-40,'party-crystal':0,'party-mero':40,'party-vivian':0});
});
test('settlement remains raw before whole-VND presentation rounding',()=>{
  const expense=adapt({item:'Taxi',total:100,paidBy:'crystal',type:'shared',split:['christal','crystal','mero','vivian']});
  const positions=Calculator.netSettlementPosition([expense],config.parties.order);
  assert.deepEqual(positions,{'party-christal':-25,'party-crystal':75,'party-mero':-25,'party-vivian':-25});
  assert.equal(Calculator.validateBalance(positions).valid,true);
});
test('edit timestamp preservation',()=>{
  const expense=adapt({item:'Edited',total:10,paidBy:'crystal',type:'shared',split:['crystal'],createdAt:'2026-01-01T00:00:00Z',editedAt:'2026-01-03T00:00:00Z'});
  assert.equal(expense.createdAt,'2026-01-01T00:00:00Z');
  assert.equal(expense.updatedAt,'2026-01-03T00:00:00Z');
});
test('legacy record reading and deterministic persistent migration id',()=>{
  const record={item:'Legacy',total:123,paidBy:'christal',type:'shared',split:['christal','crystal'],createdAt:'2026-01-01T00:00:00Z'};
  const first=adapt(record,7);const second=adapt(record,7);
  assert.equal(first.expenseId,second.expenseId);assert.match(first.expenseId,/^vn-expense-migration-/);
  assert.equal(first.description,'Legacy');assert.equal(first.currency,'VND');
});
test('missing source facts stay null and emit diagnostics',()=>{
  const expense=adapt({item:'Legacy',total:10,paidBy:'crystal',type:'shared',split:['crystal']});
  assert.equal(expense.category,null);assert.equal(expense.occurredAt,null);assert.equal(expense.version,null);
  assert.deepEqual(expense.migration.diagnostics.filter(x=>x.code==='SOURCE_FACT_MISSING').map(x=>x.field),['category','occurredAt','version']);
});
test('canonical references use partyId only and no Participant dependency exists',()=>{
  const expense=adapt({item:'Refs',total:10,paidBy:'crystal',type:'shared',split:['crystal','vivian']});
  assert.match(expense.payerPartyId,/^party-/);
  expense.allocations.forEach(row=>assert.match(row.partyId,/^party-/));
  for(const file of ['expense-calculator.js','legacy-expense-adapter.js']){
    assert.equal(/\bParticipant\b|\bparticipant(Id)?\b/.test(fs.readFileSync(file,'utf8')),false);
  }
});
test('adapter is read-only and production paths do not load foundation modules',()=>{
  const source={item:'Immutable',total:10,paidBy:'crystal',type:'shared',split:['crystal']};
  const before=JSON.stringify(source);adapt(source);assert.equal(JSON.stringify(source),before);
  const html=fs.readFileSync('expenses.html','utf8');
  assert.equal(html.includes('expense-calculator.js'),false);
  assert.equal(html.includes('legacy-expense-adapter.js'),false);
});

let passed=0;
for(const entry of tests){
  try{entry.fn();passed++;process.stdout.write(`PASS VN - ${entry.name}\n`);}
  catch(error){process.stderr.write(`FAIL VN - ${entry.name}\n${error.stack}\n`);process.exitCode=1;}
}
if(!process.exitCode) process.stdout.write(`PASS VN Stage 3.2B: ${passed}/${tests.length}\n`);
