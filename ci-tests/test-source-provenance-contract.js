const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={console};sandbox.globalThis=sandbox;vm.createContext(sandbox);vm.runInContext(fs.readFileSync('data.js','utf8'),sandbox);
const {PLACES}=sandbox.TRAVEL_DATASETS;
for(const id of ['fusion','pizza4ps','qspa']){
  const s=PLACES[id]&&PLACES[id].source;
  assert(s,`${id}: source provenance missing`);
  assert.equal(s.type,'official',`${id}: pilot source must be official`);
  assert(/^https:\/\//.test(s.url||''),`${id}: source URL must be HTTPS`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(s.verifiedAt||''),`${id}: verifiedAt must be YYYY-MM-DD`);
}
console.log('SOURCE PROVENANCE: PASS — pilot canonical places carry official source + verifiedAt metadata.');
