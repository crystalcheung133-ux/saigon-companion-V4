const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').resolve(__dirname,'..');
const ctx=vm.createContext({globalThis:{}});
vm.runInContext(fs.readFileSync(root+'/data.js','utf8'),ctx);
const links=vm.runInContext('DAY_LINKS',ctx);
const itinerary=vm.runInContext('ITINERARY_DATA',ctx);
let count=0;const bad=[];
for(const [guide,targets] of Object.entries(links))for(const [label,href] of targets){
 const match=href.match(/day\.html\?day=(\d+)(?:#(.+))?/);
 if(!match){bad.push([guide,href,'not a day URL']);continue;}
 const day=itinerary[match[1]];
 if(!day){bad.push([guide,href,'day missing']);continue;}
 const id=match[2];
 if(id&&!day.items.some(x=>x.id===id)){bad.push([guide,href,'anchor missing']);continue;}
 count++;
}
console.log('Guide day link audit:',count,'valid;',bad.length,'invalid');
if(bad.length)console.error(bad);
assert.equal(bad.length,0);
