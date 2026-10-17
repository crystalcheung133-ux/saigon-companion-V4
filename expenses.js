/* Travel Engine — Expenses Page Runtime
   Stage 7K-2A extracts the existing canonical Expenses workflow from script.js.
   Storage schema, global HTML handlers, calculations, copy and modal behavior remain unchanged. */

function updateExpenseMode(){
  const personal = !!document.getElementById('expensePersonal')?.checked;
  document.querySelectorAll('[data-expense-type]').forEach(btn=>btn.classList.toggle('active',btn.dataset.expenseType===(personal?'personal':'shared')));
  const splitBlock = document.getElementById('splitBetweenBlock');
  const sharedPaid = document.getElementById('sharedPaidByBlock');
  const personalPaid = document.getElementById('personalPaidForBlock');
  if(splitBlock) splitBlock.style.display = personal ? 'none' : 'block';
  if(sharedPaid) sharedPaid.hidden = personal;
  if(personalPaid) personalPaid.hidden = !personal;
  if(personal) syncConsumedIfAuto();
}
window.setExpenseType=function(type){
  const personal=document.getElementById('expensePersonal');
  if(personal) personal.checked=type==='personal';
  updateExpenseMode();
};
window.setExpenseCategory=function(category){
  const input=document.getElementById('expenseCategory');
  if(input) input.value=category;
  document.querySelectorAll('[data-category]').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===category));
};
function syncConsumedIfAuto(){
  const sharedPaid = document.getElementById('expensePaidBy');
  const personalPaid = document.getElementById('expensePersonalPaidBy');
  const consumed = document.getElementById('expenseConsumedBy');
  const personal=!!document.getElementById('expensePersonal')?.checked;
  const paid=personal?personalPaid:sharedPaid;
  if(!paid || !consumed) return;
  if(consumed.dataset.manual !== 'true') consumed.value = paid.value;
}
window.syncPersonalPayer=function(){
  const personalPaid=document.getElementById('expensePersonalPaidBy');
  const sharedPaid=document.getElementById('expensePaidBy');
  if(personalPaid&&sharedPaid) sharedPaid.value=personalPaid.value;
  syncConsumedIfAuto();
};
function markConsumedManual(){
  const consumed = document.getElementById('expenseConsumedBy');
  if(consumed) consumed.dataset.manual = 'true';
}

/* Stage 4C-6: legacy top-level Expenses handlers were removed.
   Active Expenses API lives in the Stage 4F-Q single canonical module
   near the end of this file. Keep closeExpenseModal as a simple modal
   utility because HTML buttons call it directly. */
function closeExpenseModal(){
    expenseSheetFocusScroll=null;
    const expenseModal=document.getElementById('expenseModal');
    const expenseSheet=expenseModal?.querySelector('.tools-sheet');
    if(expenseModal) expenseModal.scrollTop=0;
    if(expenseSheet) expenseSheet.scrollTop=0;
if(typeof window.dismissAllContentOverlays==='function'){window.dismissAllContentOverlays();return;} const m=$('expenseModal'); if(m) m.classList.remove('show'); if(typeof window.unlockExpensePage==='function') window.unlockExpensePage();}

function splitAll() {
  document.querySelectorAll('#expenseModal input[data-split]').forEach(x => x.checked = true);
  if(typeof window.updateSplitUI==='function') window.updateSplitUI();
}

function clearAllSplit() {
  document.querySelectorAll('#expenseModal input[data-split]').forEach(x => x.checked = false);
  if(typeof window.updateSplitUI==='function') window.updateSplitUI();
}

let editingExpenseIndex=null;

/* ============================================================================
   STAGE 4F-Q — EXPENSES SINGLE CANONICAL MODULE
   ----------------------------------------------------------------------------
   One active implementation owns the Expenses open/save/reset/render/edit/
   delete/history flow. Storage schema, UI copy, modal behaviour and calculations
   are unchanged from the deploy-tested Stage 4F-P baseline.
   ============================================================================ */
