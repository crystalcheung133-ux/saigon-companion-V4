const assert=require('assert'),fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('booking-sync-status-ui.js','utf8');
function element(tag){return {tag,hidden:false,dataset:{},children:[],setAttribute(){},appendChild(child){this.children.push(child);},replaceChildren(...items){this.children=items;},addEventListener(){},textContent:''};}
let events={};const panelRoot=element('body');const document={readyState:'complete',head:element('head'),body:panelRoot,createElement:element,addEventListener:(name,fn)=>{events[name]=fn;}};
let corrupt=true;const root={document,BOOKING_SYNC:{getStatus:()=>{if(corrupt)throw Error('BOOKING_PENDING_JOURNAL_CORRUPT');return {pending:{},enabled:true};}},addEventListener:()=>{},console:{error:()=>{}}};
vm.createContext(root);vm.runInContext(src,root);
const panel=panelRoot.children[0];
assert.equal(panel.hidden,false,'storage error must be visible');
assert.equal(panel.dataset.syncError,'true');
assert.match(panel.children.map(c=>c.textContent).join(' '),/Sync storage error/);
assert.match(panel.children.map(c=>c.textContent).join(' '),/Do not clear site data/);
assert.equal(panel.children.filter(c=>c.tag==='button').length,0,'unsafe retry not shown');
corrupt=false;events['travelengine:bookingsyncstatus']();
assert.equal(panel.hidden,true,'warning clears after journal becomes readable');
console.log('PHASE 12 STORAGE ERROR UI PASS');
