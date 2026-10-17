/* Global Guide sync state: never interpret an empty journal as proof of cloud sync. */
(function(root){'use strict';
const css='#guideSyncGlobal{position:fixed;bottom:calc(88px + env(safe-area-inset-bottom,0px));left:12px;right:12px;max-width:420px;margin:auto;z-index:2147481999;background:#fff;color:#233047;border:1px solid #d8a04b;border-radius:14px;box-shadow:0 4px 24px #0003;padding:12px 14px;font:14px/1.4 system-ui,sans-serif}#guideSyncGlobal[hidden]{display:none!important}#guideSyncGlobal button{border:1px solid #9c7440;border-radius:8px;padding:5px 9px;background:#fff;color:#233047;cursor:pointer;margin-top:8px}';
function boot(){if(!root.GUIDE_SYNC?.getState)return;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const panel=document.createElement('section');panel.id='guideSyncGlobal';panel.hidden=true;panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');document.body.appendChild(panel);
let busy=false;
function render(){let s;try{s=root.GUIDE_SYNC.getState()}catch(e){s={status:'storage-error',lastError:String(e)}}
 panel.replaceChildren();const add=(tag,value)=>{const n=document.createElement(tag);n.textContent=value;panel.appendChild(n);return n};
 if(s.status==='storage-error'){panel.hidden=false;panel.dataset.state='storage-error';add('strong','Guide sync storage error');add('p','Cannot safely read saved sync records. Do not clear site data. Retry is disabled until storage is repaired.');return}
 if(!s.pending){panel.hidden=true;panel.dataset.state='idle';return}
 panel.hidden=false;panel.dataset.state=s.status;
 const failed=s.status==='failed',syncing=s.status==='syncing';
 add('strong',`Guide cloud sync · ${s.pending} pending change${s.pending===1?'':'s'}`);
 add('p',!s.configured?'Saved locally · Cloud sync unavailable':failed?'Sync failed · Saved locally':syncing?'Syncing…': 'Saved locally · Sync pending');
 if(s.lastError&&failed)add('p','Cloud confirmation failed. Your local edit is still pending.');
 if(s.configured&&!syncing){const b=add('button',failed?'Retry Guide sync':'Sync Guide now');b.type='button';b.disabled=busy;
 b.addEventListener('click',async()=>{if(busy)return;busy=true;b.disabled=true;try{await root.GUIDE_SYNC.retry()}catch(e){console.warn('Guide retry failed',e)}finally{busy=false;render()}})}
}
document.addEventListener('travelengine:guidesyncstatus',render);root.addEventListener('storage',e=>{if(e.key==='travelengine_guide_pending_v1')render()});root.addEventListener('pageshow',render);render();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(globalThis);
