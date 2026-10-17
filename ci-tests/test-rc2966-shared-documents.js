const fs=require('fs'),assert=require('assert');
const cfg=fs.readFileSync('trip-config.js','utf8'),nav=fs.readFileSync('navigation-config.js','utf8'),sync=fs.readFileSync('sync-config.js','utf8'),html=fs.readFileSync('documents.html','utf8'),js=fs.readFileSync('documents.js','utf8');
['christal','crystal','mero','vivian'].forEach(x=>assert(cfg.includes(x)));
assert(nav.includes("documents: 'documents.html'"));assert(sync.includes("documents:'trip_documents'"));assert(sync.includes("documentsBucket:'trip-documents'"));
assert(html.includes('docFiledUnder')&&html.includes('editDocFiledUnder'));assert(js.includes('visibleFolders')&&js.includes('rootDocuments'));
assert(!html.includes('>ALL<'));assert(js.includes("filedUnder:$('docFiledUnder')?.value||'all'"));
console.log('RC29.69 SHARED DOCUMENTS INTEGRATION: PASS');
