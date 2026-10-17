// RC29.129 — release metadata must not carry stale RC / CI claims.
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const release=JSON.parse(read('RELEASE.json'));
const rc=(release.artifact_version.match(/RC(\d+\.\d+)/)||[])[1];
assert(rc,'artifact_version has no RC number');
const cur='RC'+rc;
assert(release.release_status.startsWith(cur+' '),`release_status must start with ${cur}: ${release.release_status}`);
const fields={
  release_status:release.release_status,
  static_master_ci:release.static_master_ci,
  'validation.static_master_ci':release.validation&&release.validation.static_master_ci,
  'validation.browser_release_smoke':release.validation&&release.validation.browser_release_smoke
};
for(const [name,value] of Object.entries(fields)){
  assert(typeof value==='string'&&value.length,`${name} missing`);
  for(const m of value.matchAll(/RC\d+\.\d+/g)) assert.equal(m[0],cur,`${name} mentions stale ${m[0]} (current ${cur})`);
}
const header=read('trip-config.js').split('\n')[0];
for(const m of header.matchAll(/RC\d+\.\d+/g)) assert.equal(m[0],cur,`trip-config.js header mentions stale ${m[0]}`);
assert(release.changes.some(c=>c.startsWith(cur+':')),`changes must record ${cur}`);
console.log(`RELEASE METADATA FRESHNESS: PASS — all status/CI claims reference ${cur}`);
