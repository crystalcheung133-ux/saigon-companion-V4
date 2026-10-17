const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('guide-sync-status-ui.js','utf8');
function el(tag){return {tag,children:[],dataset:{},hidden:false,disabled:false,textContent:'',appendChild(x){this.children.push(x);return x},replaceChildren(){this.children=[]},setAttribute(){},addEventListener(k,fn){this['on'+k]=fn}}}
let state={status:'failed',pending:2,configured:true,lastError:'offline'},panel,events={};
const ctx={console,document:{readyState:'complete',head:el('head'),body:{appendChild(x){panel=x}},createElement:el,addEventListener(k,fn){events[k]=fn}},addEventListener(){},GUIDE_SYNC:{getState(){return state},async retry(){state={status:'synced',pending:0,configured:true}}}};
ctx.globalThis=ctx;vm.runInNewContext(code,ctx);
assert.equal(panel.dataset.state,'failed');assert.equal(panel.hidden,false);assert(panel.children.some(x=>x.textContent==='Sync failed · Saved locally'));
const button=panel.children.find(x=>x.tag==='button');assert(button&&button.textContent==='Retry Guide sync');
(async()=>{await button.onclick();assert.equal(panel.hidden,true);state={status:'storage-error',pending:null};events['travelengine:guidesyncstatus']();assert.equal(panel.dataset.state,'storage-error');assert(!panel.children.some(x=>x.tag==='button'));state={status:'pending',pending:1,configured:false};events['travelengine:guidesyncstatus']();assert(panel.children.some(x=>x.textContent==='Saved locally · Cloud sync unavailable'));console.log('PHASE16 GUIDE GLOBAL STATUS UI: PASS')})().catch(e=>{console.error(e);process.exitCode=1});
