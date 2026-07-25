/* Local-first Expenses + Moments sync queue. Uses existing Supabase config/schema when supplied. */
(function(root){'use strict';
 const Q='ccmv-vn:sync:queue:v1',META='ccmv-vn:sync:meta:v1'; const domains={expenses:'expenses',moments:'moments_list'};let timer=0,applying=false;
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}};const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 function cfg(){return root.SUPABASE_CONFIG||root.CCMV_SUPABASE_CONFIG||null}
 function party(){const legacy=localStorage.getItem('saigon_friend')||'crystal';return 'party-'+legacy}
 function enqueue(domain,records){if(applying)return;let q=read(Q,[]);q.push({id:crypto.randomUUID?.()||Date.now()+'-'+Math.random(),domain,partyId:party(),records,createdAt:new Date().toISOString(),attempts:0});write(Q,q);schedule(100)}
 function tombstones(oldA,newA){const ids=new Set((newA||[]).map((x,i)=>x.id||x.expenseId||x.momentId||`${i}:${x.createdAt||''}`));return (oldA||[]).filter((x,i)=>!ids.has(x.id||x.expenseId||x.momentId||`${i}:${x.createdAt||''}`)).map(x=>({...x,deletedAt:new Date().toISOString(),_tombstone:true}))}
 let last={expenses:read('expenses',[]),moments:read('moments_list',[])};
 function scan(){Object.entries(domains).forEach(([d,k])=>{const now=read(k,[]);if(JSON.stringify(now)!==JSON.stringify(last[d])){enqueue(d,now.concat(tombstones(last[d],now)));last[d]=now}})}
 async function flush(){if(!navigator.onLine)return;const c=cfg();if(!c?.url||!c?.anonKey)return;let q=read(Q,[]);if(!q.length)return;const item=q[0],table=item.domain==='expenses'?(c.expensesTable||'expenses'):(c.momentsTable||'moments');try{const res=await fetch(`${c.url}/rest/v1/${table}`,{method:'POST',headers:{apikey:c.anonKey,Authorization:`Bearer ${c.anonKey}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify(item.records.map(r=>({...r,partyId:r.partyId||item.partyId,syncId:r.syncId||r.id||r.expenseId||r.momentId||item.id}))) });if(!res.ok)throw Error(String(res.status));q.shift();write(Q,q);write(META,{lastSuccessAt:new Date().toISOString(),pending:q.length});schedule(50)}catch(e){item.attempts++;item.lastError=String(e);q[0]=item;write(Q,q);schedule(Math.min(60000,1000*2**Math.min(item.attempts,6)))}}
 function schedule(ms=500){clearTimeout(timer);timer=setTimeout(flush,ms)}
 setInterval(scan,1000);addEventListener('online',()=>schedule(10));document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(10)});document.addEventListener('DOMContentLoaded',()=>schedule(10));
 root.CCMV_SYNC=Object.freeze({flush,queue:()=>read(Q,[]),status:()=>read(META,{pending:read(Q,[]).length})});
})(globalThis);
