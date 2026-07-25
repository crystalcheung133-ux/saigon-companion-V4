/* Stage 3.2D Vietnam production bootstrap and browser-storage wiring regression. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const htmlFiles=[
  'index.html','trip.html','guide.html','itinerary.html','day.html',
  'place.html','memory.html','moments.html','expenses.html'
];
const modules=[
  'expense-calculator.js','legacy-expense-adapter.js',
  'canonical-expense-repository.js','canonical-expense-core.js',
  'canonical-expense-local-provider.js','expense-dual-write.js'
];
const canonicalKey='ccmv-vietnam-2026:canonical_expenses:stage_3_2d:v1';
const fatalCodes=new Set([
  'CANONICAL_WRITE_FAILURE','CANONICAL_READBACK_FAILURE','ID_MAPPING_FAILURE',
  'VERSION_MISMATCH','ALLOCATION_MISMATCH','PARTY_MISMATCH',
  'SETTLEMENT_MISMATCH','ACTIVE_TOMBSTONE_MISMATCH','STORAGE_CORRUPTION',
  'UNSUPPORTED_LEGACY_TRANSITION','REPOSITORY_MISMATCH','VALIDATION_FAILURE'
]);

function browserContext(enabled){
  const values=new Map();
  const nativeStorage={
    get length(){return values.size;},
    key(index){return [...values.keys()][index]??null;},
    getItem(key){return values.has(key)?values.get(key):null;},
    setItem(key,value){values.set(key,String(value));},
    removeItem(key){values.delete(key);}
  };
  const context={
    console,Date,JSON,Object,Array,Map,Set,Number,String,Math,
    localStorage:nativeStorage,sessionStorage:nativeStorage
  };
  context.globalThis=context;context.window=context;
  vm.createContext(context);
  const tripSource=fs.readFileSync('trip-config.js','utf8')
    .replace('expenseCanonicalDualWrite:false',`expenseCanonicalDualWrite:${enabled}`);
  vm.runInContext(tripSource,context,{filename:'trip-config.js'});
  vm.runInContext(fs.readFileSync('storage-config.js','utf8'),context,{filename:'storage-config.js'});
  vm.runInContext(fs.readFileSync('storage.js','utf8'),context,{filename:'storage.js'});
  context.document={
    write(markup){
      const sources=[...markup.matchAll(/src="([^"?]+)/g)].map(match=>match[1]);
      sources.forEach(source=>vm.runInContext(fs.readFileSync(source,'utf8'),context,{filename:source}));
    }
  };
  vm.runInContext(fs.readFileSync('expense-canonical-bootstrap.js','utf8'),context,{filename:'expense-canonical-bootstrap.js'});
  return {context,values};
}

for(const file of htmlFiles){
  const html=fs.readFileSync(file,'utf8');
  const trip=html.indexOf('trip-config.js');
  const storage=html.indexOf('storage.js');
  const bootstrap=html.indexOf('expense-canonical-bootstrap.js?v=stage3-2e-1');
  const runtime=html.indexOf('expenses-runtime.js?v=stage3-2e-1');
  assert(trip>=0&&trip<storage&&storage<bootstrap&&bootstrap<runtime,`${file} production script order`);
}

const runtimeSource=fs.readFileSync('expenses-runtime.js','utf8');
assert(runtimeSource.indexOf('writeExpenses(arr);')<runtimeSource.indexOf('window.CCMV_EXPENSE_DUAL_WRITE?.afterLegacyWrite'));
assert.match(runtimeSource,/action:operation/);
assert.match(runtimeSource,/action:'delete'/);
assert.match(runtimeSource,/Intentional: keep modal open for quick multiple expense entry/);

const enabled=browserContext(true);
for(const symbol of [
  'CCMV_EXPENSE_CALCULATOR','CCMV_LEGACY_EXPENSE_ADAPTER',
  'CCMV_CANONICAL_EXPENSE_REPOSITORY','CCMV_CANONICAL_EXPENSE_CORE',
  'CCMV_CANONICAL_EXPENSE_LOCAL_PROVIDER','CCMV_EXPENSE_DUAL_WRITE'
]){
  assert(enabled.context[symbol],`${symbol} exposed`);
}
const legacy=[{
  item:'Production wiring create',total:400,paidBy:'crystal',
  type:'shared',split:['christal','crystal','mero','vivian'],
  consumedBy:null,createdAt:'2026-07-25T12:00:00.000Z'
}];
const result=enabled.context.CCMV_EXPENSE_DUAL_WRITE.afterLegacyWrite({
  action:'create',legacyRecords:legacy,targetIndex:0,previousRecord:null
});
assert.equal(result.success,true);
assert.equal(enabled.values.has(canonicalKey),true);
const state=enabled.context.CCMV_CANONICAL_EXPENSE_LOCAL.read();
assert.equal(state.active.length,1);
assert.equal(state.status.enabled,true);
assert.equal(state.status.healthy,true);
assert.equal(state.lastValidation.status,'passed');
assert.equal(state.diagnostics.some(diagnostic=>fatalCodes.has(diagnostic.code)),false);

const disabled=browserContext(false);
assert.equal(disabled.context.CCMV_EXPENSE_DUAL_WRITE,undefined);
assert.equal(disabled.values.has(canonicalKey),false);

process.stdout.write('PASS VN Stage 3.2D production wiring: 9 entry points, enabled create, disabled no-op\n');
