const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const retired='bookings-runtime.js';
assert(!fs.existsSync(path.join(root,retired)),`${retired} must remain deleted`);
const productionFiles=fs.readdirSync(root).filter(f=>/\.(html|js|json|txt)$/i.test(f) && !['RELEASE.json','VERSION.txt'].includes(f));
const refs=[];
for(const file of productionFiles){
  const s=fs.readFileSync(path.join(root,file),'utf8');
  if(s.includes(retired)) refs.push(file);
}
assert.deepEqual(refs,[],`${retired} referenced by production path(s): ${refs.join(', ')}`);
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(!sw.includes(retired),'retired runtime must not be precached');
const manifest=fs.readFileSync(path.join(root,'PRODUCTION-FILE-MANIFEST.txt'),'utf8');
assert(!manifest.includes(retired),'retired runtime must not be in production manifest');
console.log('RETIRED BOOKINGS RUNTIME TOMBSTONE: PASS');
