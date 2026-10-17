const fs=require('fs'),assert=require('assert');
const c=fs.readFileSync('sync-config.js','utf8');
assert(c.includes("typeof runtimeOverride.enabled==='boolean'"),'explicit runtime enabled:false must override baked-in cloud config');
const b=fs.readFileSync('ci-tests/test-browser-release-smoke.py','utf8');
assert(b.includes('context.add_init_script(\"window.TRAVEL_ENGINE_SUPABASE={enabled:false};\")'),'real browser release gate must disable production cloud before page scripts execute');
console.log('RC29.82/84 BROWSER CLOUD ISOLATION: PASS');
