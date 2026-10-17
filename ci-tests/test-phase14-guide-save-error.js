const fs=require('fs'),assert=require('assert');
const guide=fs.readFileSync(require('path').join(__dirname,'../guide-runtime.js'),'utf8');
const sync=fs.readFileSync(require('path').join(__dirname,'../guide-sync-runtime.js'),'utf8');
assert(guide.includes('try{\n  GUIDE_AUTHORITY.save(key,patch);'),'Guide save must catch local write errors');
assert(guide.includes('data-guide-save-error'),'Guide save errors must be visible');
assert(guide.includes('your edits remain in this form'),'Form must remain open after failure');
assert(sync.includes('GUIDE_REMOTE_VERIFY_FAILED'),'Guide success requires read-back verification');
assert(/status:['"]unverified['"]/.test(sync),'Guide initial status must not be synced');
console.log('Phase14 Guide error UX and truthful status: PASS');
