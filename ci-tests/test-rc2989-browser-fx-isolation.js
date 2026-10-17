const fs=require('fs');
const b=fs.readFileSync('ci-tests/test-browser-release-smoke.py','utf8');
function assert(c,m){if(!c) throw new Error(m)}
assert(b.includes('window.__CI_FX_FETCH_HITS = []'),'browser gate must install pre-script deterministic FX provider');
assert(b.includes('window.fetch = function(input, init)'),'browser gate must intercept FX before native network');
assert(b.includes('production FX network request escaped CI provider'),'browser gate must hard-fail any escaped production FX request');
assert(!b.includes("context.route('https://api.frankfurter.dev/**',mock_fx)"),'legacy network-route FX mock must be retired');
console.log('RC29.89 browser FX pre-network isolation contract: PASS');
