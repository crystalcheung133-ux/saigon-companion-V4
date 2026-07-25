/* Vietnam capability upgrade: local Admin/Studio transaction shell. */
(function(root){'use strict';
 const K={mode:'ccmv-vn:admin:mode',draft:'ccmv-vn:admin:draft',pin:'ccmv-vn:admin:pin'}; const ADMIN='crystal';
 let baseline=null,dirty=false;
 const getFriend=()=>{try{return root.getFriend?.()||localStorage.getItem('saigon_friend')||'crystal'}catch(e){return 'crystal'}};
 const snapshot=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&!k.startsWith('ccmv-vn:admin:'))o[k]=localStorage.getItem(k);}return o};
 function restore(s){const keep=new Set(Object.keys(s||{}));for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&!k.startsWith('ccmv-vn:admin:')&&!keep.has(k))localStorage.removeItem(k)};Object.entries(s||{}).forEach(([k,v])=>localStorage.setItem(k,v));}
 function hash(v){let h=2166136261;for(const c of String(v))h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36)}
 function mode(){return sessionStorage.getItem(K.mode)||'read'}
 function setMode(v){sessionStorage.setItem(K.mode,v);document.body.dataset.adminMode=v;render();}
 function enter(){if(getFriend()!==ADMIN)return alert('Admin Mode is available to Crystal only.'); const saved=localStorage.getItem(K.pin);const p=prompt(saved?'Enter Admin PIN':'Create a 6-digit Admin PIN');if(!/^\d{6}$/.test(p||''))return alert('PIN must be 6 digits.');if(saved&&saved!==hash(p))return alert('Incorrect PIN.');if(!saved)localStorage.setItem(K.pin,hash(p));baseline=snapshot();dirty=false;setMode('studio');}
 function save(){baseline=snapshot();dirty=false;localStorage.removeItem(K.draft);render();}
 function discard(){if(baseline)restore(baseline);dirty=false;localStorage.removeItem(K.draft);location.reload();}
 function exit(){if(dirty&&!confirm('Discard unsaved changes and return to Read Mode?'))return;if(dirty&&baseline)restore(baseline);dirty=false;setMode('read');}
 function mark(){if(mode()!=='studio')return;dirty=true;localStorage.setItem(K.draft,JSON.stringify({at:new Date().toISOString()}));render();}
 function render(){let bar=document.getElementById('ccmvAdminBar');if(!bar){bar=document.createElement('div');bar.id='ccmvAdminBar';document.body.appendChild(bar)}const m=mode();bar.innerHTML=m==='studio'?`<strong>Studio Mode</strong><span>${dirty?'Pending Save':'Saved'}</span><button data-a="save">Save</button><button data-a="discard" ${dirty?'':'disabled'}>Discard</button><button data-a="exit">Read Mode</button>`:`<strong>Read Mode</strong><button data-a="enter">Admin</button><button data-a="export">Export Centre</button>`;bar.onclick=e=>{const a=e.target.dataset.a;if(a==='enter')enter();if(a==='save')save();if(a==='discard')discard();if(a==='exit')exit();if(a==='export')root.CCMV_EXPORT_CENTRE?.open()};document.body.dataset.adminMode=m;}
 const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){original.call(this,k,v);if(this===localStorage&&!String(k).startsWith('ccmv-vn:admin:'))queueMicrotask(mark)};
 addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});document.addEventListener('DOMContentLoaded',render);
 root.CCMV_ADMIN=Object.freeze({mode,markDirty:mark,isAdmin:()=>getFriend()===ADMIN});
})(globalThis);
