/* export-runtime.js — VN 3.0 Production Export Centre. */
(function(root){
  'use strict';
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function isAllowed(){return !!(root.VN_ADMIN&&root.VN_ADMIN.isCrystal?.()&&root.VN_ADMIN.readMode?.());}
  function tripName(){return root.TRIP_CONFIG?.tripName||root.TRIP_CONFIG?.name||'Saigon Companion';}
  function partyLabel(k){const map=root.TRIP_CONFIG?.participants?.labels||root.TRIP_CONFIG?.parties||{};const p=map[k];return typeof p==='string'?p:(p?.label||p?.name||({christal:'Christal',crystal:'Crystal',mero:'Mero',vivian:'Vivian'}[k]||k));}
  function sourceItinerary(){return root.VN_PRESENTATION?.itineraryData||(typeof root.ITINERARY_DATA!=='undefined'&&root.ITINERARY_DATA)||{};}
  function sortedDays(){const source=sourceItinerary();return Object.keys(source).sort((a,b)=>Number(a)-Number(b)).map(k=>[k,source[k]||{}]);}
  function itineraryShareText(){
    const lines=[];
    sortedDays().forEach(([dayNo,day])=>{
      lines.push(`${day.kicker||`Day ${dayNo}`} — ${day.heading||day.title||''}`.trim());
      const drive=day.drive||{};
      if(drive.route) lines.push(`Drive: ${drive.route}${drive.distance?` · ${drive.distance}`:''}${drive.drivingTime?` · ${drive.drivingTime}`:''}`);
      (day.items||[]).forEach(item=>{
        lines.push(`${item.time?item.time+' ':''}${item.title||''}`.trim());
        (Array.isArray(item.details)?item.details:[]).forEach(detail=>lines.push(`  ${detail}`));
      });
      lines.push('');
    });
    return lines.join('\n').trim();
  }
  function close(){const m=document.getElementById('vnExportCentreModal');if(!m)return;m.classList.remove('show');m.setAttribute('aria-hidden','true');document.body.classList.remove('vn-export-open');}
  function build(){
    if(document.getElementById('vnExportCentreModal'))return;
    const m=document.createElement('div');m.id='vnExportCentreModal';m.className='vn-export-centre-modal';m.setAttribute('aria-hidden','true');
    m.innerHTML=`<section class="vn-export-centre-sheet" role="dialog" aria-modal="true" aria-labelledby="vnExportCentreTitle">
      <button type="button" class="vn-export-close" aria-label="Close Export Centre">×</button>
      <div class="vn-export-centre-head"><p class="vn-export-kicker">TRIP OUTPUTS</p><h2 id="vnExportCentreTitle">Export Trip</h2><p>Share through the iPhone or Android share sheet, or create a printable copy.</p></div>
      <div class="vn-export-list">
        <section class="vn-export-group" aria-labelledby="vnExportItineraryTitle">
          <div class="vn-export-group-head"><span class="vn-export-icon">🗓️</span><span><strong id="vnExportItineraryTitle">Itinerary</strong><small>Trip schedule, addresses and notes.</small></span></div>
          <div class="vn-export-group-actions">
            <button type="button" id="vnShareItinerary"><span aria-hidden="true">📤</span><strong>Share</strong></button>
            <button type="button" id="vnExportItinerary"><span aria-hidden="true">📄</span><strong>Printable</strong></button>
          </div>
        </section>
        <section class="vn-export-group" aria-labelledby="vnExportExpensesTitle">
          <div class="vn-export-group-head"><span class="vn-export-icon">🧾</span><span><strong id="vnExportExpensesTitle">Expenses</strong><small>Transactions, party totals and settlements.</small></span></div>
          <div class="vn-export-group-actions">
            <button type="button" id="vnShareExpenses"><span aria-hidden="true">📤</span><strong>Share</strong></button>
            <button type="button" id="vnExportExpenses"><span aria-hidden="true">📄</span><strong>Printable</strong></button>
          </div>
        </section>
        <button type="button" id="vnExportMemory" class="is-coming-soon" disabled><span class="vn-export-icon">📖</span><span><strong>Memory Book</strong><small>Coming Soon</small></span><em>SOON</em></button>
        <button type="button" id="vnExportReview" class="is-coming-soon" disabled><span class="vn-export-icon">⭐</span><span><strong>Trip Review</strong><small>Coming Soon</small></span><em>SOON</em></button>
      </div>
    </section>`;
    m.addEventListener('click',e=>{if(e.target===m)close();});
    m.querySelector('.vn-export-close').addEventListener('click',close);
    m.querySelector('#vnShareItinerary').addEventListener('click',shareItinerary);
    m.querySelector('#vnExportItinerary').addEventListener('click',exportItinerary);
    m.querySelector('#vnShareExpenses').addEventListener('click',shareExpenses);
    m.querySelector('#vnExportExpenses').addEventListener('click',exportExpenses);
    document.body.appendChild(m);
  }

  function syncPostTripOutputs(){
    ['vnExportMemory','vnExportReview'].forEach(id=>{
      const button=document.getElementById(id);
      if(button){button.disabled=true;button.classList.add('is-coming-soon');}
    });
  }

  function open(){if(!isAllowed())return;build();syncPostTripOutputs();const m=document.getElementById('vnExportCentreModal');m.classList.add('show');m.setAttribute('aria-hidden','false');document.body.classList.add('vn-export-open');}
  async function shareItinerary(){
    if(!isAllowed())return;
    const title=tripName();const text=itineraryShareText();if(!text)return alert('No itinerary data is available.');
    try{
      if(navigator.share){
        const filename=String(title).replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'')+'_Itinerary.txt';
        const file=new File([text],filename,{type:'text/plain'});
        if(navigator.canShare?.({files:[file]})) await navigator.share({title,text:`${title} itinerary`,files:[file]});
        else await navigator.share({title,text});
        return;
      }
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);alert('Itinerary copied. Paste it into WhatsApp, Mail or Messages.');return;}
      const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();alert('Itinerary copied. Paste it into WhatsApp, Mail or Messages.');
    }catch(error){if(error?.name!=='AbortError')alert('Sharing is not available right now. Use Printable Itinerary instead.');}
  }
  function popupDoc(title,body){
    const w=root.open('','_blank');if(!w){alert('Please allow pop-ups to create the PDF.');return null;}
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#24342c;background:#fff}.toolbar{position:sticky;top:0;z-index:5;display:flex;gap:10px;justify-content:center;padding:10px;background:#eef2ee;border-bottom:1px solid #d8dfda}.toolbar button{border:1px solid #bcc9c1;border-radius:999px;background:#fff;padding:9px 14px;font:600 14px inherit;color:#24342c}.toolbar .primary{background:#285844;color:#fff;border-color:#285844}main{max-width:820px;margin:auto;padding:18px}.cover{padding:6px 0 15px;border-bottom:2px solid #285844}.cover p,.section-kicker{margin:0 0 4px;font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:#68756f}.cover h1{margin:0;font-size:27px}.cover small{display:block;margin-top:6px;color:#68756f}.day{padding:18px 0 4px;break-before:page}.day:first-of-type{break-before:auto}.day h2{margin:0 0 10px;font-size:21px}.item{display:grid;grid-template-columns:72px 1fr;gap:10px;padding:8px 0;border-bottom:1px solid #e4e9e5;break-inside:avoid}.time{font-weight:750;color:#55705f;font-size:12px}.item h3{margin:0 0 3px;font-size:14px}.item p{margin:2px 0;font-size:11px;line-height:1.35}.report-section{margin-top:20px;break-inside:avoid}.summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.summary-grid>div{padding:12px;border:1px solid #dfe7e1;border-radius:12px}.summary-grid span{display:block;font-size:10px;color:#68756f}.summary-grid strong{display:block;margin-top:4px;font-size:16px}.settlement-list{margin:8px 0 0;padding-left:20px}.settlement-list li{margin:5px 0;font-size:12px}.transaction-list{display:grid;gap:10px}.expense-transaction{padding:12px;border:1px solid #dfe7e1;border-radius:13px;break-inside:avoid}.transaction-head{display:flex;justify-content:space-between;gap:12px}.transaction-head div{display:flex;gap:8px;color:#68756f;font-size:10px}.transaction-head strong{font-size:14px}.expense-transaction h3{margin:6px 0;font-size:14px}.transaction-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 12px;font-size:11px;line-height:1.35}.allocations{grid-column:1/-1;margin:2px 0 0;padding-left:17px}.report-total{display:flex;justify-content:space-between;align-items:center;padding:14px;border:2px solid #285844;border-radius:13px}.report-total strong{font-size:19px}.party-table{width:100%;border-collapse:collapse;font-size:11px}.party-table th,.party-table td{text-align:left;padding:8px;border-bottom:1px solid #dfe7e1}.party-table th{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#68756f}@media(max-width:600px){.summary-grid{grid-template-columns:1fr}.transaction-meta{grid-template-columns:1fr}}@media print{.toolbar{display:none}main{padding:0}}</style></head><body><div class="toolbar"><button onclick="window.close()">← Back to Export Centre</button><button class="primary" onclick="window.print()">Save as PDF</button></div><main>${body}</main></body></html>`);w.document.close();return w;
  }
  function exportItinerary(){
    if(!isAllowed())return;const days=sortedDays();if(!days.length)return alert('No itinerary data is available.');const title=tripName();
    const html=days.map(([k,d])=>{const items=(d.items||[]).map(i=>`<article class="item"><div class="time">${esc(i.time||'')}</div><div><h3>${esc(i.title||'')}</h3>${(i.details||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div></article>`).join('');return `<section class="day"><p class="section-kicker">${esc(d.kicker||`Day ${k}`)}</p><h2>${esc(d.heading||d.title||'')}</h2>${items}</section>`;}).join('');
    popupDoc(`${title} — Itinerary`,`<div class="cover"><p>CCMV VIETNAM COMPANION</p><h1>${esc(title)}</h1><small>Itinerary · Generated ${esc(new Date().toLocaleDateString())}</small></div>${html}`);
  }
  function readExpenses(){try{return JSON.parse(localStorage.getItem(root.STORAGE_CONFIG?.keys?.expenses||'ccmv_vietnam_expenses')||'[]')||[];}catch(_){return [];}}
  function expenseSummary(){
    const arr=readExpenses();const order=root.TRIP_CONFIG?.participants?.order||['christal','crystal','mero','vivian'];const spend=Object.fromEntries(order.map(k=>[k,0]));const balance=Object.fromEntries(order.map(k=>[k,0]));let total=0;
    arr.forEach(e=>{const amount=Number(e.total||0);total+=amount;balance[e.paidBy]=(balance[e.paidBy]||0)+amount;if(e.type==='personal'){const who=e.consumedBy||(e.split||[])[0]||e.paidBy;spend[who]=(spend[who]||0)+amount;balance[who]=(balance[who]||0)-amount;}else{const split=(e.split&&e.split.length)?e.split:[e.paidBy];split.forEach(k=>{const share=e.splitMode==='custom'&&e.shares?Number(e.shares[k]||0):amount/split.length;spend[k]=(spend[k]||0)+share;balance[k]=(balance[k]||0)-share;});}});return {arr,order,spend,balance,total};
  }

  function money(value){return `${Math.round(Number(value||0)).toLocaleString()} VND`;}
  function expenseDateParts(value){
    if(!value)return {date:'—',time:'—'};
    const d=new Date(value);if(Number.isNaN(d.getTime()))return {date:String(value),time:'—'};
    return {date:d.toLocaleDateString(),time:d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})};
  }
  function settlementsFromBalance(summary){
    const creditors=summary.order.map(k=>({party:k,amount:Math.max(0,Number(summary.balance[k]||0))})).filter(x=>x.amount>.01);
    const debtors=summary.order.map(k=>({party:k,amount:Math.max(0,-Number(summary.balance[k]||0))})).filter(x=>x.amount>.01);
    const rows=[];let i=0,j=0;
    while(i<debtors.length&&j<creditors.length){
      const amount=Math.min(debtors[i].amount,creditors[j].amount);
      if(amount>.01)rows.push({from:debtors[i].party,to:creditors[j].party,amount});
      debtors[i].amount-=amount;creditors[j].amount-=amount;
      if(debtors[i].amount<=.01)i++;if(creditors[j].amount<=.01)j++;
    }
    return rows;
  }
  function settlementText(summary){
    const rows=settlementsFromBalance(summary);
    return rows.length?rows.map(x=>`${partyLabel(x.from)} pays ${partyLabel(x.to)} ${money(x.amount)}`):['Everyone is settled.'];
  }

  function expenseShareText(){
    const s=expenseSummary();
    if(!s.arr.length) return '';
    const lines=[`${tripName()} — Expense Summary`,`Trip total: ${Math.round(s.total).toLocaleString()} VND`,''];
    s.order.forEach(k=>{
      const bal=Math.round(s.balance[k]||0);
      lines.push(`${partyLabel(k)}: ${bal>=0?'Receive':'Owes'} ${Math.abs(bal).toLocaleString()} VND`);
    });
    lines.push('','Transaction History');
    s.arr.slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).forEach(e=>{
      const who=e.type==='personal'?partyLabel(e.consumedBy||(e.split||[])[0]||e.paidBy):(e.split||[]).map(partyLabel).join(', ');
      lines.push(`${e.item||'Expense'} — ${Math.round(Number(e.total||0)).toLocaleString()} VND · Paid by ${partyLabel(e.paidBy)} · ${e.type==='personal'?`For ${who}`:`${e.splitMode||'equal'} split: ${who}`}`);
    });
    return lines.join('\n');
  }
  async function shareExpenses(){
    if(!isAllowed())return;
    const title=tripName();const text=expenseShareText();if(!text)return alert('No expense data to share yet.');
    try{
      if(navigator.share){
        const filename=String(title).replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'')+'_Expenses.txt';
        const file=new File([text],filename,{type:'text/plain'});
        if(navigator.canShare?.({files:[file]})) await navigator.share({title:`${title} expenses`,text:`${title} expense summary`,files:[file]});
        else await navigator.share({title:`${title} expenses`,text});
        return;
      }
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);alert('Expense summary copied. Paste it into WhatsApp, Mail or Messages.');return;}
      const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();alert('Expense summary copied. Paste it into WhatsApp, Mail or Messages.');
    }catch(error){if(error?.name!=='AbortError')alert('Sharing is not available right now. Use Printable Expenses instead.');}
  }

  function exportExpenses(){
    if(!isAllowed())return;
    const s=expenseSummary();if(!s.arr.length)return alert('No expense data to export yet.');
    const settlements=settlementsFromBalance(s);
    const settlementRows=(settlements.length?settlements.map(x=>`<li><strong>${esc(partyLabel(x.from))}</strong> pays <strong>${esc(partyLabel(x.to))}</strong> <b>${esc(money(x.amount))}</b></li>`):['<li><strong>Everyone is settled.</strong></li>']).join('');
    const partyRows=s.order.map(k=>{const bal=Number(s.balance[k]||0);return `<tr><td>${esc(partyLabel(k))}</td><td>${esc(money(s.spend[k]||0))}</td><td>${bal>=0?'Receives':'Owes'} ${esc(money(Math.abs(bal)))}</td></tr>`;}).join('');
    const transactionRows=s.arr.slice().sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))).map(e=>{
      const parts=expenseDateParts(e.createdAt);
      const personal=e.type==='personal';
      const split=(e.split&&e.split.length)?e.split:[e.paidBy];
      const mode=personal?'Personal':`${e.splitMode==='custom'?'Custom':'Equal'} shared`;
      let allocation='';
      if(personal){allocation=`<div><b>Consumed by:</b> ${esc(partyLabel(e.consumedBy||split[0]||e.paidBy))}</div>`;}
      else if(e.splitMode==='custom'&&e.shares){allocation=`<div><b>Split by:</b> ${esc(split.map(partyLabel).join(', '))}</div><ul class="allocations">${split.map(k=>`<li>${esc(partyLabel(k))}: ${esc(money(e.shares[k]||0))}</li>`).join('')}</ul>`;}
      else{allocation=`<div><b>Split by:</b> ${esc(split.map(partyLabel).join(', '))}</div>`;}
      return `<article class="expense-transaction"><div class="transaction-head"><div><span>${esc(parts.date)}</span><span>${esc(parts.time)}</span></div><strong>${esc(money(e.total||0))}</strong></div><h3>${esc(e.item||'Expense')}</h3><div class="transaction-meta"><div><b>Paid by:</b> ${esc(partyLabel(e.paidBy))}</div><div><b>Type:</b> ${esc(mode)}</div>${allocation}</div></article>`;
    }).join('');
    const body=`<div class="cover"><p>CCMV VIETNAM COMPANION</p><h1>Printable Expense Summary</h1><small>${esc(tripName())} · Generated ${esc(new Date().toLocaleString())}</small></div>
      <section class="report-section"><p class="section-kicker">TRIP SUMMARY</p><div class="summary-grid"><div><span>Total transactions</span><strong>${s.arr.length}</strong></div><div><span>Total spend</span><strong>${esc(money(s.total))}</strong></div><div><span>Parties</span><strong>${s.order.length}</strong></div></div></section>
      <section class="report-section"><p class="section-kicker">SETTLEMENT SUMMARY</p><ul class="settlement-list">${settlementRows}</ul></section>
      <section class="report-section"><p class="section-kicker">TRANSACTION HISTORY</p><div class="transaction-list">${transactionRows}</div></section>
      <section class="report-section report-total"><span>Total Spend</span><strong>${esc(money(s.total))}</strong></section>
      <section class="report-section"><p class="section-kicker">PER PARTY SUMMARY</p><table class="party-table"><thead><tr><th>Party</th><th>Allocated spend</th><th>Net position</th></tr></thead><tbody>${partyRows}</tbody></table></section>
      <section class="report-section"><p class="section-kicker">FINAL SETTLEMENT SUMMARY</p><ul class="settlement-list">${settlementRows}</ul></section>`;
    popupDoc(`${tripName()} — Printable Expense Summary`,body);
  }

  root.VN_EXPORT_CENTRE={open,close,shareItinerary,exportItinerary,shareExpenses,exportExpenses};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  document.addEventListener('ccmv:tripcompletionchange',syncPostTripOutputs);
})(globalThis);
