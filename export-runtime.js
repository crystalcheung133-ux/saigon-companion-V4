/* Travel Engine v1.0 — RC5.0 Native Share & Preparation Checklist. */
(function(){
  'use strict';
  const ADMIN_CONFIG=(window.TRIP_CONFIG&&TRIP_CONFIG.admin)||null;
  if(!ADMIN_CONFIG||!ADMIN_CONFIG.user){
    throw new Error('Export Centre requires TRIP_CONFIG.admin.user.');
  }
  const ADMIN_USER=ADMIN_CONFIG.user;
  const CHANGED_PLAN_KEY=(window.STORAGE_CONFIG&&STORAGE_CONFIG.keys.changedPlans)||'travel_engine_changed_plans_v1';
  function isExportAdmin(){return typeof getFriend==='function'&&getFriend()===ADMIN_USER&&typeof window.isAdminMode==='function'&&window.isAdminMode();}
  function escapeHtml(value){return String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function readObject(key){const value=window.STORAGE?STORAGE.local.readJSON(key,{}):{};return value&&typeof value==='object'?value:{};}
  /* RC15: resolved through the single canonical authority (validated saved
     override, or master) rather than reading the raw override key. */
  function currentItems(dayNo,day){
    const authority=window.ITINERARY_AUTHORITY;
    const saved=authority&&typeof authority.getDayOverrideItems==='function'?authority.getDayOverrideItems(dayNo):null;
    return Array.isArray(saved)?saved:(day.items||[]);
  }
  function returnToTripStudio(){
    closeTripExportCenter();
    if(typeof window.openTripStudioPanel==='function') window.openTripStudioPanel();
    else if(typeof window.openFriendModal==='function') window.openFriendModal();
  }
  window.returnToTripStudio=returnToTripStudio;

  function buildControl(){
    const host=document.getElementById('tripStudioExports') || document.querySelector('#mamaModal .guide-sheet');
    if(!host||document.getElementById('tripExportControl'))return;
    const section=document.createElement('section');section.id='tripExportControl';section.className='trip-export-control';
    section.innerHTML='<button class="trip-export-launch" type="button" onclick="openTripExportCenter()"><span><strong>Open Export Centre</strong><small>Itinerary and expenses are available anytime.</small></span><span aria-hidden="true">›</span></button>';
    host.appendChild(section);
  }
  function buildModal(){
    if(document.getElementById('tripExportModal'))return;
    const modal=document.createElement('div');modal.id='tripExportModal';modal.className='trip-export-modal';modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="trip-export-sheet" role="dialog" aria-modal="true" aria-labelledby="tripExportTitle"><button class="trip-export-close" type="button" onclick="returnToTripStudio()" aria-label="Close">×</button><p class="kicker">TRIP OUTPUTS</p><h2 id="tripExportTitle">Export Trip</h2><p class="lead">Share through the iPhone or Android share sheet, or create a printable copy.</p><div class="trip-export-list"><section class="trip-export-group" aria-labelledby="tripExportItineraryTitle"><div class="trip-export-group-head"><span class="trip-export-icon">🗓️</span><span><strong id="tripExportItineraryTitle">Itinerary</strong><small>Schedule, addresses and notes.</small></span></div><div class="trip-export-group-actions"><button type="button" onclick="shareItineraryNative()"><span aria-hidden="true">📤</span><strong>Share</strong></button><button type="button" onclick="exportFinalItinerary()"><span aria-hidden="true">📄</span><strong>Printable</strong></button></div></section><section class="trip-export-group" aria-labelledby="tripExportExpensesTitle"><div class="trip-export-group-head"><span class="trip-export-icon">🧾</span><span><strong id="tripExportExpensesTitle">Expenses</strong><small>One expense summary for transactions, party totals and settlements.</small></span></div><div class="trip-export-group-actions"><button type="button" onclick="openExpenseSummaryFromExport()"><span aria-hidden="true">📤</span><strong>Open Summary</strong></button></div></section><button type="button" class="coming-soon" disabled><span class="trip-export-icon">📖</span><span><strong>Memory Book</strong><small>Coming Soon</small></span></button></div></div>`;
    modal.addEventListener('click',event=>{if(event.target===modal)returnToTripStudio();});document.body.appendChild(modal);
  }
  function render(){buildControl();buildModal();const control=document.getElementById('tripExportControl');if(control)control.hidden=!isExportAdmin();if(!isExportAdmin())closeTripExportCenter();}
  window.openTripExportCenter=function(){if(!isExportAdmin())return alert('Enter Admin Mode to export the trip.');if(typeof closeFriendModal==='function')closeFriendModal();buildModal();CCMV_MODAL.setOpen('tripExportModal',true,{openClass:'open'});};
  window.closeTripExportCenter=function(){CCMV_MODAL.setOpen('tripExportModal',false,{openClass:'open'});};
  window.openExpenseSummaryFromExport=function(){if(!isExportAdmin())return alert('Enter Admin Mode to export the trip.');closeTripExportCenter();if(typeof window.openExpenseShareSummary==='function')window.openExpenseShareSummary();else alert('Expense summary is not available on this page.');};
  window.exportExpenseSummary=function(){if(!isExportAdmin())return alert('Enter Admin Mode to export the trip.');if(typeof window.exportExpenseData!=='function')return alert('Expense export is not available on this page.');window.exportExpenseData();returnToTripStudio();};

  function itineraryShareText(){
    const source=GenerationSelectionAdapter.view('export').itinerary;
    const days=Object.keys(source).sort((a,b)=>Number(a)-Number(b));
    const changedPlans=readObject(CHANGED_PLAN_KEY);
    const lines=[];
    days.forEach(dayNo=>{
      const day=source[dayNo]||{};
      lines.push(`${day.kicker||`Day ${dayNo}`} — ${day.heading||day.title||''}`);
      const drive=day.drive||{};
      if(drive.route) lines.push(`Drive: ${drive.route}${drive.distance?` · ${drive.distance}`:''}${drive.drivingTime?` · ${drive.drivingTime}`:''}`);
      currentItems(dayNo,day).forEach(item=>{
        lines.push(`${item.time?item.time+' ':''}${item.title||''}`.trim());
        (Array.isArray(item.details)?item.details:[]).forEach(detail=>lines.push(`  ${detail}`));
        const changed=changedPlans[String(item.id||'')];
        if(changed&&changed.instead) lines.push(`  Changed plan: ${changed.instead}`);
      });
      lines.push('');
    });
    return lines.join('\n').trim();
  }
  window.shareItineraryNative=async function(){
    if(!isExportAdmin())return alert('Enter Admin Mode to share the trip.');
    const title=(window.TRIP_CONFIG&&TRIP_CONFIG.tripName)||'Trip Itinerary';
    const text=itineraryShareText();
    if(!text)return alert('No itinerary data is available.');
    try{
      if(navigator.share){
        const filename=String(title).replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'')+'_Itinerary.txt';
        const file=new File([text],filename,{type:'text/plain'});
        if(navigator.canShare&&navigator.canShare({files:[file]})) await navigator.share({title,text:`${title} itinerary`,files:[file]});
        else await navigator.share({title,text});
        returnToTripStudio();
        return;
      }
      if(navigator.clipboard&&navigator.clipboard.writeText){
        await navigator.clipboard.writeText(text);
        alert('Itinerary copied. Paste it into WhatsApp, Mail or Messages.');
        returnToTripStudio();
        return;
      }
      const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();alert('Itinerary copied. Paste it into WhatsApp, Mail or Messages.');returnToTripStudio();
    }catch(error){
      if(error&&error.name==='AbortError')return;
      alert('Sharing is not available right now. Use Printable Itinerary instead.');
    }
  };

  window.exportFinalItinerary=function(){
    if(!isExportAdmin())return alert('Enter Admin Mode to export the trip.');
    const source=GenerationSelectionAdapter.view('export').itinerary;const days=Object.keys(source).sort((a,b)=>Number(a)-Number(b));if(!days.length)return alert('No itinerary data is available.');
    const changedPlans=readObject(CHANGED_PLAN_KEY);const title=(window.TRIP_CONFIG&&TRIP_CONFIG.tripName)||'Trip Itinerary';
    const dayHtml=days.map(dayNo=>{const day=source[dayNo],drive=day.drive||{};const items=currentItems(dayNo,day).map(item=>{const changed=changedPlans[String(item.id||'')];const details=Array.isArray(item.details)?item.details:[];const changeHtml=changed?`<div class="change"><strong>Changed plan</strong>${changed.reason?`<p><b>Why:</b> ${escapeHtml(changed.reason)}</p>`:''}${changed.instead?`<p><b>Went instead:</b> ${escapeHtml(changed.instead)}</p>`:''}</div>`:'';return `<article><div class="time">${escapeHtml(item.time||'')}</div><div><h3>${escapeHtml(item.title||'')}</h3>${details.map(detail=>`<p>${escapeHtml(detail)}</p>`).join('')}${changeHtml}</div></article>`;}).join('');return `<section class="day"><header><p>${escapeHtml(day.kicker||`Day ${dayNo}`)}</p><h2>${escapeHtml(day.heading||day.title||'')}</h2></header>${drive.route?`<div class="drive"><strong>Today’s Drive</strong><span>${escapeHtml(drive.route)}</span>${drive.distance?`<small>${escapeHtml(drive.distance)}${drive.drivingTime?' · '+escapeHtml(drive.drivingTime):''}</small>`:''}</div>`:''}${items}</section>`;}).join('');
    const popup=window.open('','_blank');if(!popup)return alert('Please allow pop-ups to open the itinerary.');
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} — Shareable Itinerary</title><style>@page{size:A4;margin:11mm}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#24342c;background:#fff}.toolbar{position:sticky;top:0;z-index:5;display:flex;gap:10px;justify-content:center;padding:10px;background:#eef2ee;border-bottom:1px solid #d8dfda}.toolbar button{border:1px solid #bcc9c1;border-radius:999px;background:#fff;padding:9px 14px;font:600 14px inherit;color:#24342c}.toolbar .primary{background:#24342c;color:#fff;border-color:#24342c}main{max-width:820px;margin:auto;padding:0 18px 24px}.cover{padding:20px 0 15px;border-bottom:2px solid #24342c}.cover p,.day header p{margin:0 0 4px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#68756f}.cover h1{margin:0;font-size:27px}.cover small{display:block;margin-top:5px;color:#68756f;font-size:11px}.day{padding:17px 0 5px;break-before:page}.day:first-of-type{break-before:auto}.day header{margin-bottom:9px}.day h2{margin:0;font-size:21px}.drive{display:grid;gap:2px;padding:8px 10px;margin-bottom:6px;border-left:3px solid #789181;background:#f5f7f4;font-size:12px}.drive small{color:#68756f}article{display:grid;grid-template-columns:66px 1fr;gap:10px;padding:7px 0;border-bottom:1px solid #e4e9e5;break-inside:avoid}.time{font-weight:700;color:#55705f;font-size:12px;padding-top:1px}article h3{margin:0 0 2px;font-size:14px}article p{margin:1px 0;line-height:1.28;font-size:11px}.change{margin-top:5px;padding:5px 7px;border-left:3px solid #c47a34;background:#fff7ed}.change strong{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#8b4c18}.change p{font-size:11px}@media print{.toolbar{display:none}main{padding:0}.day{padding-top:12px}}</style></head><body><div class="toolbar"><button type="button" onclick="goBack()">← Back to Companion</button><button class="primary" type="button" onclick="window.print()">Save as PDF</button></div><main><div class="cover"><p>TRAVEL ENGINE</p><h1>${escapeHtml(title)}</h1><small>Shareable Itinerary · Generated ${escapeHtml(new Date().toLocaleDateString())}</small></div>${dayHtml}</main><script>function goBack(){if(window.opener&&!window.opener.closed){window.opener.focus();window.close();setTimeout(()=>{if(!window.closed)history.back()},120)}else{history.back()}}<\/script></body></html>`);popup.document.close();returnToTripStudio();
  };
  document.addEventListener('DOMContentLoaded',render);document.addEventListener('travelengine:adminmodechange',render);document.addEventListener('travelengine:friendchange',render);

  /* Expenses Share Summary - checkpoint-aware.
     Lifetime spending always includes every real expense.
     Current settlement includes only expenses after the latest Settle to here checkpoint.
     Final Settlement is therefore never allowed to resurrect already-settled history. */
  function expenseParticipantOrder(){return (window.TRIP_CONFIG&&TRIP_CONFIG.participants&&TRIP_CONFIG.participants.order)||Object.keys((window.TRIP_CONFIG&&TRIP_CONFIG.participants&&TRIP_CONFIG.participants.identities)||{});}
  function expenseIdentity(k){const identities=(window.TRIP_CONFIG&&TRIP_CONFIG.participants&&TRIP_CONFIG.participants.identities)||{};return identities[k]||null;}
  function expenseLabelFor(k){const id=expenseIdentity(k);return id?`${id.code} · ${id.name}`:(k||'');}
  function expenseNameFor(k){const id=expenseIdentity(k);return id?id.name:(k||'');}
  function readExpensesRaw(){try{return (window.STORAGE&&window.STORAGE_CONFIG)?STORAGE.local.readJSON(STORAGE_CONFIG.keys.expenses,[]):[];}catch(error){return [];}}
  function isExpenseCheckpoint(e){return e&&e.type==='settlement_checkpoint';}
  function realExpenses(records){return (records||[]).filter(e=>e&&!isExpenseCheckpoint(e));}
  function latestExpenseCheckpoint(records){return (records||[]).filter(isExpenseCheckpoint).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]||null;}
  function expenseCurrency(e){return String(e.currency||(window.MONEY&&MONEY.getTripCurrency&&MONEY.getTripCurrency().code)||'').toUpperCase();}
  function homeCurrency(){return String((window.MONEY&&MONEY.getHomeCurrency&&MONEY.getHomeCurrency())||'AUD').toUpperCase();}
  function homeAmount(e){
    if(Number.isFinite(Number(e.homeTotal)))return Number(e.homeTotal);
    const total=Number(e.total||0),code=expenseCurrency(e),home=homeCurrency();
    if(code===home)return total;
    if(Number(e.fxRate)>0)return total*Number(e.fxRate);
    try{const rate=MONEY.readCachedRate()?.rate;if(rate>0)return MONEY.convert(total,rate);}catch(_){}
    return 0;
  }
  function expensePayerContributions(e){
    if(e&&e.payerContributions&&typeof e.payerContributions==='object'&&Object.keys(e.payerContributions).length)return e.payerContributions;
    return e&&e.paidBy?{[e.paidBy]:Number(e.total||0)}:{};
  }
  function expensePayerLabel(e){return Object.keys(expensePayerContributions(e)).map(expenseNameFor).join(' + ');}
  function originalShares(e){
    const total=Number(e.total||0);
    if(e.type==='personal'){const who=e.consumedBy||((e.split||[])[0])||e.paidBy;return {[who]:total};}
    const split=(e.split&&e.split.length)?e.split:[e.paidBy];
    if(e.splitMode==='custom'&&e.shares){const out={};split.forEach(k=>out[k]=Number(e.shares[k]||0));return out;}
    const each=split.length?total/split.length:0;return Object.fromEntries(split.map(k=>[k,each]));
  }
  function homeShares(e){
    const raw=originalShares(e),total=Number(e.total||0),home=homeAmount(e);
    if(!total)return Object.fromEntries(Object.keys(raw).map(k=>[k,0]));
    return Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,home*(Number(v||0)/total)]));
  }
  function expenseSummary(records){
    const order=expenseParticipantOrder(),arr=realExpenses(records);
    const paid=Object.fromEntries(order.map(k=>[k,0])),spend=Object.fromEntries(order.map(k=>[k,0])),balance=Object.fromEntries(order.map(k=>[k,0]));
    let total=0;
    arr.forEach(e=>{
      const amount=homeAmount(e);total+=amount;
      const payerParts=expensePayerContributions(e),rawTotal=Number(e.total||0)||1;
      Object.entries(payerParts).forEach(([k,v])=>{if(!(k in paid)){paid[k]=0;spend[k]=0;balance[k]=0;}const homePaid=amount*(Number(v||0)/rawTotal);paid[k]+=homePaid;balance[k]+=homePaid;});
      Object.entries(homeShares(e)).forEach(([k,v])=>{if(!(k in spend)){spend[k]=0;paid[k]=0;balance[k]=0;}spend[k]+=Number(v||0);balance[k]-=Number(v||0);});
    });
    return {order,arr,paid,spend,balance,total};
  }
  function expenseReportModel(){
    const raw=readExpensesRaw(),all=realExpenses(raw),checkpoint=latestExpenseCheckpoint(raw);
    const through=checkpoint?String(checkpoint.settledThroughAt||checkpoint.createdAt||''):'';
    const current=checkpoint?all.filter(e=>String(e.createdAt||'')>through):all.slice();
    const settled=checkpoint?all.filter(e=>String(e.createdAt||'')<=through):[];
    return {raw,all,current,settled,checkpoint,lifetime:expenseSummary(all),currentSummary:expenseSummary(current)};
  }
  function expenseSettlements(summary){
    const creditors=summary.order.map(k=>({party:k,amount:Math.max(0,Number(summary.balance[k]||0))})).filter(x=>x.amount>.01);
    const debtors=summary.order.map(k=>({party:k,amount:Math.max(0,-Number(summary.balance[k]||0))})).filter(x=>x.amount>.01);
    const rows=[];let i=0,j=0;
    while(i<debtors.length&&j<creditors.length){const amount=Math.min(debtors[i].amount,creditors[j].amount);if(amount>.01)rows.push({from:debtors[i].party,to:creditors[j].party,amount});debtors[i].amount-=amount;creditors[j].amount-=amount;if(debtors[i].amount<=.01)i++;if(creditors[j].amount<=.01)j++;}
    return rows;
  }
  function money(v,code=homeCurrency()){return `${Number(v||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ${code}`;}
  function originalMoney(e){return money(Number(e.total||0),expenseCurrency(e));}
  function expenseDate(e){const d=new Date(e.createdAt||e.date||Date.now());return Number.isNaN(d.getTime())?'':d.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});}
  function splitDescription(e){
    if(e.type==='personal')return `Personal - ${expenseNameFor(e.consumedBy||((e.split||[])[0])||e.paidBy)}`;
    if(e.splitMode==='custom'&&e.shares)return Object.entries(originalShares(e)).map(([k,v])=>`${expenseNameFor(k)} ${money(v,expenseCurrency(e))}`).join(' · ');
    return `Equal - ${((e.split&&e.split.length)?e.split:[e.paidBy]).map(expenseNameFor).join(', ')}`;
  }
  function escapeXml(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function safeFileBase(){return String((window.TRIP_CONFIG&&TRIP_CONFIG.tripName)||'Vietnam Trip').replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'');}
  async function shareGeneratedFile(file,title,text){
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({title,text,files:[file]});return true;}
    const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return false;
  }
  function expenseReportHtml(model){
    const title=(window.TRIP_CONFIG&&TRIP_CONFIG.tripName)||'Vietnam Trip';
    const settlements=expenseSettlements(model.currentSummary);
    const checkpointNote=model.checkpoint?`Settled to ${escapeHtml(expenseDate(model.checkpoint))}. Final Settlement below covers only transactions after this checkpoint.`:'No settlement checkpoint yet. Final Settlement covers the whole trip.';
    const lifetimeRows=model.lifetime.order.map(k=>`<tr><td><strong>${escapeHtml(expenseNameFor(k))}</strong></td><td>${escapeHtml(money(model.lifetime.paid[k]))}</td><td>${escapeHtml(money(model.lifetime.spend[k]))}</td><td>${escapeHtml(money(model.lifetime.balance[k]))}</td></tr>`).join('');
    const currentRows=model.currentSummary.order.map(k=>`<tr><td><strong>${escapeHtml(expenseNameFor(k))}</strong></td><td>${escapeHtml(money(model.currentSummary.paid[k]))}</td><td>${escapeHtml(money(model.currentSummary.spend[k]))}</td><td>${escapeHtml(money(model.currentSummary.balance[k]))}</td></tr>`).join('');
    const settlementRows=settlements.length?settlements.map(x=>`<div class="settlement-row"><strong>${escapeHtml(expenseNameFor(x.from))} → ${escapeHtml(expenseNameFor(x.to))} · ${escapeHtml(money(x.amount))}</strong></div>`).join(''):'<div class="settlement-row"><strong>Everyone is settled.</strong></div>';
    function tx(e,status){
      const home=homeAmount(e),dual=expenseCurrency(e)!==homeCurrency()?`${originalMoney(e)} ≈ ${money(home)}`:money(home);
      return `<article class="tx"><div class="tx-top"><span>${escapeHtml(expenseDate(e))}</span><span class="status">${status}</span></div><h3><strong>${escapeHtml(e.item||'Expense')}</strong></h3><div class="amount">${escapeHtml(dual)}</div><div class="meta"><div>💳 Paid by <strong>${escapeHtml(expensePayerLabel(e))}</strong></div><div>👥 Split: ${escapeHtml(splitDescription(e))}</div><div>✍️ Entered by: ${escapeHtml(expenseNameFor(e.createdBy||e.enteredBy||e.paidBy))}</div></div></article>`;
    }
    const currentTx=model.current.slice().sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))).map(e=>tx(e,'CURRENT')).join('');
    const settledTx=model.settled.slice().sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))).map(e=>tx(e,'SETTLED')).join('');
    return `<div class="report">
      <header><div class="emoji">🇻🇳 🧾</div><p>VIETNAM COMPANION</p><h1>${escapeHtml(title)} Expense Statement</h1><small>Generated ${escapeHtml(new Date().toLocaleString())}</small></header>
      <section><h2><strong>📊 SPENDING SUMMARY - LIFETIME</strong></h2><p class="note">Whole-trip record. Settle to here never removes historical spending.</p><div class="hero-total"><span>Trip total</span><strong>${escapeHtml(money(model.lifetime.total))}</strong></div><table><thead><tr><th>Traveller</th><th>Paid</th><th>Share</th><th>Net</th></tr></thead><tbody>${lifetimeRows}</tbody></table></section>
      <section><h2><strong>🧭 CURRENT SETTLEMENT PERIOD</strong></h2><p class="note">${escapeHtml(checkpointNote)}</p><div class="hero-total"><span>Current-period spend</span><strong>${escapeHtml(money(model.currentSummary.total))}</strong></div><table><thead><tr><th>Traveller</th><th>Paid</th><th>Share</th><th>Net</th></tr></thead><tbody>${currentRows}</tbody></table></section>
      <section><h2><strong>🤝 FINAL SETTLEMENT</strong></h2>${settlementRows}</section>
      <section><h2><strong>🧾 CURRENT TRANSACTIONS</strong></h2>${currentTx||'<p class="note">No transactions since the latest settlement checkpoint.</p>'}</section>
      ${model.settled.length?`<section><h2><strong>✓ SETTLED HISTORY</strong></h2><p class="note">Already covered by Settle to here. Included for record only, not in Final Settlement.</p>${settledTx}</section>`:''}
    </div>`;
  }
  function expenseReportCss(){return `*{box-sizing:border-box}body{margin:0;background:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Apple Color Emoji","Segoe UI Emoji",sans-serif;color:#302820}.report{width:760px;padding:34px 38px;background:#fff}header{padding:0 0 22px;border-bottom:3px solid #4f9f6f}.emoji{font-size:26px}header p{margin:8px 0 4px;font-size:10px;font-weight:800;letter-spacing:.18em;color:#6c766f}header h1{margin:0;font-size:28px;line-height:1.1}header small{display:block;margin-top:8px;color:#7c746c}section{margin-top:24px;break-inside:avoid}h2{margin:0 0 10px;font-size:16px}p.note{margin:0 0 12px;font-size:11px;line-height:1.45;color:#6f675f}.hero-total{display:flex;justify-content:space-between;align-items:end;padding:12px 14px;border-radius:14px;background:#f1f8f2;margin-bottom:10px}.hero-total span{font-size:11px}.hero-total strong{font-size:18px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{padding:8px 6px;border-bottom:1px solid #e5ddd3;text-align:right}th:first-child,td:first-child{text-align:left}.settlement-row{padding:11px 13px;margin:7px 0;border-radius:12px;background:#eef7ef;border:1px solid #cfe4d2;font-size:13px}.tx{padding:12px 14px;margin:9px 0;border:1px solid #e2d8cb;border-radius:14px;break-inside:avoid}.tx-top{display:flex;justify-content:space-between;font-size:10px;color:#7a7168}.status{font-weight:800;letter-spacing:.08em}.tx h3{margin:5px 0 3px;font-size:14px}.amount{font-size:12px;font-weight:750;color:#4b6f58}.meta{display:grid;gap:3px;margin-top:7px;font-size:11px;line-height:1.4}`;}
  function buildExcelXml(model){
    const settlements=expenseSettlements(model.currentSummary);
    const rows=[];
    const row=cells=>`<Row>${cells.map(v=>`<Cell><Data ss:Type="${typeof v==='number'?'Number':'String'}">${escapeXml(v)}</Data></Cell>`).join('')}</Row>`;
    rows.push(row(['VIETNAM COMPANION EXPENSE SUMMARY']),row(['Lifetime Trip Total',model.lifetime.total,homeCurrency()]),row([]),row(['LIFETIME SUMMARY']),row(['Traveller','Paid','Share','Net']));
    model.lifetime.order.forEach(k=>rows.push(row([expenseNameFor(k),model.lifetime.paid[k],model.lifetime.spend[k],model.lifetime.balance[k]])));
    rows.push(row([]),row(['CURRENT SETTLEMENT PERIOD']),row(['Settled through',model.checkpoint?expenseDate(model.checkpoint):'No checkpoint']),row(['Traveller','Paid','Share','Net']));
    model.currentSummary.order.forEach(k=>rows.push(row([expenseNameFor(k),model.currentSummary.paid[k],model.currentSummary.spend[k],model.currentSummary.balance[k]])));
    rows.push(row([]),row(['FINAL SETTLEMENT']),row(['From','To','Amount',homeCurrency()]));
    (settlements.length?settlements:[{from:'Everyone',to:'Settled',amount:0}]).forEach(x=>rows.push(row([expenseNameFor(x.from),expenseNameFor(x.to),x.amount,homeCurrency()])));
    rows.push(row([]),row(['TRANSACTION HISTORY']),row(['Status','Date','Title','Original Amount','Currency','Home Amount',homeCurrency(),'Paid By','Split','Entered By']));
    const through=model.checkpoint?String(model.checkpoint.settledThroughAt||model.checkpoint.createdAt||''):'';
    model.all.slice().sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))).forEach(e=>rows.push(row([model.checkpoint&&String(e.createdAt||'')<=through?'SETTLED':'CURRENT',expenseDate(e),e.item||'Expense',Number(e.total||0),expenseCurrency(e),homeAmount(e),homeCurrency(),expensePayerLabel(e),splitDescription(e),expenseNameFor(e.createdBy||e.enteredBy||e.paidBy)])));
    return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Expense Summary"><Table>${rows.join('')}</Table></Worksheet></Workbook>`;
  }
  function ensureHtml2Pdf(){
    if(window.html2pdf)return Promise.resolve();
    return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='vendor-html2pdf-0.10.1.bundle.min.js';script.onload=resolve;script.onerror=()=>reject(new Error('PDF generator unavailable'));document.head.appendChild(script);});
  }
  function ensureExpensePreviewStyles(){
    if(document.getElementById('expensePreviewStyles'))return;
    const style=document.createElement('style');
    style.id='expensePreviewStyles';
    style.textContent=`
      .expense-preview-modal{position:fixed;inset:0;z-index:10050;background:rgba(24,20,17,.58);backdrop-filter:blur(7px);display:none;overflow:auto;padding:18px}
      .expense-preview-modal.show{display:block}
      .expense-preview-shell{width:min(820px,100%);margin:0 auto 30px;background:#fff;border-radius:24px;box-shadow:0 24px 70px rgba(0,0,0,.22);overflow:hidden}
      .expense-preview-toolbar{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:9px;padding:12px 14px;background:rgba(255,255,255,.96);border-bottom:1px solid #e8e0d7;backdrop-filter:blur(12px)}
      .expense-preview-toolbar .preview-title{font-weight:850;flex:1}
      .expense-preview-toolbar button{border:1px solid #d9cfc4;background:#fff;border-radius:12px;padding:9px 11px;font:inherit;font-weight:750;cursor:pointer}
      .expense-preview-toolbar .primary{background:#edf7ef;border-color:#bdd9c2}
      .expense-preview-toolbar .close{font-size:20px;line-height:1;padding:8px 11px}
      .expense-preview-body{overflow-x:auto;background:#f5f1eb;padding:18px}
      .expense-preview-body .report{margin:auto;box-shadow:0 6px 28px rgba(50,40,30,.10)}
      @media(max-width:650px){
        .expense-preview-modal{padding:0;background:#f5f1eb}
        .expense-preview-shell{border-radius:0;margin:0;min-height:100vh}
        .expense-preview-toolbar{flex-wrap:wrap}
        .expense-preview-toolbar .preview-title{flex-basis:calc(100% - 48px)}
        .expense-preview-toolbar button:not(.close){flex:1}
        .expense-preview-body{padding:10px}
        .expense-preview-body .report{width:760px;transform-origin:top left}
      }`;
    document.head.appendChild(style);
  }
  function fitExpensePreview(){
    const body=document.querySelector('#expenseShareSummaryModal .expense-preview-body');
    const report=body?.querySelector('.report');
    if(!body||!report)return;
    report.style.transform='';
    report.style.marginBottom='';
    if(window.innerWidth<=650){
      const available=Math.max(280,body.clientWidth);
      const scale=Math.min(1,available/760);
      report.style.transform=`scale(${scale})`;
      report.style.marginBottom=`-${report.offsetHeight*(1-scale)}px`;
    }
  }
  window.openExpenseShareSummary=function(){
    const model=expenseReportModel();
    if(!model.all.length)return alert('No expense data to share yet.');
    ensureExpensePreviewStyles();
    let modal=document.getElementById('expenseShareSummaryModal');
    if(!modal){modal=document.createElement('div');modal.id='expenseShareSummaryModal';modal.className='expense-preview-modal';document.body.appendChild(modal);}
    modal.innerHTML=`<div class="expense-preview-shell">
      <div class="expense-preview-toolbar">
        <div class="preview-title">📤 Expense Summary Preview</div>
        <button class="primary" type="button" aria-label="Share PDF" onclick="shareExpenseSummaryPDF()">📄 Share PDF</button>
        <button type="button" aria-label="Share Excel" onclick="shareExpenseSummaryExcel()">📊 Share Excel</button>
        <button class="close" type="button" aria-label="Close" onclick="closeExpenseShareSummary()">×</button>
      </div>
      <div class="expense-preview-body"><style>${expenseReportCss()}</style>${expenseReportHtml(model)}</div>
    </div>`;
    modal.classList.add('show');
    document.documentElement.style.overflow='hidden';
    requestAnimationFrame(fitExpensePreview);
  };
  window.closeExpenseShareSummary=function(){
    document.getElementById('expenseShareSummaryModal')?.classList.remove('show');
    document.documentElement.style.overflow='';
  };
  window.addEventListener('resize',fitExpensePreview);
  window.shareExpenseSummaryExcel=async function(){
    const model=expenseReportModel();if(!model.all.length)return alert('No expense data to share yet.');
    const xml=buildExcelXml(model),file=new File([xml],`${safeFileBase()}_Expense_Summary.xls`,{type:'application/vnd.ms-excel'});
    try{await shareGeneratedFile(file,'Vietnam Expense Summary','Expense summary - Excel');closeExpenseShareSummary();}catch(error){if(error?.name!=='AbortError')alert('Could not share the Excel summary.');}
  };
  window.shareExpenseSummaryPDF=async function(){
    const model=expenseReportModel();if(!model.all.length)return alert('No expense data to share yet.');
    const host=document.createElement('div');host.style.position='fixed';host.style.left='-10000px';host.style.top='0';host.innerHTML=`<style>${expenseReportCss()}</style>${expenseReportHtml(model)}`;document.body.appendChild(host);
    try{
      await ensureHtml2Pdf();
      const element=host.querySelector('.report');
      const blob=await html2pdf().set({margin:0,filename:`${safeFileBase()}_Expense_Summary.pdf`,image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}}).from(element).outputPdf('blob');
      const file=new File([blob],`${safeFileBase()}_Expense_Summary.pdf`,{type:'application/pdf'});
      await shareGeneratedFile(file,'Vietnam Expense Summary','Expense summary - PDF');closeExpenseShareSummary();
    }catch(error){if(error?.name!=='AbortError')alert('PDF could not be created right now. Check your connection and try again.');}
    finally{host.remove();}
  };

})();

