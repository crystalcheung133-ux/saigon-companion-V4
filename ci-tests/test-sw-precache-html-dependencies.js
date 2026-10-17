const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const htmlFiles=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const localScripts=new Set();
for(const file of htmlFiles){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  for(const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)){
    const src=m[1].split('?')[0];
    if(!/^https?:\/\//i.test(src)) localScripts.add(src.replace(/^\.\//,''));
  }
}
const missing=[...localScripts].filter(f=>!sw.includes(`'./${f}'`));
assert.deepEqual(missing,[],`Local HTML scripts missing from SW precache: ${missing.join(', ')}`);
const asset=fs.readFileSync(path.join(root,'asset-config.js'),'utf8');
assert(asset.includes("splashMark:'logo-monogram-transparent.png'"),'Configured splash mark changed; update offline test');
assert(sw.includes('ASSET_CONFIG.branding.splashMark'),'Configured splash mark is not included in SW precache');
console.log(`SW PRECACHE HTML DEPENDENCIES: PASS — ${localScripts.size} local scripts + splash mark covered.`);