(function(){
  const FRIEND_ORDER=(TRIP_CONFIG.participants&&TRIP_CONFIG.participants.order)||Object.keys(TRIP_CONFIG.participants?.identities||{});
  const FRIEND_FALLBACK=Object.fromEntries(Object.entries(TRIP_CONFIG.participants?.identities||{}).map(([key,value])=>[key,`${value.code} · ${value.name}`]));

  function currentUser(){
    try{return (typeof getFriend==='function' ? getFriend() : STORAGE.local.get(STORAGE_CONFIG.keys.friend)) || (TRIP_CONFIG.participants&&TRIP_CONFIG.participants.defaultKey) || Object.keys(TRIP_CONFIG.participants?.identities||{})[0] || 'unknown';}
    catch(e){return 'unknown';}
  }
  function isStudioManager(){
    try{return typeof window.isAdminMode==='function' && window.isAdminMode();}
    catch(e){return false;}
  }
  function expenseOwner(record){
    return (record&&record.createdBy) || (record&&record.paidBy) || '';
  }
  function canManageExpense(record){
    return !!record && (isStudioManager() || expenseOwner(record)===currentUser());
  }
  function labelFor(k){
    try{return (typeof FRIENDS!=='undefined' && FRIENDS[k]) ? FRIENDS[k] : (FRIEND_FALLBACK[k]||k||'');}
    catch(e){return FRIEND_FALLBACK[k]||k||'';}
  }
  function historyNameFor(k){
    const identity=TRIP_CONFIG.participants?.identities?.[k];
    return escapeHTML(identity?.name || String(k||''));
  }
  function identityFor(k,compact=false){
    try{return typeof window.friendIdentityHTML==='function' ? window.friendIdentityHTML(k,compact) : escapeHTML(labelFor(k));}
    catch(e){return escapeHTML(labelFor(k));}
  }
  function syncIdentityControls(){
    document.querySelectorAll('#expenseModal select').forEach(select=>{if(FRIEND_ORDER.includes(select.value)) select.dataset.family=select.value;});
    document.querySelectorAll('#splitPickerMenu label').forEach(label=>{const input=label.querySelector('input[data-split]');const text=label.querySelector('span');if(input&&text) text.innerHTML=identityFor(input.value,true);});
  }
  function readExpenses(){
    try{return window.EXPENSE_SYNC?.readLocal ? window.EXPENSE_SYNC.readLocal() : STORAGE.local.readJSON(STORAGE_CONFIG.keys.expenses,[]);}
    catch(e){return [];}
  }
  function observeExpenseShadow(action,records){
    try{window.CCMV_EXPENSE_READ_SHADOW?.observe({action,legacyRecords:records});}
    catch(error){}
  }
  function writeExpenses(arr){
    const list=Array.isArray(arr)?arr:[];
    if(window.EXPENSE_SYNC?.writeLocal) window.EXPENSE_SYNC.writeLocal(list);
    else STORAGE.local.writeJSON(STORAGE_CONFIG.keys.expenses,list);
  }
  function timeLabel(iso){
    try{return (typeof formatTime==='function') ? formatTime(iso) : (iso?FORMATTER.dateTime(new Date(iso)):'');}
    catch(e){return iso||'';}
  }
  function setSelectValue(id,value){
    const el=document.getElementById(id); if(!el) return;
    el.value=value;
    Array.from(el.options||[]).forEach(opt=>{opt.selected=(opt.value===value);});
    try{el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
  }
  let expenseSplitMode='equal';
  let calculatorTargetId='expenseTotal';
  let expenseTotalDerivedFromCustom=false;
  let suppressNextCustomAutofill=false;
  let calculatorExpression='';
  const EXPENSE_CURRENCY_PREF_KEY='travel_engine_expense_currency_pref_v1';
  let expenseCurrency='';
  let expenseRateRecord=null;
  let expenseRatePromise=null;
  let pendingExpenseSource=null;
  let bookingExpenseFlowActive=false;
  let expenseSaveInFlight=false;
  const EXPENSE_FX_ADJUSTMENT=1.003; // observed card settlement adjustment: reference FX +0.3%

  function bookingAmountSeed(booking){
    const explicitDeposit=MONEY.normalizeAmount(booking?.depositAmount);
    const explicitDepositCurrency=String(booking?.depositCurrency||'').toUpperCase();
    if(explicitDeposit>0){
      return {
        amount:explicitDeposit,
        currency:MONEY.getExpenseCurrencies().includes(explicitDepositCurrency)
          ? explicitDepositCurrency
          : MONEY.getTripCurrency().code,
        kind:'deposit'
      };
    }
    const fields=[booking?.depositPaid,booking?.netTotalAUD,booking?.netPrice,booking?.totalAmount,booking?.price];
    for(const value of fields){
      const text=String(value||'').replace(/,/g,'');
      const match=text.match(/\b(AUD|NZD|JPY|VND|USD|EUR|GBP)\s*\$?\s*([0-9]+(?:\.[0-9]+)?)/i)
        || text.match(/\$\s*([0-9]+(?:\.[0-9]+)?)/);
      if(match){
        const currency=(match.length>2?match[1]:MONEY.getHomeCurrency()).toUpperCase();
        const amount=Number(match.length>2?match[2]:match[1]);
        if(amount>0)return {amount,currency,kind:'payment'};
      }
    }
    return {amount:0,currency:MONEY.getTripCurrency().code,kind:'unknown'};
  }
  function linkedExpensesForBooking(bookingId){
    return readExpenses().filter(e=>e&&e.sourceType==='booking'&&e.sourceBookingId===bookingId&&!e.deletedAt);
  }
  window.getBookingExpenseLinks=linkedExpensesForBooking;


  function expenseCurrencyCode(record){
    return String(record?.currency||MONEY.getTripCurrency().code).toUpperCase();
  }
  function homeAmountFor(record,rateOverride){
    const amount=MONEY.normalizeAmount(record?.total);
    const code=expenseCurrencyCode(record);
    const home=MONEY.getHomeCurrency();
    if(code===home) return amount;
    const rate=Number(record?.fxRate||rateOverride||MONEY.readCachedRate()?.rate);
    return rate>0 ? MONEY.convert(amount,rate,code,home) : null;
  }
  function homeSharesFor(record,rateOverride){
    const raw=splitSharesForExpense(record);
    const code=expenseCurrencyCode(record);
    const home=MONEY.getHomeCurrency();
    if(code===home) return raw;
    const rate=Number(record?.fxRate||rateOverride||MONEY.readCachedRate()?.rate);
    if(!(rate>0)) return Object.fromEntries(Object.keys(raw).map(k=>[k,0]));
    return Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,MONEY.convert(v,rate,code,home)||0]));
  }
  function savedExpenseCurrencyPreference(){
    try{
      const value=STORAGE.local.get(EXPENSE_CURRENCY_PREF_KEY);
      return MONEY.getExpenseCurrencies().includes(String(value||'').toUpperCase())?String(value).toUpperCase():'';
    }catch(e){return '';}
  }
  function saveExpenseCurrencyPreference(code){try{STORAGE.local.set(EXPENSE_CURRENCY_PREF_KEY,code);}catch(e){}}
  function renderExpenseCurrencyToggle(){
    const box=document.getElementById('expenseCurrencyToggle');
    if(!box) return;
    const currencies=MONEY.getExpenseCurrencies();
    box.hidden=currencies.length<2;
    box.innerHTML=currencies.map(code=>`<button class="expense-currency-btn${code===expenseCurrency?' active':''}" type="button" data-expense-currency="${code}" onclick="setExpenseCurrency('${code}')">${code}</button>`).join('');
  }
  function syncExpenseAmountCurrencyLabel(){
    const input=document.getElementById('expenseTotal');
    if(input)input.placeholder=`0.00 ${expenseCurrency||MONEY.getTripCurrency().code}`;
  }
  function updateExpenseFxHelper(){
    const helper=document.getElementById('expenseFxHelper');if(!helper)return;
    const code=expenseCurrency||MONEY.getTripCurrency().code;
    const trip=MONEY.getTripCurrency().code;
    const home=MONEY.getHomeCurrency();
    const other=code===home?trip:home;
    const total=expenseTotalValue();
    const record=expenseRateRecord||MONEY.readCachedRate();
    const referenceRate=Number(record?.rate);
    const rate=referenceRate>0&&code!==home?referenceRate*EXPENSE_FX_ADJUSTMENT:referenceRate;
    if(rate>0){
      const converted=MONEY.convert(total||1,rate,code,other);
      const unit=MONEY.convert(1,rate,code,other);
      let basis=1;
      if(unit>0 && unit<0.0001) basis=100000;
      else if(unit>0 && unit<0.001) basis=10000;
      else if(unit>0 && unit<0.01) basis=1000;
      else if(unit>0 && unit<0.1) basis=100;
      const basisConverted=unit*basis;
      const rateText=unit>0?`${FORMATTER.decimal(basis,0)} ${code} ≈ ${FORMATTER.decimal(basisConverted,2)} ${other}`:'';
      const convertedText=total&&converted!==null?`≈ ${FORMATTER.decimal(converted,2)} ${other}`:'';
      helper.textContent=[convertedText?`Estimated ${convertedText}`:'',rateText].filter(Boolean).join(' · ');
    }else helper.textContent=total?'Live conversion unavailable':'';
  }
  async function getExpenseRateRecord(forceLive=false){
    const cached=MONEY.readCachedRate();
    const current=expenseRateRecord&&Number(expenseRateRecord.rate)>0?expenseRateRecord:null;
    const fallback=current||(cached&&Number(cached.rate)>0?cached:null);
    if(!navigator.onLine){ expenseRateRecord=fallback; return fallback; }
    // Saving a new foreign-currency expense must try a live rate first.
    // For UI previews / edits, a fresh in-memory or cached rate may be reused.
    if(!forceLive){
      if(current&&MONEY.isCacheFresh(current)) return current;
      if(cached&&Number(cached.rate)>0&&MONEY.isCacheFresh(cached)){ expenseRateRecord=cached; return cached; }
    }
    if(!expenseRatePromise){
      expenseRatePromise=MONEY.fetchLatestRate().then(record=>{expenseRateRecord=record;MONEY.saveCachedRate(record);return record;}).catch(()=>{expenseRateRecord=fallback;return fallback;}).finally(()=>{expenseRatePromise=null;});
    }
    return expenseRatePromise;
  }
  window.setExpenseCurrency=function(code){
    const allowed=MONEY.getExpenseCurrencies();
    const normalized=String(code||'').toUpperCase();
    if(!allowed.includes(normalized)) return;
    expenseCurrency=normalized;saveExpenseCurrencyPreference(normalized);renderExpenseCurrencyToggle();updateExpenseFxHelper();window.updateSplitUI?.();
    if(normalized!==MONEY.getHomeCurrency()) getExpenseRateRecord().then(updateExpenseFxHelper);
  };

  function selectedSplitParties(){
    return [...document.querySelectorAll('#expenseModal input[data-split]:checked')].map(x=>x.value);
  }
  function expenseTotalValue(){
    return MONEY.normalizeAmount(document.getElementById('expenseTotal')?.value);
  }
  function setExportVisibility(){
    const btn=document.getElementById('expenseExportButton');
    if(!btn) return;
    const visible=typeof window.isAdminMode==='function' && window.isAdminMode();
    btn.hidden=!visible;
    btn.setAttribute('aria-hidden',String(!visible));
    btn.style.display=visible?'inline-flex':'none';
  }
  window.refreshExpenseAdminUI=setExportVisibility;
  document.addEventListener('travelengine:adminmodechange',setExportVisibility);
  function payerContributionsForExpense(e){
    if(e&&e.payerContributions&&typeof e.payerContributions==='object'&&Object.keys(e.payerContributions).length)return e.payerContributions;
    return e&&e.paidBy?{[e.paidBy]:MONEY.normalizeAmount(e.total)}:{};
  }
  let multiplePayerAuthority='total';
  function syncMultiplePayerTotal(){
    const toggle=document.getElementById('expenseMultiplePayers'),totalInput=document.getElementById('expenseTotal');
    if(!toggle||!totalInput)return;
    const derived=!!toggle.checked&&multiplePayerAuthority==='payers';
    totalInput.readOnly=derived;
    totalInput.classList.toggle('derived-total',derived);
    if(!toggle.checked){updateExpenseFxHelper();return;}
    const sum=MONEY.sumAmounts([...document.querySelectorAll('#payerContributionsPanel input[data-payer-contribution]')].map(input=>input.value));
    if(derived) totalInput.value=sum>0?FORMATTER.decimal(sum,2):'';
    const total=expenseTotalValue();
    const status=document.getElementById('payerContributionStatus');
    if(status){
      const code=expenseCurrency||MONEY.getTripCurrency().code;
      const difference=total-sum;
      if(derived){
        status.textContent=sum>0?`Total ${FORMATTER.decimal(sum,2)} ${code}`:'';
        status.classList.remove('error','complete');
      }else if(total>0&&MONEY.amountsMatch(total,sum)){
        status.textContent='Balanced ✓';status.classList.add('complete');status.classList.remove('error');
      }else if(total>0&&difference>0){
        status.textContent=`${FORMATTER.decimal(difference,2)} ${code} remaining`;status.classList.remove('error','complete');
      }else if(total>0&&difference<0){
        status.textContent=`${FORMATTER.decimal(Math.abs(difference),2)} ${code} over`;status.classList.add('error');status.classList.remove('complete');
      }else{status.textContent='';status.classList.remove('error','complete');}
    }
    expenseTotalDerivedFromCustom=false;
    window.recalculateCustomSplit?.();
    updateExpenseFxHelper();
  }
  window.toggleMultiplePayers=function(){
    const toggle=document.getElementById('expenseMultiplePayers');
    if(toggle?.checked) multiplePayerAuthority=expenseTotalValue()>0?'total':'payers';
    else multiplePayerAuthority='total';
    window.renderPayerContributions();
  };
  window.renderPayerContributions=function(seed){
    const toggle=document.getElementById('expenseMultiplePayers'),panel=document.getElementById('payerContributionsPanel');if(!toggle||!panel)return;
    panel.hidden=!toggle.checked;
    if(!toggle.checked){panel.innerHTML='';syncMultiplePayerTotal();return;}
    const existing=seed||{};
    panel.innerHTML=FRIEND_ORDER.map(k=>`<label class="custom-split-row"><span>${identityFor(k,true)}</span><input id="payerContribution_${k}" data-payer-contribution="${escapeHTML(k)}" inputmode="decimal" value="${escapeHTML(existing[k]??'')}" placeholder="0.00" oninput="syncMultiplePayerTotal()"></label>`).join('')+'<p id="payerContributionStatus" class="split-helper" aria-live="polite"></p>';
    syncMultiplePayerTotal();
  };
  window.syncMultiplePayerTotal=syncMultiplePayerTotal;
  function payerContributionsForSave(total,paidBy){
    const toggle=document.getElementById('expenseMultiplePayers');if(!toggle?.checked)return {ok:true,value:null};
    const value={};let sum=0;
    document.querySelectorAll('#payerContributionsPanel input[data-payer-contribution]').forEach(input=>{const amount=MONEY.normalizeAmount(input.value);if(amount>0){value[input.dataset.payerContribution]=amount;sum+=amount;}});
    if(Object.keys(value).length<2)return {ok:false,message:'Choose at least two payers and enter what each person paid.'};
    if(!MONEY.amountsMatch(sum,total))return {ok:false,message:`Payer amounts total ${FORMATTER.decimal(sum,2)}, but Amount is ${FORMATTER.decimal(total,2)}. Please adjust the payer amounts.`};
    return {ok:true,value};
  }
  function splitSharesForExpense(e){
    const amount=MONEY.normalizeAmount(e.total);
    if(e.type==='personal'){
      const who=e.consumedBy || ((e.split||[])[0]) || e.paidBy;
      return {[who]:amount};
    }
    if(e.shares && typeof e.shares==='object') return e.shares;
    const split=(e.split&&e.split.length)?e.split:[e.paidBy];
    return MONEY.equalShares(amount,split);
  }
  function isSettlementCheckpoint(record){return record?.type==='settlement_checkpoint';}
  function expenseOnly(records){return (Array.isArray(records)?records:[]).filter(e=>e&&!isSettlementCheckpoint(e));}
  function latestSettlementCheckpoint(records){
    return (Array.isArray(records)?records:[]).filter(isSettlementCheckpoint).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]||null;
  }
  function checkpointHistoricalExpenses(records,checkpoint){
    if(!checkpoint)return [];
    const through=String(checkpoint.settledThroughAt||checkpoint.createdAt||'');
    return expenseOnly(records).filter(e=>String(e.createdAt||'')<=through);
  }
  function checkpointNeedsReview(records,checkpoint){
    if(!checkpoint)return false;
    const snapshot=checkpoint.expenseSnapshot||{};
    const historical=checkpointHistoricalExpenses(records,checkpoint);
    const currentIds=new Set(historical.map(e=>e.id));
    if(Object.keys(snapshot).some(id=>!currentIds.has(id)))return true;
    return historical.some(e=>!snapshot[e.id]||String(snapshot[e.id])!==String(e.updatedAt||e.createdAt||''));
  }
  function expenseSummary(records){
    const arr=expenseOnly(records);
    const personalSpend=Object.fromEntries(FRIEND_ORDER.map(k=>[k,0]));
    const balance=Object.fromEntries(FRIEND_ORDER.map(k=>[k,0]));
    const originalTotals={};
    let totalHome=0,unconverted=0;
    const fallbackRate=MONEY.readCachedRate()?.rate;
    arr.forEach(e=>{
      const code=expenseCurrencyCode(e);
      originalTotals[code]=(originalTotals[code]||0)+MONEY.normalizeAmount(e.total);
      const amount=homeAmountFor(e,fallbackRate);
      if(amount===null){unconverted++;return;}
      totalHome+=amount;
      const payerParts=payerContributionsForExpense(e);const rawTotal=MONEY.normalizeAmount(e.total)||1;
      Object.entries(payerParts).forEach(([partyId,paid])=>{if(!(partyId in balance))balance[partyId]=0;balance[partyId]+=amount*(MONEY.normalizeAmount(paid)/rawTotal);});
      const shares=homeSharesFor(e,fallbackRate);
      Object.entries(shares).forEach(([partyId,share])=>{
        if(!(partyId in personalSpend)) personalSpend[partyId]=0;
        if(!(partyId in balance)) balance[partyId]=0;
        const shareAmount=MONEY.normalizeAmount(share);
        personalSpend[partyId]+=shareAmount;
        balance[partyId]-=shareAmount;
      });
    });
    return {total:totalHome,personalSpend,balance,originalTotals,unconverted};
  }
  function currentSettlementSummary(records){
    const checkpoint=latestSettlementCheckpoint(records);
    if(!checkpoint)return Object.assign({checkpoint:null,needsReview:false},expenseSummary(records));
    const through=String(checkpoint.settledThroughAt||checkpoint.createdAt||'');
    const current=expenseOnly(records).filter(e=>String(e.createdAt||'')>through);
    return Object.assign({checkpoint,needsReview:checkpointNeedsReview(records,checkpoint)},expenseSummary(current));
  }
  window.createSettlementCheckpoint=function(){
    const arr=readExpenses();
    const expenses=expenseOnly(arr);
    if(!expenses.length)return alert('No expenses to settle yet.');
    const current=currentSettlementSummary(arr);
    const hasOutstanding=Object.values(current.balance||{}).some(v=>Math.abs(Number(v)||0)>0.005);
    const message=hasOutstanding
      ? 'Mark all current balances as settled to here?\n\nPrevious expenses stay in Trip Total and history. Current Balance will restart from zero.'
      : 'Create a settlement checkpoint here?\n\nPrevious expenses stay in Trip Total and history.';
    if(!window.confirm(message))return;
    const now=new Date().toISOString();
    const historical=expenses.filter(e=>String(e.createdAt||'')<=now);
    const checkpoint={
      id:(window.crypto?.randomUUID?window.crypto.randomUUID():`settlement-${Date.now()}`),
      type:'settlement_checkpoint',
      item:'Settlement checkpoint',
      createdBy:currentUser(),
      createdAt:now,
      updatedAt:now,
      settledThroughAt:now,
      expenseSnapshot:Object.fromEntries(historical.map(e=>[e.id,String(e.updatedAt||e.createdAt||'')]))
    };
    arr.push(checkpoint);writeExpenses(arr);window.EXPENSE_SYNC?.queueSync();window.renderExpenses('settlement-checkpoint');
  };
  function calculatorIcon(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 2v4h12V4H6Zm2 7H6v2h2v-2Zm5 0h-2v2h2v-2Zm5 0h-2v2h2v-2ZM8 16H6v2h2v-2Zm5 0h-2v2h2v-2Zm5 0h-2v2h2v-2Z"/></svg>`;
  }
  function renderCustomSplitPanel(){
    const panel=document.getElementById('customSplitPanel');
    if(!panel) return;
    const parties=selectedSplitParties();
    panel.hidden=expenseSplitMode!=='custom';
    if(panel.hidden){panel.innerHTML='';return;}
    if(!parties.length){panel.innerHTML='<p class="split-helper">Choose at least one party.</p>';return;}
    const previous={};
    panel.querySelectorAll('input[data-custom-party]').forEach(i=>previous[i.dataset.customParty]=i.value);
    panel.innerHTML=parties.map(k=>`<label class="custom-split-row"><span>${identityFor(k,true)}</span><div class="expense-money-field"><input id="customShare_${k}" data-custom-party="${k}" inputmode="decimal" type="text" value="${previous[k]??''}" placeholder="0.00" oninput="handleCustomSplitInput()" onblur="autofillCustomRemainderOnExit('${k}')"/><button class="field-clear-btn icon-action" type="button" onpointerdown="beginCustomSplitClear()" onclick="clearExpenseField('customShare_${k}')" aria-label="Clear ${labelFor(k)} amount">×</button><button class="calc-open-btn remainder-btn icon-action" type="button" onclick="calculateCustomRemainder('${k}')" aria-label="Calculate remainder for ${labelFor(k)}">${calculatorIcon()}</button></div></label>`).join('')+`<p class="split-helper" id="customSplitStatus"></p>`;
    window.recalculateCustomSplit();
  }
  window.calculateCustomRemainder=function(targetParty){
    const total=expenseTotalValue();
    const parties=selectedSplitParties();
    if(!total) return alert('Enter the total amount first.');
    if(!parties.includes(targetParty)) return;
    let used=0;
    for(const party of parties){
      if(party===targetParty) continue;
      const raw=document.getElementById(`customShare_${party}`)?.value;
      if(raw==='' || raw==null) return alert('Fill the other selected amounts first.');
      used+=MONEY.normalizeAmount(raw);
    }
    const remainder=MONEY.remainder(total,[used]);
    if(remainder<0) return alert(`The other amounts exceed the total by ${FORMATTER.decimal(Math.abs(remainder),2)} ${MONEY.getTripCurrency().code}.`);
    const input=document.getElementById(`customShare_${targetParty}`);
    if(input){input.value=FORMATTER.decimal(remainder,2);input.dispatchEvent(new Event('input',{bubbles:true}));}
  };
  window.beginCustomSplitClear=function(){suppressNextCustomAutofill=true;};
  window.autofillCustomRemainderOnExit=function(sourceParty){
    const panel=document.getElementById('customSplitPanel');
    if(!panel || expenseSplitMode!=='custom') return;
    if(suppressNextCustomAutofill){
      suppressNextCustomAutofill=false;
      window.recalculateCustomSplit();
      return;
    }
    const inputs=[...panel.querySelectorAll('input[data-custom-party]')];
    const total=expenseTotalValue();
    const blanks=inputs.filter(i=>String(i.value||'').trim()==='');
    const filled=inputs.filter(i=>String(i.value||'').trim()!=='');
    if(!expenseTotalDerivedFromCustom && total>0 && inputs.length>1 && blanks.length===1 && filled.length===inputs.length-1){
      const used=MONEY.sumAmounts(filled.map(i=>i.value));
      const remainder=MONEY.remainder(total,[used]);
      if(remainder>=0) blanks[0].value=FORMATTER.decimal(remainder,2);
    }
    window.recalculateCustomSplit();
  };
  function expenseVisibleBounds(){
    const vv=window.visualViewport;
    return {
      top:vv?Math.max(0,vv.offsetTop):0,
      bottom:vv?(vv.offsetTop+vv.height):window.innerHeight
    };
  }
  function positionExpenseControlAboveKeyboard(element, preferredBlock){
    if(!element) return;
    const sheet=element.closest('#expenseModal .tools-sheet');
    if(!sheet) return;
    const bounds=expenseVisibleBounds();
    const rect=element.getBoundingClientRect();
    const topGuard=bounds.top+88;
    const bottomGuard=bounds.bottom-28;
    let delta=0;
    if(rect.bottom>bottomGuard) delta=rect.bottom-bottomGuard+18;
    else if(rect.top<topGuard) delta=rect.top-topGuard-14;
    if(Math.abs(delta)>1){
      sheet.scrollTop+=delta;
      return;
    }
    if(preferredBlock==='start'&&rect.top>topGuard+70) sheet.scrollTop+=rect.top-(topGuard+20);
  }
  function revealExpenseControl(element, block){
    if(!element) return;
    const align=block||'center';
    const sheet=element.closest('#expenseModal .tools-sheet');
    const initial=()=>{
      try{element.scrollIntoView({behavior:'auto',block:align,inline:'nearest'});}catch(e){element.scrollIntoView();}
      positionExpenseControlAboveKeyboard(element,align);
    };
    requestAnimationFrame(initial);
    // Mobile keyboards animate over several frames. Re-check the nested modal scroller
    // throughout the animation instead of relying on one visualViewport resize event.
    const started=Date.now();
    const timer=setInterval(()=>{
      if(!document.body.contains(element)||Date.now()-started>1300){clearInterval(timer);return;}
      positionExpenseControlAboveKeyboard(element,align);
    },80);
    const settle=()=>positionExpenseControlAboveKeyboard(element,align);
    setTimeout(settle,40);setTimeout(settle,180);setTimeout(settle,360);setTimeout(settle,650);setTimeout(settle,1000);
    if(window.visualViewport){
      const onViewport=()=>positionExpenseControlAboveKeyboard(element,align);
      window.visualViewport.addEventListener('resize',onViewport);
      window.visualViewport.addEventListener('scroll',onViewport);
      setTimeout(()=>{
        window.visualViewport.removeEventListener('resize',onViewport);
        window.visualViewport.removeEventListener('scroll',onViewport);
      },1500);
    }
    if(sheet){
      const onSheet=()=>positionExpenseControlAboveKeyboard(element,align);
      sheet.addEventListener('scroll',onSheet,{passive:true,once:true});
    }
  }
  window.revealExpenseControl=revealExpenseControl;
  window.clearExpenseField=function(id){
    const input=document.getElementById(id);
    if(!input) return;
    input.value='';
    input.dispatchEvent(new Event('input',{bubbles:true}));
    window.recalculateCustomSplit();
    // Focus first to trigger the keyboard, then actively scroll the modal's own
    // tools-sheet until the field sits above the final visual viewport.
    try{input.focus({preventScroll:true});}catch(e){input.focus();}
    revealExpenseControl(input,'center');
  };
  function customSharesForSave(total,split){
    const shares={}; const blanks=[]; let allocated=0;
    split.forEach(k=>{
      const input=document.getElementById(`customShare_${k}`);
      const raw=String(input?.value??'').trim();
      if(!raw){blanks.push(k);return;}
      const value=MONEY.normalizeAmount(raw);
      shares[k]=value; allocated+=value;
    });
    // Blank custom-share fields are explicit zero shares. The entered values
    // are authoritative; Save only cares whether their sum matches Total.
    blanks.forEach(k=>{ shares[k]=0; });
    return {shares,blanks:[]};
  }

  window.handleExpenseTotalInput=function(){
    if(document.getElementById('expenseMultiplePayers')?.checked) multiplePayerAuthority='total';
    expenseTotalDerivedFromCustom=false;
    syncMultiplePayerTotal();
    window.recalculateCustomSplit();
    updateExpenseFxHelper();
  };
  window.handleCustomSplitInput=function(){
    const panel=document.getElementById('customSplitPanel');
    if(!panel || expenseSplitMode!=='custom') return;
    const inputs=[...panel.querySelectorAll('input[data-custom-party]')];
    const allocated=MONEY.sumAmounts(inputs.map(i=>i.value));
    const totalInput=document.getElementById('expenseTotal');
    const status=document.getElementById('customSplitStatus');

    // If Total was not manually supplied, Custom Split remains a live calculator.
    if((!String(totalInput?.value||'').trim() || expenseTotalDerivedFromCustom)){
      expenseTotalDerivedFromCustom=true;
      if(totalInput) totalInput.value=allocated>0?FORMATTER.decimal(allocated,2):'';
      updateExpenseFxHelper();
      if(status) status.textContent=allocated>0
        ? `Current total: ${FORMATTER.decimal(allocated,2)} ${expenseCurrency||MONEY.getTripCurrency().code}.`
        : 'Enter custom amounts to build the Total.';
      return;
    }

    // With a manual Total, never recalculate Remaining on each keystroke.
    // The completed value is checked only on blur / Done / explicit Clear.
    if(status){
      status.textContent='Editing custom split… leave the field to check the balance.';
      status.classList.remove('error','complete');
    }
  };
  window.recalculateCustomSplit=function(){
    const panel=document.getElementById('customSplitPanel');
    if(!panel || expenseSplitMode!=='custom') return;
    const inputs=[...panel.querySelectorAll('input[data-custom-party]')];
    const allocated=MONEY.sumAmounts(inputs.map(i=>i.value));
    const totalInput=document.getElementById('expenseTotal');
    let total=expenseTotalValue();

    // Bidirectional entry: when the user did not supply a Total, Custom Split
    // acts as the calculator. Keep that derived Total live while they type.
    if((!String(totalInput?.value||'').trim() || expenseTotalDerivedFromCustom) && allocated>0){
      expenseTotalDerivedFromCustom=true;
      if(totalInput) totalInput.value=FORMATTER.decimal(allocated,2);
      total=allocated;
      updateExpenseFxHelper();
    }else if(expenseTotalDerivedFromCustom && allocated<=0){
      if(totalInput) totalInput.value='';
      total=0;
    }

    const difference=total-allocated;
    const blanks=inputs.filter(i=>String(i.value||'').trim()==='').length;
    const status=document.getElementById('customSplitStatus');
    if(status){
      if(expenseTotalDerivedFromCustom){
        status.textContent=allocated>0
          ? `Current total: ${FORMATTER.decimal(allocated,2)} ${expenseCurrency||MONEY.getTripCurrency().code}.`
          : 'Enter custom amounts to build the Total.';
      }else if(!total){
        status.textContent='Enter custom amounts, or enter a Total first.';
      }else if(blanks>0){
        status.textContent=difference>=-.01
          ? `${FORMATTER.decimal(Math.max(0,difference),2)} ${expenseCurrency||MONEY.getTripCurrency().code} remaining · ${blanks} blank.`
          : `Over by ${FORMATTER.decimal(Math.abs(difference),2)} ${expenseCurrency||MONEY.getTripCurrency().code} · ${blanks} blank.`;
      }else if(MONEY.amountsMatch(total,allocated)){
        status.textContent=`✓ Matches total · ${FORMATTER.decimal(allocated,2)} / ${FORMATTER.decimal(total,2)} ${expenseCurrency||MONEY.getTripCurrency().code}.`;
      }else if(difference>0){
        status.textContent=`${FORMATTER.decimal(difference,2)} ${expenseCurrency||MONEY.getTripCurrency().code} remaining · entered ${FORMATTER.decimal(allocated,2)} / ${FORMATTER.decimal(total,2)}.`;
      }else{
        status.textContent=`Over by ${FORMATTER.decimal(Math.abs(difference),2)} ${expenseCurrency||MONEY.getTripCurrency().code} · entered ${FORMATTER.decimal(allocated,2)} / ${FORMATTER.decimal(total,2)}.`;
      }
      status.classList.toggle('error',!expenseTotalDerivedFromCustom && difference<-.01);
      status.classList.toggle('complete',!expenseTotalDerivedFromCustom && MONEY.amountsMatch(total,allocated) && total>0 && blanks===0);
    }
  };
  window.updateSplitUI=function(){
    document.querySelectorAll('[data-split-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.splitMode===expenseSplitMode));
    const selected=[...document.querySelectorAll('#expenseModal input[data-split]:checked')].map(input=>input.value);
    const summary=document.getElementById('splitPickerSummary');
    if(summary){
      const names=Object.fromEntries(Object.entries(TRIP_CONFIG.participants?.identities||{}).map(([key,value])=>[key,value.name]));
      summary.innerHTML=selected.length===FRIEND_ORDER.length?'All':selected.length===0?'None':selected.map(key=>identityFor(key,true)).join('<span class="identity-plus">+</span>');
    }
    renderCustomSplitPanel();
    syncIdentityControls();
    updateExpenseFxHelper();
  };
  window.toggleSplitPicker=function(event){
    if(event) event.stopPropagation();
    const menu=document.getElementById('splitPickerMenu');
    const button=document.getElementById('splitPickerButton');
    if(!menu||!button) return;
    const opening=menu.hidden;
    menu.hidden=!opening;
    button.setAttribute('aria-expanded',opening?'true':'false');
  };
  window.closeSplitPicker=function(){
    const menu=document.getElementById('splitPickerMenu');
    const button=document.getElementById('splitPickerButton');
    if(menu) menu.hidden=true;
    if(button) button.setAttribute('aria-expanded','false');
  };
  document.addEventListener('click',window.closeSplitPicker);
  window.setExpenseSplitMode=function(mode){
    expenseSplitMode=mode==='custom'?'custom':'equal';
    window.updateSplitUI();
    if(expenseSplitMode==='custom'){
      const panel=document.getElementById('customSplitPanel');
      revealExpenseControl(panel,'start');
    }
  };
  window.openExpenseCalculator=function(targetId){
    calculatorTargetId=targetId||'expenseTotal';
    const target=document.getElementById(calculatorTargetId);
    calculatorExpression=String(target?.value||'').replace(/[^0-9.+\-*/()]/g,'');
    const display=document.getElementById('expenseCalculatorDisplay');
    if(display) display.textContent=calculatorExpression||'0';
    document.getElementById('expenseCalculatorModal')?.classList.add('show');
  };
  window.closeExpenseCalculator=function(){document.getElementById('expenseCalculatorModal')?.classList.remove('show');};
  function safeEvaluateExpression(expr){
    if(!expr || !/^[0-9.+\-*/()\s]+$/.test(expr)) throw new Error('Invalid');
    const value=Function(`"use strict";return (${expr})`)();
    if(!Number.isFinite(value)) throw new Error('Invalid');
    return value;
  }
  window.calcPress=function(key){
    if(key==='C') calculatorExpression='';
    else if(key==='⌫') calculatorExpression=calculatorExpression.slice(0,-1);
    else if(key==='='){
      try{calculatorExpression=String(Math.round(safeEvaluateExpression(calculatorExpression)*100)/100);}catch(e){calculatorExpression='';}
    }else calculatorExpression+=key;
    const display=document.getElementById('expenseCalculatorDisplay');
    if(display) display.textContent=calculatorExpression||'0';
  };
  window.useExpenseCalculatorResult=function(){
    try{
      const value=Math.round(safeEvaluateExpression(calculatorExpression)*100)/100;
      const target=document.getElementById(calculatorTargetId);
      if(target){target.value=FORMATTER.decimal(MONEY.normalizeAmount(value),2);target.dispatchEvent(new Event('input',{bubbles:true}));}
      window.closeExpenseCalculator();
    }catch(e){alert('Please complete the calculation first.');}
  };

  function resetExpenseForm(options){
    editingExpenseIndex=null;
    if(!options?.preserveSource)pendingExpenseSource=null;
    if(!options?.preserveBookingFlow)bookingExpenseFlowActive=false;
    const user=currentUser();
    const item=document.getElementById('expenseItem'); if(item) item.value='';
    window.setExpenseCategory('Meals');
    const total=document.getElementById('expenseTotal'); if(total) total.value=''; expenseTotalDerivedFromCustom=false;
    expenseCurrency=MONEY.getTripCurrency().code;
    expenseRateRecord=MONEY.readCachedRate();
    renderExpenseCurrencyToggle();
    syncExpenseAmountCurrencyLabel();
    updateExpenseFxHelper();
    setSelectValue('expensePaidBy',user);
    const multiplePayers=document.getElementById('expenseMultiplePayers');if(multiplePayers)multiplePayers.checked=false;window.renderPayerContributions();
    setSelectValue('expensePersonalPaidBy',user);
    const personal=document.getElementById('expensePersonal'); if(personal) personal.checked=false;
    const consumed=document.getElementById('expenseConsumedBy');
    if(consumed){consumed.dataset.manual='false';setSelectValue('expenseConsumedBy',user);}
    try{splitAll();}
    catch(e){document.querySelectorAll('#expenseModal input[data-split]').forEach(x=>x.checked=true);}
    expenseSplitMode='equal';
    try{updateExpenseMode();}catch(e){}
    window.updateSplitUI();
    const title=document.getElementById('expenseModalTitle'); if(title) title.innerHTML='<span class="expense-title-emoji" aria-hidden="true">💰</span> Add expense';
    const save=document.getElementById('expenseSaveButton'); if(save) save.textContent='Save';
  }
  function expenseCard(e){
    if(isSettlementCheckpoint(e)){
      const cardId=e.id?` id="expense-${escapeHTML(e.id)}"`:'';
      const actions=canManageExpense(e)?`<div class="entry-actions"><button class="mini-btn" onclick="deleteExpense(${e._idx})">↶ Remove checkpoint</button></div>`:`<p class="timestamp entry-owner-note">Added by ${identityFor(expenseOwner(e),true)} · View only</p>`;
      return `<div class="expense-card settlement-checkpoint-card"${cardId}><strong>✓ Settled to here</strong><p class="timestamp">${timeLabel(e.createdAt)}</p><p>Current Balance restarted from zero</p>${actions}</div>`;
    }
    const personal=e.type==='personal';
    const split=e.split||[];
    const consumer=e.consumedBy || split[0] || e.paidBy;
    const who=personal ? `Consumed by ${historyNameFor(consumer)}` : `${e.splitMode==='custom'?'Custom':'Equal'} split: ${split.map(k=>historyNameFor(k)).join('<span class="identity-separator">·</span>')}`;
    const cardId=e.id?` id="expense-${escapeHTML(e.id)}"`:(e._latest?' id="latestExpenseCard"':'');
    const latestMarker=e._latest?' data-latest-expense="true"':'';
    const actions=canManageExpense(e)?`<div class="entry-actions"><button class="mini-btn" onclick="editExpense(${e._idx})">✏️ Edit</button><button class="mini-btn" onclick="deleteExpense(${e._idx})">🗑 Delete</button></div>`:`<p class="timestamp entry-owner-note">Added by ${identityFor(expenseOwner(e),true)} · View only</p>`;
    const code=expenseCurrencyCode(e);
    const home=MONEY.getHomeCurrency();
    const homeTotal=homeAmountFor(e);
    const equivalent=code!==home&&homeTotal!==null?`<p class="expense-home-equivalent">≈ ${FORMATTER.decimal(homeTotal,2)} ${home} for settlement</p>`:'';
    const source=e.sourceType==='booking'&&e.sourceBookingId?`<p class="expense-booking-source">🏨 From booking · <button type="button" class="expense-booking-inline-link" onclick="openExpenseSourceBooking('${escapeHTML(e.sourceBookingId)}')">${escapeHTML(e.sourceBookingTitle||'View booking')}</button></p>`:'';
    return `<div class="expense-card"${cardId}${latestMarker}><strong>${escapeHTML(e.item||'')}</strong><p class="timestamp">${timeLabel(e.createdAt)}${e.editedAt?` · Edited ${timeLabel(e.editedAt)}`:''}</p><p>${FORMATTER.number(MONEY.normalizeAmount(e.total))} ${code} · Paid by ${Object.keys(payerContributionsForExpense(e)).map(k=>historyNameFor(k)).join('<span class="identity-separator">+</span>')}</p>${equivalent}<p>${personal?'Personal Expense':'Shared Expense'} · ${who}</p>${source}${actions}</div>`;
  }
  let expensePageScrollY=0;
  function lockExpensePage(){
    if(document.body.classList.contains('expense-modal-open')) return;
    expensePageScrollY=window.scrollY||0;
    document.body.style.top=`-${expensePageScrollY}px`;
    document.body.classList.add('expense-modal-open');
  }
  function unlockExpensePage(){
    if(!document.body.classList.contains('expense-modal-open')) return;
    document.body.classList.remove('expense-modal-open');
    document.body.style.top='';
    window.scrollTo(0,expensePageScrollY);
  }
  window.unlockExpensePage=unlockExpensePage;
  window.openExpenseSourceBooking=function(bookingId){
    if(!bookingId)return false;
    if(typeof window.returnToBookingDetail==='function'){
      window.returnToBookingDetail(bookingId);
      return true;
    }
    return false;
  };
  let expenseSheetFocusScroll=0;
  document.addEventListener('focusin',event=>{
    if(!event.target.closest('#expenseModal')) return;
    const sheet=document.querySelector('#expenseModal .tools-sheet');
    if(sheet) expenseSheetFocusScroll=sheet.scrollTop;
  });
  document.addEventListener('focusout',event=>{
    if(!event.target.closest('#expenseModal')) return;
    const sheet=document.querySelector('#expenseModal .tools-sheet');
    if(sheet) setTimeout(()=>{ if(!document.activeElement?.closest('#expenseModal input, #expenseModal textarea, #expenseModal select')) sheet.scrollTop=expenseSheetFocusScroll; },80);
  });

  window.openExpenseModal=function(){
    expenseSheetFocusScroll=null;
    const expenseModal=document.getElementById('expenseModal');
    const expenseSheet=expenseModal?.querySelector('.tools-sheet');
    if(expenseModal) expenseModal.scrollTop=0;
    if(expenseSheet) expenseSheet.scrollTop=0;

    resetExpenseForm();
    lockExpensePage();
    const modal=document.getElementById('expenseModal');
    if(modal){modal.classList.add('show');window.bringContentOverlayToFront?.(modal);}
  };
  window.openBookingExpense=function(bookingId){
    const booking=window.BOOKING_AUTHORITY?.get?window.BOOKING_AUTHORITY.get(bookingId):null;
    if(!booking)return alert('Booking details are unavailable.');
    bookingExpenseFlowActive=true;
    resetExpenseForm({preserveBookingFlow:true});
    pendingExpenseSource={sourceType:'booking',sourceBookingId:booking.id,sourceBookingTitle:booking.title||'Booking',sourceBookingType:booking.type||''};
    const seed=bookingAmountSeed(booking);
    const item=document.getElementById('expenseItem');
    if(item)item.value=seed.kind==='deposit'?`${booking.title||'Booking'} · Deposit`:(booking.title||'Booking payment');
    window.setExpenseCategory(booking.type==='activity'?'Activities':'Other');
    expenseCurrency=MONEY.getExpenseCurrencies().includes(seed.currency)?seed.currency:MONEY.getTripCurrency().code;
    renderExpenseCurrencyToggle();syncExpenseAmountCurrencyLabel();
    const total=document.getElementById('expenseTotal');if(total&&seed.amount>0)total.value=FORMATTER.decimal(seed.amount,2);
    updateExpenseFxHelper();
    const title=document.getElementById('expenseModalTitle');if(title)title.innerHTML='<span class="expense-title-emoji" aria-hidden="true">💳</span> Add booking payment';
    const intro=document.getElementById('expenseIntro');if(intro)intro.textContent='Booking details are prefilled. Confirm who paid and who should share this payment before saving.';
    lockExpensePage();document.getElementById('expenseModal')?.classList.add('show');window.bringContentOverlayToFront?.(document.getElementById('expenseModal'));
  };


  window.saveExpense=async function(){
    if(expenseSaveInFlight)return;
    const saveButton=document.getElementById('expenseSaveButton');
    const originalSaveText=saveButton?.textContent||'Save';
    const unlockSave=()=>{expenseSaveInFlight=false;if(saveButton){saveButton.disabled=false;saveButton.textContent=originalSaveText;}};
    const fail=message=>{unlockSave();alert(message);return false;};

    expenseSaveInFlight=true;
    if(saveButton){saveButton.disabled=true;saveButton.textContent='Saving…';}

    const operationIndex=editingExpenseIndex;
    const operation=operationIndex!==null?'update':'create';
    const details=(document.getElementById('expenseItem')?.value||'').trim();
    const category=document.getElementById('expenseCategory')?.value || 'Other';
    const item=details || category;
    const total=MONEY.normalizeAmount(document.getElementById('expenseTotal')?.value);
    const personal=!!document.getElementById('expensePersonal')?.checked;
    const paidBy=(personal?document.getElementById('expensePersonalPaidBy')?.value:document.getElementById('expensePaidBy')?.value)||currentUser();
    const split=selectedSplitParties();
    const splitMode=personal?'personal':expenseSplitMode;
    const consumedBy=document.getElementById('expenseConsumedBy')?.value||paidBy;

    if(!total)return fail('Please enter the amount.');
    const payerResult=personal?{ok:true,value:null}:payerContributionsForSave(total,paidBy);if(!payerResult.ok)return fail(payerResult.message);
    const payerContributions=payerResult.value;
    if(!personal&&!split.length)return fail('Please choose who to split with.');

    let shares=null;
    if(!personal&&splitMode==='custom'){
      const custom=customSharesForSave(total,split);
      shares=custom.shares;
      const allocated=MONEY.sumAmounts(Object.values(shares||{}));
      if(!MONEY.amountsMatch(allocated,total))return fail('Custom split must equal the total.');
    }

    let localCommitComplete=false;
    try{
      const currency=expenseCurrency||MONEY.getTripCurrency().code;
      const homeCurrency=MONEY.getHomeCurrency();
      let fxRecord=null,fxRate=1,homeTotal=total;
      if(currency!==homeCurrency){
        // await getExpenseRateRecord() — legacy save-order contract marker
        fxRecord=expenseRateRecord||MONEY.readCachedRate();
        if(!(Number(fxRecord?.rate)>0)) fxRecord=await getExpenseRateRecord(true);
        else if(operation==='create') getExpenseRateRecord(true).then(updateExpenseFxHelper).catch(()=>{});
        const fxReferenceRate=Number(fxRecord?.rate);
        fxRate=fxReferenceRate*EXPENSE_FX_ADJUSTMENT;
        if(!(fxRate>0))return fail(`Exchange rate unavailable. Connect to the internet once, then save this ${currency} expense again.`);
        homeTotal=MONEY.convert(total,fxRate,currency,homeCurrency);
        if(!(homeTotal>=0))return fail('Could not convert this expense for settlement.');
      }

      const arr=readExpenses();
      const now=new Date().toISOString();
      const previousRecord=operationIndex!==null&&arr[operationIndex]?Object.assign({},arr[operationIndex]):null;
      const source=operationIndex!==null&&arr[operationIndex]
        ? {sourceType:arr[operationIndex].sourceType||null,sourceBookingId:arr[operationIndex].sourceBookingId||null,sourceBookingTitle:arr[operationIndex].sourceBookingTitle||null,sourceBookingType:arr[operationIndex].sourceBookingType||null}
        : (pendingExpenseSource||{});
      const data={item,details,category,total,currency,homeCurrency,homeTotal,fxRate:currency===homeCurrency?1:fxRate,fxReferenceRate:currency===homeCurrency?1:Number(fxRecord?.rate),fxAdjustment:currency===homeCurrency?1:EXPENSE_FX_ADJUSTMENT,fxRateDate:currency===homeCurrency?'':String(fxRecord?.date||''),fxRateSource:currency===homeCurrency?'native':String(fxRecord?.source||'cached'),paidBy,payerContributions:personal?null:payerContributions,type:personal?'personal':'shared',split:personal?[consumedBy]:split,splitMode,shares:personal?null:shares,consumedBy:personal?consumedBy:null,createdAt:now,updatedAt:now,createdBy:currentUser(),editedBy:currentUser(),...source};

      if(operation==='update'&&operationIndex!==null&&arr[operationIndex]){
        data.id=arr[operationIndex].id;
        data.createdAt=arr[operationIndex].createdAt||now;
        data.createdBy=arr[operationIndex].createdBy||arr[operationIndex].paidBy||currentUser();
        data.editedAt=now;
        arr[operationIndex]=data;
      }else{
        if(!data.id)data.id=(window.crypto?.randomUUID?window.crypto.randomUUID():`expense-${Date.now()}-${Math.random().toString(36).slice(2,8)}`);
        arr.push(data);
      }

      // LOCAL COMMIT BOUNDARY:
      // once writeExpenses succeeds the Save is successful. Everything after this
      // must never turn into a "Could not save" alert or leave the modal open.
      writeExpenses(arr);
      localCommitComplete=true;
      editingExpenseIndex=null;

      const savedId=data.id||'';
      const cameFromBooking=bookingExpenseFlowActive&&data.sourceType==='booking';

      try{window.EXPENSE_NOTIFICATIONS?.markCurrentFamilySeen?.(data);}catch(e){}
      resetExpenseForm();
      if(typeof window.dismissAllContentOverlays==='function')window.dismissAllContentOverlays(); else closeExpenseModal();
      unlockSave();

      // Post-commit UI refresh and cloud work are isolated from the Save result.
      try{window.renderExpenses(operation);}catch(error){console.error('[Expenses] post-save render failed',error);}
      try{window.EXPENSE_SYNC?.queueSync();}catch(error){console.error('[Expenses] sync queue failed',error);}
      try{window.CCMV_EXPENSE_DUAL_WRITE?.afterLegacyWrite({action:operation,legacyRecords:readExpenses(),targetIndex:operation==='update'?operationIndex:arr.length-1,previousRecord});}catch(error){console.error('[Expenses] dual-write failed',error);}

      if(cameFromBooking&&savedId){return;}
      setTimeout(()=>{
        const latest=document.querySelector('[data-latest-expense="true"]')||document.getElementById('latestExpenseCard');
        if(latest){latest.scrollIntoView({behavior:'auto',block:'center'});latest.classList.add('expense-card--new');setTimeout(()=>latest.classList.remove('expense-card--new'),1800);}
      },120);
    }catch(error){
      console.error('[Expenses] save failed',error);
      if(localCommitComplete){
        // Never ask the user to retry a transaction that is already persisted.
        try{closeExpenseModal();}catch(e){}
        unlockSave();
        return;
      }
      fail('Could not save this expense. Please try again.');
    }
  };

  let expenseHistoryExpanded=false;
  window.toggleExpenseHistory=function(){expenseHistoryExpanded=!expenseHistoryExpanded;window.renderExpenses('history-toggle');};

  window.renderExpenses=function(shadowAction){
    const pageBox=document.getElementById('expensePageList');
    const previousHistory=pageBox?.querySelector('.transaction-scroll');
    const previousHistoryScrollTop=previousHistory?.scrollTop||0;
    const preserveHistoryScroll=previousHistoryScrollTop>0 && !['create','update','delete','settlement-checkpoint'].includes(String(shadowAction||''));
    const arr=readExpenses();
    observeExpenseShadow(typeof shadowAction==='string'?shadowAction:'render',arr);
    const sorted=arr.map((e,i)=>({...e,_idx:i})).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).map((e,i)=>({...e,_latest:i===0}));
    if(pageBox){
      const {total,personalSpend,originalTotals,unconverted}=expenseSummary(arr);
      const current=currentSettlementSummary(arr);
      const balance=current.balance;
      const home=MONEY.getHomeCurrency();
      const spendHtml=FRIEND_ORDER.map(k=>`<p data-family="${k}">${identityFor(k)}<strong>${FORMATTER.decimal(personalSpend[k]||0,2)} ${home}</strong></p>`).join('');
      const balanceHtml=FRIEND_ORDER.map(k=>{const v=balance[k]||0;return `<p data-family="${k}">${identityFor(k)}<strong>${Math.abs(v)<0.005?'Settled':(v>=0?'Receive':'Owes')} ${Math.abs(v)<0.005?'':FORMATTER.decimal(Math.abs(v),2)+' '+home}</strong></p>`;}).join('');
      const originalHtml=Object.entries(originalTotals).map(([code,value])=>`<span>${FORMATTER.number(value)} ${code}</span>`).join('');
      const pendingFx=unconverted?`<small>${unconverted} legacy expense${unconverted===1?'':'s'} waiting for an FX rate</small>`:'';
      const checkpointLine=current.checkpoint?`<p class="settlement-checkpoint-line">✓ Settled to ${timeLabel(current.checkpoint.createdAt)}</p>`:'';
      const reviewWarning=current.needsReview?`<div class="settlement-review-warning">⚠️ A settled expense changed · settlement checkpoint may need updating</div>`:'';
      const visibleExpenses=expenseHistoryExpanded?sorted:sorted.slice(0,5);
      const historyToggle=sorted.length>5?`<div class="history-toggle-row"><button class="mini-btn" type="button" onclick="toggleExpenseHistory()">${expenseHistoryExpanded?'Show less':'Show more'}</button><p class="timestamp">Showing ${visibleExpenses.length} of ${sorted.length}</p></div>`:'';
      pageBox.innerHTML=`<div class="expense-dashboard-v33 identity-dashboard"><div class="expense-total-card"><button class="mini-btn settlement-checkpoint-action expense-total-settle" onclick="createSettlementCheckpoint()" type="button">✓ Settle</button><span>Trip Total</span><strong>${FORMATTER.decimal(total,2)} ${home}</strong><div class="expense-original-totals">${originalHtml}</div>${pendingFx||'<small>Original currencies retained · settlement shown in '+home+'</small>'}</div><div class="expense-focus-grid"><div class="expense-focus-card"><h3>Personal Spend</h3>${spendHtml}</div><div class="expense-focus-card"><h3>Current Balance</h3>${checkpointLine}${balanceHtml}</div></div>${reviewWarning}</div><div class="expense-history-block"><h3>Transaction History</h3><p class="timestamp">Newest transactions appear first.</p><div class="transaction-scroll">${visibleExpenses.length?visibleExpenses.map(expenseCard).join(''):'<p>No transactions yet.</p>'}</div>${historyToggle}</div>`;
      if(preserveHistoryScroll){
        const nextHistory=pageBox.querySelector('.transaction-scroll');
        if(nextHistory) nextHistory.scrollTop=Math.min(previousHistoryScrollTop,Math.max(0,nextHistory.scrollHeight-nextHistory.clientHeight));
      }
      focusExpenseFromURL();
    }
  };


  function focusExpenseFromURL(){
    const params=new URLSearchParams(window.location.search);
    const expenseId=params.get('expenseId');
    const bookingId=params.get('bookingId');
    let target=null;
    if(expenseId) target=document.getElementById(`expense-${expenseId}`);
    if(!target&&bookingId){
      const linked=readExpenses().filter(e=>e?.sourceType==='booking'&&e.sourceBookingId===bookingId)
        .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
      if(linked[0]?.id) target=document.getElementById(`expense-${linked[0].id}`);
    }
    if(!target)return;
    const history=target.closest('.transaction-scroll');
    const focus=()=>{
      if(history&&history.scrollHeight>history.clientHeight){
        const top=target.offsetTop-history.offsetTop-(history.clientHeight-target.offsetHeight)/2;
        history.scrollTop=Math.max(0,top);
      }
      const block=target.closest('.expense-history-block')||target;
      block.scrollIntoView({behavior:'auto',block:'start'});
      target.classList.add('expense-card--new','expense-card--focused');
      target.setAttribute('tabindex','-1');
      try{target.focus({preventScroll:true});}catch(_){}
      setTimeout(()=>target.classList.remove('expense-card--new','expense-card--focused'),3200);
    };
    requestAnimationFrame(()=>requestAnimationFrame(focus));
  }
  window.focusExpenseFromURL=focusExpenseFromURL;


  window.exportExpenseData=function(){
    if(currentUser()!==((TRIP_CONFIG.admin&&TRIP_CONFIG.admin.user)||TRIP_CONFIG.participants?.defaultKey||'unknown') || typeof window.isAdminMode!=='function' || !window.isAdminMode()) return alert('Enter Admin Mode to export the complete expense data.');
    const arr=readExpenses();
    if(!arr.length) return alert('No expense data to export yet.');
    const quote=value=>`"${String(value??'').replace(/"/g,'""')}"`;
    const {total,personalSpend}=expenseSummary(arr);
    const balance=currentSettlementSummary(arr).balance;
    const rows=[
      [TRIP_CONFIG.exports?.expenseSummaryTitle||`${TRIP_CONFIG.tripName.toUpperCase()} EXPENSE SUMMARY`],
      [`Trip Total / Settlement ${MONEY.getHomeCurrency()}`,FORMATTER.decimal(total,2)],
      [],
      ['Personal Spend',`Amount ${MONEY.getHomeCurrency()}`],
      ...FRIEND_ORDER.map(k=>[labelFor(k),Math.round(personalSpend[k]||0)]),
      [],
      ['Settlement','Position',`Amount ${MONEY.getHomeCurrency()}`],
      ...FRIEND_ORDER.map(k=>{
        const v=balance[k]||0;
        return [labelFor(k),v>=0?'Receive':'Owes',Math.abs(Math.round(v))];
      }),
      [],
      ['TRANSACTION HISTORY'],
      ['Created At','Category','Details','Item','Original Amount','Currency',`Settlement Value ${MONEY.getHomeCurrency()}`,'FX Rate','FX Date','Paid By','Type','Split Mode','Split Between','Custom Shares','Consumed By','Edited At'],
      ...expenseOnly(arr).map(e=>[
        e.createdAt||'',
        e.category||'',
        e.details||'',
        e.item||'',
        MONEY.normalizeAmount(e.total),
        expenseCurrencyCode(e),
        FORMATTER.decimal(homeAmountFor(e)||0,2),
        e.fxRate||'',
        e.fxRateDate||'',
        labelFor(e.paidBy),
        e.type==='personal'?'Personal':'Shared',
        e.splitMode||'equal',
        (e.split||[]).map(labelFor).join(' | '),
        Object.entries(e.shares||{}).map(([k,v])=>`${labelFor(k)}: ${FORMATTER.decimal(MONEY.normalizeAmount(v),2)}`).join(' | '),
        e.consumedBy?labelFor(e.consumedBy):'',
        e.editedAt||''
      ])
    ];
    const csv='\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const date=new Date().toISOString().slice(0,10);
    a.href=url;
    const slug=String(TRIP_CONFIG.shortName||TRIP_CONFIG.destination||TRIP_CONFIG.tripName||'Trip').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');
    a.download=`${slug||'Trip'}-Expenses-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  window.editExpense=function(i){
    const arr=readExpenses();
    observeExpenseShadow('edit-load',arr);
    const e=arr[i]; if(!e) return;
    if(isSettlementCheckpoint(e))return;
    editingExpenseIndex=i;
    const item=document.getElementById('expenseItem'); if(item) item.value=e.details || (e.category ? '' : (e.item||''));
    window.setExpenseCategory(e.category || 'Other');
    const total=document.getElementById('expenseTotal'); if(total) total.value=e.total||''; expenseTotalDerivedFromCustom=false;
    expenseCurrency=expenseCurrencyCode(e);
    expenseRateRecord=e.fxRate?{rate:Number(e.fxRate),date:e.fxRateDate||'',source:e.fxRateSource||'saved'}:MONEY.readCachedRate();
    renderExpenseCurrencyToggle();
    syncExpenseAmountCurrencyLabel();
    updateExpenseFxHelper();
    setSelectValue('expensePaidBy',e.paidBy||currentUser());
    const multiplePayers=document.getElementById('expenseMultiplePayers');if(multiplePayers)multiplePayers.checked=!!(e.payerContributions&&Object.keys(e.payerContributions).length>1);multiplePayerAuthority='total';window.renderPayerContributions(e.payerContributions||{});
    setSelectValue('expensePersonalPaidBy',e.paidBy||currentUser());
    const personal=(e.type==='personal');
    const personalBox=document.getElementById('expensePersonal'); if(personalBox) personalBox.checked=personal;
    const consumed=document.getElementById('expenseConsumedBy');
    if(consumed){
      consumed.value=e.consumedBy || ((e.split||[])[0]) || e.paidBy || currentUser();
      consumed.dataset.manual=personal && consumed.value!==e.paidBy ? 'true':'false';
    }
    document.querySelectorAll('#expenseModal input[data-split]').forEach(x=>x.checked=(e.split||[]).includes(x.value));
    expenseSplitMode=e.splitMode==='custom'?'custom':'equal';
    try{updateExpenseMode();}catch(e){}
    window.updateSplitUI();
    if(expenseSplitMode==='custom' && e.shares){
      Object.entries(e.shares).forEach(([k,v])=>{const input=document.getElementById(`customShare_${k}`);if(input&&!input.readOnly) input.value=FORMATTER.decimal(MONEY.normalizeAmount(v),2);});
      window.updateSplitUI();
    }
    const title=document.getElementById('expenseModalTitle'); if(title) title.innerHTML='<span class="expense-title-emoji" aria-hidden="true">💰</span> Edit expense';
    const save=document.getElementById('expenseSaveButton'); if(save) save.textContent='Update Expense';
    const modal=document.getElementById('expenseModal'); if(modal) modal.classList.add('show');
  };

  window.deleteExpense=function(i){
    const arr=readExpenses();
    if(!arr[i]) return;
    if(!canManageExpense(arr[i])) return alert('Only the party that added this expense, or Trip Studio, can delete it.');
    const deletingCheckpoint=isSettlementCheckpoint(arr[i]);
    if(!window.confirm(deletingCheckpoint?'Remove this settlement checkpoint?\n\nBalances will include the earlier expenses again.':`Delete "${arr[i].item||'this expense'}"?\n\nThis cannot be undone.`)) return;
    const previousRecord=Object.assign({},arr[i]);
    window.EXPENSE_SYNC?.markDeleted(arr[i]);
    arr.splice(i,1);
    writeExpenses(arr);
    window.EXPENSE_SYNC?.queueSync();
    try{
      window.CCMV_EXPENSE_DUAL_WRITE?.afterLegacyWrite({
        action:'delete',legacyRecords:readExpenses(),targetIndex:i,previousRecord
      });
    }catch(error){}
    if(editingExpenseIndex===i) editingExpenseIndex=null;
    window.renderExpenses('delete');
  };

  window.resetExpenseForm=resetExpenseForm;
  document.addEventListener('travelengine:expensesyncchanged',()=>window.renderExpenses());
  document.addEventListener('travelengine:expensesyncstatus',event=>{
    const badge=document.getElementById('expenseSyncStatus');
    if(!badge)return;
    const detail=event.detail||{};
    badge.textContent=detail.message||'Saved on this device';
    badge.dataset.state=detail.status||'idle';
  });
  document.addEventListener('DOMContentLoaded',()=>{
    setExportVisibility();
    window.updateSplitUI();
    window.renderExpenses();
    if(MONEY.getExpenseCurrencies().length>1){getExpenseRateRecord().then(()=>{updateExpenseFxHelper();window.renderExpenses();});}
    const initial=window.EXPENSE_SYNC?.getState?.();
    const badge=document.getElementById('expenseSyncStatus');
    if(badge&&initial){badge.textContent=initial.message;badge.dataset.state=initial.status;}
    window.EXPENSE_SYNC?.syncNow();
  });
})();
