// RC29.129 — third-party browser libraries are self-hosted, byte-exact, hash-pinned and precached.
const fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const release=JSON.parse(read('RELEASE.json'));
const vendored=release.vendored_assets||{};
const onDisk=fs.readdirSync(root).filter(f=>/^vendor-.*\.js$/.test(f)).sort();
assert.deepStrictEqual(onDisk,Object.keys(vendored).sort(),'vendor-*.js files must exactly match RELEASE.json vendored_assets');
for(const [name,meta] of Object.entries(vendored)){
  const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
  assert.equal(sha,meta.sha256,`${name}: content differs from pinned sha256 (vendor files must stay byte-exact)`);
  assert(meta.package&&meta.version&&meta.npm_tarball_integrity,`${name}: provenance incomplete`);
}
// 1) every page that used the Supabase SDK now points at the vendored file
const sdk='vendor-supabase-js-2.117.2.umd.js';
let count=0;
for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
  const s=read(f);
  for(const m of s.matchAll(/<script[^>]+src="([^"]*supabase-js[^"]*)"/gi)){count++;assert.equal(m[1],sdk,`${f}: Supabase SDK must load the vendored file`);}
}
assert(count>0,'No Supabase SDK references found');
// 2) no external script CDN remains in production html/js (vendor files themselves excluded)
const cdn=/https?:\/\/(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|code\.jquery\.com|ajax\.googleapis\.com)/i;
for(const f of fs.readdirSync(root).filter(f=>/\.(html|js)$/.test(f)&&!f.startsWith('vendor-'))){
  assert(!cdn.test(read(f)),`${f}: external script CDN reference must not return`);
}
// 3) lazy loaders point at vendored files
assert(read('documents.js').includes("s.src='vendor-pdfjs-3.11.174.min.js'"),'documents.js PDF.js loader must use vendored file');
assert(read('documents.js').includes("workerSrc='vendor-pdfjs-worker-3.11.174.min.js'"),'documents.js PDF.js worker must use vendored file');
assert(read('export-runtime.js').includes("script.src='vendor-html2pdf-0.10.1.bundle.min.js'"),'export-runtime.js html2pdf loader must use vendored file');
// 4) offline: SDK + PDF.js + worker are precached (html2pdf is runtime-cached on first use)
const sw=read('sw.js');
for(const f of [sdk,'vendor-pdfjs-3.11.174.min.js','vendor-pdfjs-worker-3.11.174.min.js']) assert(sw.includes(`'./${f}'`),`${f} missing from SW precache`);
// 5) the vendored SDK really executes and exposes createClient
const ctx={console,setTimeout,clearTimeout,TextEncoder,TextDecoder,URL,URLSearchParams};ctx.globalThis=ctx;ctx.self=ctx;ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(read(sdk),ctx);
assert.equal(typeof (ctx.supabase&&ctx.supabase.createClient),'function','vendored SDK must expose supabase.createClient');
assert(read(sdk).includes('2.117.2'),'vendored SDK must carry version 2.117.2');
console.log(`SELF-HOSTED LIBRARIES: PASS — ${Object.keys(vendored).length} hash-pinned vendor files, ${count} SDK page references, precache covered`);
