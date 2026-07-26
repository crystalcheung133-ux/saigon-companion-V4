/* export-runtime.js — VN-C2B.1 Crystal-only Export Centre.
   Presentation/export owner only. Does not write trip, expense, moment, or canonical state. */
(function(root){
  'use strict';

  const FRIEND_ORDER=['christal','crystal','mero','vivian'];
  const FRIEND_FALLBACK={christal:'🧸 Christal',crystal:'👓 Crystal',mero:'✝️ Mero',vivian:'👟 Vivian'};

  function escapeHtml(value){
    return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function isAllowed(){
    return !!(root.VN_ADMIN?.isCrystal?.() && root.VN_ADMIN?.readMode?.());
  }
  function friendLabel(key){
    return root.VN_PRESENTATION?.friends?.[key] || FRIEND_FALLBACK[key] || key || 'Unknown';
  }
  function readExpenses(){
    try{
      const key=root.STORAGE_CONFIG?.keys?.expenses||'expenses';
      const value=JSON.parse(localStorage.getItem(key)||'[]');
      return Array.isArray(value)?value:[];
    }catch(_){return [];}
  }
  function money(value){return `${Math.round(Number(value)||0).toLocaleString('en-AU')} VND`;}
  function plainText(value){return String(value??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}

  function printDocument(title,bodyHtml){
    const win=root.open('','_blank');
    if(!win){alert('Please allow pop-ups to export this PDF.');return false;}
    const logo=new URL('logo-monogram-transparent.png',root.location.href).href;
    win.document.open();
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>
      @page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#2c211d;margin:0;font-size:11pt;line-height:1.45}header{display:flex;align-items:center;gap:14px;border-bottom:2px solid #9b6b49;padding-bottom:10px;margin-bottom:18px}header img{width:54px;height:54px;object-fit:contain}h1{font-size:23px;margin:0;color:#6f3f28}h2{font-size:17px;color:#6f3f28;margin:0 0 9px}h3{font-size:13px;margin:13px 0 5px}.muted{color:#766860;font-size:9.5pt}.day{break-after:page}.day:last-child{break-after:auto}.event{display:grid;grid-template-columns:78px 1fr;gap:10px;padding:8px 0;border-bottom:1px solid #e4d7ce}.time{font-weight:700;color:#7a4a30}.title{font-weight:700}.detail,.route{font-size:9.5pt;color:#5e514b;margin-top:3px}.route{font-style:italic}.summary-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px}.summary-card{border:1px solid #dccac0;border-radius:10px;padding:11px;background:#fffaf6}.summary-card strong{font-size:14px;color:#6f3f28}table{width:100%;border-collapse:collapse;font-size:9pt}th,td{text-align:left;vertical-align:top;border-bottom:1px solid #ded3cc;padding:7px 5px}th{background:#f7eee8;color:#5b3828}.locked{opacity:.55}.no-print{position:fixed;right:16px;top:16px}@media print{.no-print{display:none}}
    </style></head><body><button class="no-print" onclick="window.print()">Print / Save PDF</button><header><img src="${logo}" alt=""><div><h1>${escapeHtml(title)}</h1><div class="muted">CCMV Vietnam Companion · Generated ${escapeHtml(new Date().toLocaleString('en-AU'))}</div></div></header>${bodyHtml}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));<\/script></body></html>`);
    win.document.close();
    return true;
  }

  function exportItinerary(){
    if(!isAllowed())return;
    const days=root.ITINERARY_PRESENTATION?.views?.()||[];
    const itinerary=root.VN_PRESENTATION?.itineraryData||{};
    if(!days.length){alert('No itinerary data is available.');return;}
    const html=days.map(day=>{
      const data=itinerary[String(day.number)]||{};
      const events=(data.items||[]).map(item=>`<div class="event"><div class="time">${escapeHtml(item.time||'')}</div><div><div class="title">${escapeHtml(item.title||'')}</div>${item.details?`<div class="detail">${escapeHtml(plainText(item.details))}</div>`:''}${item.route?`<div class="route">Next: ${escapeHtml(plainText(item.route))}</div>`:''}</div></div>`).join('');
      return `<section class="day"><h2>${escapeHtml(day.emoji)} Day ${day.number} · ${escapeHtml(day.heading)}</h2><div class="muted">${escapeHtml(day.date)} · ${escapeHtml(day.weekday)}</div>${events||'<p>No itinerary items.</p>'}</section>`;
    }).join('');
    printDocument('Saigon 2026 · Itinerary',html);
  }

  function calculateExpenses(records){
    const spend=Object.fromEntries(FRIEND_ORDER.map(key=>[key,0]));
    const balance=Object.fromEntries(FRIEND_ORDER.map(key=>[key,0]));
    let total=0;
    records.forEach(record=>{
      const amount=Number(record.total)||0; total+=amount;
      if(!(record.paidBy in balance))balance[record.paidBy]=0;
      balance[record.paidBy]+=amount;
      if(record.type==='personal'){
        const consumer=record.consumedBy||record.split?.[0]||record.paidBy;
        spend[consumer]=(spend[consumer]||0)+amount;
        balance[consumer]=(balance[consumer]||0)-amount;
      }else{
        const split=record.split?.length?record.split:[record.paidBy];
        split.forEach(key=>{
          const share=record.splitMode==='custom'&&record.shares ? Number(record.shares[key])||0 : amount/split.length;
          spend[key]=(spend[key]||0)+share;
          balance[key]=(balance[key]||0)-share;
        });
      }
    });
    return {total,spend,balance};
  }

  function exportExpenses(){
    if(!isAllowed())return;
    const records=readExpenses();
    const summary=calculateExpenses(records);
    const cards=`<div class="summary-grid"><div class="summary-card"><div class="muted">TRIP TOTAL</div><strong>${money(summary.total)}</strong></div><div class="summary-card"><div class="muted">TRANSACTIONS</div><strong>${records.length}</strong></div></div>`;
    const personalRows=FRIEND_ORDER.map(key=>`<tr><td>${escapeHtml(friendLabel(key))}</td><td>${money(summary.spend[key])}</td><td>${summary.balance[key]>=0?'Receive':'Owes'} ${money(Math.abs(summary.balance[key]))}</td></tr>`).join('');
    const txRows=records.slice().sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))).map(record=>`<tr><td>${escapeHtml(record.createdAt?new Date(record.createdAt).toLocaleString('en-AU'):'')}</td><td>${escapeHtml(record.item||'')}</td><td>${money(record.total)}</td><td>${escapeHtml(friendLabel(record.paidBy))}</td><td>${record.type==='personal'?'Personal':'Shared'}</td><td>${escapeHtml((record.split||[]).map(friendLabel).join(', ') || friendLabel(record.consumedBy||record.paidBy))}</td></tr>`).join('');
    const html=`${cards}<h2>Personal Spend & Settlement</h2><table><thead><tr><th>Friend</th><th>Personal Spend</th><th>Settlement</th></tr></thead><tbody>${personalRows}</tbody></table><h2 style="margin-top:22px">Transaction History</h2>${records.length?`<table><thead><tr><th>Date</th><th>Item</th><th>Amount</th><th>Paid by</th><th>Type</th><th>Split / Consumed by</th></tr></thead><tbody>${txRows}</tbody></table>`:'<p>No expense transactions yet.</p>'}`;
    printDocument('Saigon 2026 · Expenses',html);
  }

  function build(){
    if(document.getElementById('vnExportCentreModal'))return;
    const modal=document.createElement('div');
    modal.id='vnExportCentreModal';
    modal.className='vn-export-centre-modal';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<section class="vn-export-centre-sheet" role="dialog" aria-modal="true" aria-labelledby="vnExportCentreTitle"><header class="vn-export-centre-head"><div><p class="vn-trip-studio-kicker">TRIP STUDIO</p><h2 id="vnExportCentreTitle">Export Centre</h2><p>Create trip documents without leaving Studio Mode.</p></div><button type="button" class="vn-export-centre-close" aria-label="Close Export Centre">×</button></header><div class="vn-export-centre-grid"><button type="button" class="vn-export-card" id="vnExportItinerary"><span class="vn-export-icon">🗓️</span><span><strong>Itinerary PDF</strong><small>Full day-by-day trip itinerary.</small></span><b>Export</b></button><button type="button" class="vn-export-card" id="vnExportExpenses"><span class="vn-export-icon">💸</span><span><strong>Expenses PDF</strong><small>Trip total, personal spend, settlement and transactions.</small></span><b>Export</b></button><button type="button" class="vn-export-card is-locked" disabled><span class="vn-export-icon">📖</span><span><strong>Memory Book</strong><small>Available after Complete Trip.</small></span><b>Locked</b></button><button type="button" class="vn-export-card is-locked" disabled><span class="vn-export-icon">✨</span><span><strong>Trip Review</strong><small>Available after Complete Trip.</small></span><b>Locked</b></button></div></section>`;
    document.body.appendChild(modal);
    modal.querySelector('.vn-export-centre-close').addEventListener('click',close);
    modal.addEventListener('click',event=>{if(event.target===modal)close();});
    modal.querySelector('#vnExportItinerary').addEventListener('click',exportItinerary);
    modal.querySelector('#vnExportExpenses').addEventListener('click',exportExpenses);
  }
  function open(){
    if(!isAllowed())return;
    build();
    const modal=document.getElementById('vnExportCentreModal');
    modal.classList.add('show');modal.setAttribute('aria-hidden','false');
    document.body.classList.add('vn-export-centre-open');
  }
  function close(){
    const modal=document.getElementById('vnExportCentreModal');
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
    document.body.classList.remove('vn-export-centre-open');
  }

  root.VN_EXPORT_CENTRE=Object.freeze({open,close,exportItinerary,exportExpenses,isAllowed});
})(globalThis);
