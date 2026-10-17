const fs=require('fs');
const core=fs.readFileSync('core-runtime.js','utf8');
const guide=fs.readFileSync('guide-runtime.js','utf8');
const failures=[];
if(!guide.includes('function isGuideEditActive()')) failures.push('Guide edit-active state missing');
if(!guide.includes("modal?.classList.contains('show') && $('guideEditForm')")) failures.push('Guide edit-active state must require visible modal + editor form');
if(!guide.includes('if(isGuideEditActive())return false;')) failures.push('closeGuideModal must refuse accidental close while editing');
if(!core.includes("modal.id==='guideModal' && typeof window.isGuideEditActive==='function' && window.isGuideEditActive()")) failures.push('Backdrop close must respect Guide edit-active state');
if(!core.includes("guideModal?.classList.contains('show') && typeof window.isGuideEditActive==='function' && window.isGuideEditActive()")) failures.push('Escape close must respect Guide edit-active state');
if(!core.includes("target!=='guide' && guideModal?.classList.contains('show')" ) || !core.includes("typeof window.isGuideEditActive==='function' && window.isGuideEditActive()")) failures.push('Cross-module overlay close must respect Guide edit-active state');
if(!guide.includes('>Cancel</button>')) failures.push('Explicit Cancel path must remain available');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('PASS RC29.84 Guide edit-session protection contract');
