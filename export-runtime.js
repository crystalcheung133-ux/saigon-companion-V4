/* VN-C2B.1 — Crystal-only Export Centre. Additive to VN-C2A. */
(function(root){
  'use strict';
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function isAllowed(){return !!(root.VN_ADMIN&&root.VN_ADMIN.isCrystal&&root.VN_ADMIN.isCrystal()&&root.VN_ADMIN.readMode&&root.VN_ADMIN.readMode());}
  function partyLabel(k){const p=root.TRIP_CONFIG?.participants?.identities?.[k];return p?`${p.emoji||''} ${p.name||k}`.trim():k;}
  function close(){const m=document.getElementById('vnExportCentreModal');if(!m)return;m.classList.remove('show');m.setAttribute('aria-hidden','true');document.body.classList.remove('vn-export-open');}
  function build(){
    if(document.getElementById('vnExportCentreModal'))return;
    const m=document.createElement('div');m.id='vnExportCentreModal';m.className='vn-export-centre-modal';m.setAttribute('aria-hidden','true');
    m.innerHTML=`<section class="vn-export-centre-sheet" role="dialog" aria-modal="true" aria-labelledby="vnExportCentreTitle">
      <header class="vn-export-centre-head"><div><p class="vn-export-kicker">TRIP OUTPUTS</p><h2 id="vnExportCentreTitle">Export Centre</h2><p>Create a printable copy and save it as PDF.</p></div><button type="button" class="vn-export-close" aria-label="Close Export Centre">×</button></header>
      <div class="vn-export-list">
        <button type="button" id="vnExportItinerary"><span class="vn-export-icon">📄</span><span><strong>Itinerary PDF</strong><small>Open a clean printable itinerary.</small></span><b>›</b></button>
        <button type="button" id="vnExportExpenses"><span class="vn-export-icon">💰</span><span><strong>Expenses PDF</strong><small>Open expense history and settlement.</small></span><b>›</b></button>
        <button type="button" class="is-locked" disabled><span class="vn-export-icon">📖</span><span><strong>Memory Book</strong><small>Locked until Complete Trip.</small></span><em>LOCKED</em></button>
        <button type="button" class="is-locked" disabled><span class="vn-export-icon">⭐</span><span><strong>Trip Review</strong><small>Locked until Complete Trip.</small></span><em>LOCKED</em></button>
      </div>
    </section>`;
    m.addEventListener('click',e=>{if(e.target===m)close();});
    m.querySelector('.vn-export-close').addEventListener('click',close);
    m.querySelector('#vnExportItinerary').addEventListener('click',exportItinerary);
    m.querySelector('#vnExportExpenses').addEventListener('click',exportExpenses);
    document.body.appendChild(m);
  }
  function open(){if(!isAllowed())return;build();const m=document.getElementById('vnExportCentreModal');m.classList.add('show');m.setAttribute('aria-hidden','false');document.body.classList.add('vn-export-open');}
  function popupDoc(title,body){
    const w=root.open('','_blank');if(!w){alert('Please allow pop-ups to create the PDF.');return null;}
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#24342c;background:#fff}.toolbar{position:sticky;top:0;z-index:5;display:flex;gap:10px;justify-content:center;padding:10px;background:#eef2ee;border-bottom:1px solid #d8dfda}.toolbar button{border:1px solid #bcc9c1;border-radius:999px;background:#fff;padding:9px 14px;font:600 14px inherit;color:#24342c}.toolbar .primary{background:#285844;color:#fff;border-color:#285844}main{max-width:820px;margin:auto;padding:18px}.cover{padding:6px 0 15px;border-bottom:2px solid #285844}.cover p,.section-kicker{margin:0 0 4px;font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:#68756f}.cover h1{margin:0;font-size:27px}.cover small{display:block;margin-top:6px;color:#68756f}.day{padding:18px 0 4px;break-before:page}.day:first-of-type{break-before:auto}.day h2{margin:0 0 10px;font-size:21px}.item{display:grid;grid-template-columns:72px 1fr;gap:10px;padding:8px 0;border-bottom:1px solid #e4e9e5;break-inside:avoid}.time{font-weight:750;color:#55705f;font-size:12px}.item h3{margin:0 0 3px;font-size:14px}.item p{margin:2px 0;font-size:11px;line-height:1.35}.summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0}.card{border:1px solid #dce5df;border-radius:14px;padding:13px}.card h3{margin:0 0 8px;font-size:14px}.card p{display:flex;justify-content:space-between;gap:10px;margin:5px 0;font-size:11px}.total{font-size:20px;font-weight:800;color:#285844}table{width:100%;border-collapse:collapse;font-size:10px}th,td{text-align:left;vertical-align:top;padding:6px;border-bottom:1px solid #e4e9e5}th{background:#f4f7f5}@media print{.toolbar{display:none}main{padding:0}}@media(max-width:560px){.summary{grid-template-columns:1fr}}</style></head><body><div class="toolbar"><button onclick="window.close()">← Back to Export Centre</button><button class="primary" onclick="window.print()">Save as PDF</button></div><main>${body}</main></body></html>`);
    w.document.close();return w;
  }
  function exportItinerary(){
    if(!isAllowed())return;
    const source=(typeof ITINERARY_DATA!=='undefined'&&ITINERARY_DATA)||{};const keys=Object.keys(source).sort((a,b)=>Number(a)-Number(b));if(!keys.length)return alert('No itinerary data is available.');
    const trip=root.TRIP_CONFIG?.name||'Saigon Companion';
    const days=keys.map(k=>{const d=source[k]||{};const items=(d.items||[]).map(i=>`<article class="item"><div class="time">${esc(i.time||'')}</div><div><h3>${esc(i.title||'')}</h3>${(i.details||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div></article>`).join('');return `<section class="day"><p class="section-kicker">${esc(d.kicker||`Day ${k}`)}</p><h2>${esc(d.heading||d.title||'')}</h2>${items}</section>`;}).join('');
    popupDoc(`${trip} — Itinerary`,`<div class="cover"><p>CCMV VIETNAM COMPANION</p><h1>${esc(trip)}</h1><small>Itinerary · Generated ${esc(new Date().toLocaleDateString())}</small></div>${days}`);
  }
  function readExpenses(){try{return JSON.parse(localStorage.getItem(root.STORAGE_CONFIG?.keys?.expenses||'ccmv_vietnam_expenses')||'[]')||[];}catch(_){return [];}}
  function exportExpenses(){
    if(!isAllowed())return;const arr=readExpenses();if(!arr.length)return alert('No expense data to export yet.');
    const order=root.TRIP_CONFIG?.participants?.order||['christal','crystal','mero','vivian'];const spend=Object.fromEntries(order.map(k=>[k,0]));const balance=Object.fromEntries(order.map(k=>[k,0]));let total=0;
    arr.forEach(e=>{const amount=Number(e.total||0);total+=amount;balance[e.paidBy]=(balance[e.paidBy]||0)+amount;if(e.type==='personal'){const who=e.consumedBy||(e.split||[])[0]||e.paidBy;spend[who]=(spend[who]||0)+amount;balance[who]=(balance[who]||0)-amount;}else{const split=(e.split&&e.split.length)?e.split:[e.paidBy];split.forEach(k=>{const share=e.splitMode==='custom'&&e.shares?Number(e.shares[k]||0):amount/split.length;spend[k]=(spend[k]||0)+share;balance[k]=(balance[k]||0)-share;});}});
    const summary=`<div class="cover"><p>CCMV VIETNAM COMPANION</p><h1>Expense Summary</h1><small>Generated ${esc(new Date().toLocaleDateString())}</small></div><div class="summary"><div class="card"><h3>Trip Total</h3><div class="total">${Math.round(total).toLocaleString()} VND</div></div><div class="card"><h3>Personal Spend</h3>${order.map(k=>`<p><span>${esc(partyLabel(k))}</span><strong>${Math.round(spend[k]||0).toLocaleString()} VND</strong></p>`).join('')}</div><div class="card"><h3>Settlement</h3>${order.map(k=>{const v=balance[k]||0;return `<p><span>${esc(partyLabel(k))}</span><strong>${v>=0?'Receive':'Owes'} ${Math.abs(Math.round(v)).toLocaleString()} VND</strong></p>`}).join('')}</div></div>`;
    const rows=arr.slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).map(e=>`<tr><td>${esc(e.createdAt?new Date(e.createdAt).toLocaleString():'')}</td><td>${esc(e.item||'')}</td><td>${Math.round(Number(e.total||0)).toLocaleString()} VND</td><td>${esc(partyLabel(e.paidBy))}</td><td>${esc(e.type||'shared')}</td><td>${esc((e.split||[]).map(partyLabel).join(', '))}</td></tr>`).join('');
    popupDoc('Saigon Companion — Expenses',`${summary}<h2>Transaction History</h2><table><thead><tr><th>Date</th><th>Details</th><th>Total</th><th>Paid by</th><th>Type</th><th>Split / For</th></tr></thead><tbody>${rows}</tbody></table>`);
  }
  root.VN_EXPORT_CENTRE={open,close,exportItinerary,exportExpenses};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})(globalThis);
