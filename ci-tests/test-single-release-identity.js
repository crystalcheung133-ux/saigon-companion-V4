const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const release=JSON.parse(fs.readFileSync(path.join(root,'RELEASE.json'),'utf8'));
const version=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim();
assert.equal(version,release.artifact_version,'VERSION.txt != RELEASE artifact_version');
const rc=(release.artifact_version.match(/RC(\d+\.\d+)/)||[])[1];
assert(rc,'RC identity missing');
const compact='rc'+rc.replace('.','');
const token=release.asset_cache_token;
assert(token.startsWith(compact+'-'),`asset_cache_token must start ${compact}-`);
const cfg=fs.readFileSync(path.join(root,'trip-config.js'),'utf8');
assert(cfg.includes(`version:'RC${rc}-${release.engine_version}'`),'TRIP_CONFIG.version mismatch');
assert(cfg.includes(`buildLabel:'${release.artifact_version}'`),'TRIP_CONFIG.buildLabel mismatch');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(sw.includes(token),'SW cache token mismatch');
const htmlFiles=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const stale=[];
for(const f of htmlFiles){
 const s=fs.readFileSync(path.join(root,f),'utf8');
 for(const m of s.matchAll(/[?&]v=([^"'&<]+)/g)) if(m[1]!==token) stale.push(`${f}:${m[1]}`);
 const meta=s.match(/<meta name="travel-engine-build" content="([^"]+)"/);
 if(meta) assert.equal(meta[1],`VN-RC${rc}|${release.engine_version}`,`${f}: build meta mismatch`);
}
assert.deepEqual(stale,[],`stale HTML cache tokens: ${stale.join(', ')}`);
console.log(`SINGLE RELEASE IDENTITY: PASS — RC${rc} / ${token}`);
