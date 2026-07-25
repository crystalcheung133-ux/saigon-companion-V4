/* Stage 3.2C canonical repository and dual-read validation tests. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Calculator=require('./expense-calculator.js');
const Repository=require('./canonical-expense-repository.js');

const tests=[];
function test(name,fn){tests.push({name,fn});}
function loadConfig(){
  const context={};context.globalThis=context;vm.createContext(context);
  vm.runInContext(fs.readFileSync('trip-config.js','utf8'),context);
  return context.TRIP_CONFIG;
}
const config=loadConfig();
const options={project:'VN',tripId:config.id,currency:'VND',parties:config.parties};
const makeRepository=()=>Repository.createRepository(options);
const fixture=[
  {item:'Equal',total:100,paidBy:'crystal',type:'shared',split:['christal','crystal','mero','vivian'],createdAt:'2026-01-01T00:00:00Z'},
  {item:'Personal',total:80,paidBy:'mero',type:'personal',split:['vivian'],consumedBy:'vivian',createdAt:'2026-01-02T00:00:00Z',editedAt:'2026-01-03T00:00:00Z'}
];

test('dual-read is equivalent while expected missing-source diagnostics remain visible',()=>{
  const result=makeRepository().loadForValidation(fixture);
  assert.equal(result.comparison.equivalent,true);
  assert.equal(result.records.length,2);
  assert.equal(result.diagnostics.filter(x=>x.code==='SOURCE_FACT_MISSING').length,6);
  assert.equal(result.diagnostics.some(x=>/_MISMATCH$|VALIDATION_FAILURE/.test(x.code)),false);
});
test('equal split by four',()=>{
  const expense=makeRepository().loadForValidation([fixture[0]]).records[0];
  assert.deepEqual(expense.allocations.map(x=>x.amount),[25,25,25,25]);
});
test('personal expense and Party ownership',()=>{
  const expense=makeRepository().loadForValidation([fixture[1]]).records[0];
  assert.equal(expense.payerPartyId,'party-mero');
  assert.deepEqual(expense.allocations,[{partyId:'party-vivian',amount:80}]);
});
test('settlement matches legacy equal and personal loops',()=>{
  const result=makeRepository().loadForValidation(fixture);
  assert.equal(result.diagnostics.some(x=>x.code==='SETTLEMENT_MISMATCH'),false);
  const positions=Calculator.netSettlementPosition(result.records,config.parties.order);
  assert.deepEqual(positions,{'party-christal':-25,'party-crystal':75,'party-mero':55,'party-vivian':-105});
  assert.equal(Calculator.validateBalance(positions).valid,true);
});
test('migration ids are deterministic and unique by source position',()=>{
  const repository=makeRepository();
  const first=repository.loadForValidation(fixture).records.map(x=>x.expenseId);
  const second=repository.loadForValidation(fixture).records.map(x=>x.expenseId);
  assert.deepEqual(first,second);assert.notEqual(first[0],first[1]);
});
test('missing source facts remain null and diagnostic',()=>{
  const result=makeRepository().loadForValidation([fixture[0]]);
  const expense=result.records[0];
  assert.equal(expense.category,null);assert.equal(expense.occurredAt,null);assert.equal(expense.version,null);
  assert.deepEqual(result.diagnostics.filter(x=>x.code==='SOURCE_FACT_MISSING').map(x=>x.field),['category','occurredAt','version']);
});
test('Party aliases and allocation normalization',()=>{
  assert.equal(Repository.resolveParty('christal',config.parties),'party-christal');
  assert.equal(Repository.resolveParty('party-vivian',config.parties),'party-vivian');
  assert.deepEqual(Repository.normalizeAllocations([{partyId:'party-crystal',amount:'1,000 VND'}]),[{partyId:'party-crystal',amount:1000}]);
});
test('canonical validation and immutable retrieval',()=>{
  const input=JSON.parse(JSON.stringify(fixture));const before=JSON.stringify(input);
  const repository=makeRepository();const result=repository.loadForValidation(input);
  assert.equal(JSON.stringify(input),before);
  assert.deepEqual(Object.keys(result.records[0]),Array.from(Repository.CANONICAL_FIELDS));
  assert.equal(Object.isFrozen(repository.getAll()),true);
  assert.equal(Object.isFrozen(repository.getById(result.records[0].expenseId)),true);
});
test('expanded diagnostic codes are available through controlled faults',()=>{
  const canonical=makeRepository().loadForValidation([fixture[0]]).records[0];
  assert(Repository.compareProjection(fixture[0],{...canonical,payerPartyId:'party-vivian'},0,options).some(x=>x.code==='PARTY_MISMATCH'));
  assert(Repository.compareProjection(fixture[0],{...canonical,allocations:[]},0,options).some(x=>x.code==='ALLOCATION_MISMATCH'));
  assert(Repository.compareProjection(fixture[0],{...canonical,description:'Changed'},0,options).some(x=>x.code==='REPOSITORY_MISMATCH'));
  assert(Repository.compareSettlement([fixture[0]],[{...canonical,amount:101}],options).some(x=>x.code==='SETTLEMENT_MISMATCH'));
  assert(Repository.validateCanonical({...canonical,currency:'NZD'},0,options).some(x=>x.code==='VALIDATION_FAILURE'));
  assert(Repository.compareProjection({...fixture[0],futureField:true},canonical,0,options).some(x=>x.code==='UNSUPPORTED_LEGACY_FIELD'));
});
test('repository remains validation-only and disconnected from production',()=>{
  for(const file of ['expenses.html','index.html']){
    assert.equal(fs.readFileSync(file,'utf8').includes('canonical-expense-repository.js'),false);
  }
  const source=fs.readFileSync('canonical-expense-repository.js','utf8');
  assert.equal(/localStorage|writeJSON|querySelector|fetch\(/.test(source),false);
  assert.equal(/\bParticipant\b|\bparticipant(Id)?\b/.test(source),false);
});

let passed=0;
for(const entry of tests){
  try{entry.fn();passed++;process.stdout.write(`PASS VN REPOSITORY - ${entry.name}\n`);}
  catch(error){process.stderr.write(`FAIL VN REPOSITORY - ${entry.name}\n${error.stack}\n`);process.exitCode=1;}
}
if(!process.exitCode) process.stdout.write(`PASS VN Stage 3.2C Repository: ${passed}/${tests.length}\n`);
