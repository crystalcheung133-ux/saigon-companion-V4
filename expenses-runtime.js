/* expenses-runtime.js - CCMV Travel Engine reusable owner.
   Owns the existing Frozen VN Expenses behaviour; calculations and schema are unchanged.
   Vietnam-specific values are supplied by config/data modules. */
function updateExpenseMode(){
  const personal = document.getElementById('expensePersonal')?.checked;
  const splitBlock = document.getElementById('splitBetweenBlock');
  const sharedControls = document.getElementById('sharedControls');
  const splitChoices = document.getElementById('splitPartyChoices');
  const splitSummary = document.getElementById('splitBySummary');
  const consumed = document.getElementById('expenseConsumedBy');
  const secondLabel = document.getElementById('expenseSecondControlLabel');
  if(splitBlock) splitBlock.hidden = !!personal;
  if(sharedControls) sharedControls.hidden = false;
  if(splitChoices && personal) splitChoices.hidden = true;
  if(splitSummary) splitSummary.hidden = !!personal;
  if(consumed) consumed.hidden = !personal;
  if(secondLabel) secondLabel.textContent = personal ? 'For' : 'Split by';
  document.querySelectorAll('[data-expense-type]').forEach(btn=>btn.classList.toggle('active',btn.dataset.expenseType===(personal?'personal':'shared')));
  if(personal) syncConsumedIfAuto();
}
function syncConsumedIfAuto(){
  const paid = document.getElementById('expensePaidBy');
  const consumed = document.getElementById('expenseConsumedBy');
  if(!paid || !consumed) return;
  if(consumed.dataset.manual !== 'true') consumed.value = paid.value;
}
function markConsumedManual(){
  const consumed = document.getElementById('expenseConsumedBy');
  if(consumed) consumed.dataset.manual = 'true';
}

/* Stage 4C-6: legacy top-level Expenses handlers were removed.
   Active Expenses API lives in the Stage 4F-Q single canonical module
   near the end of this file. Keep closeExpenseModal as a simple modal
   utility because HTML buttons call it directly. */
function closeExpenseModal(){const m=$('expenseModal'); if(m) m.classList.remove('show')}

function splitAll() {
  document.querySelectorAll('#expenseModal input[data-split]').forEach(x => x.checked = true);
}

function clearAllSplit() {
  document.querySelectorAll('#expenseModal input[data-split]').forEach(x => x.checked = false);
}


let expenseCalculatorTarget='expenseTotal';
let expenseCalculatorExpression='';
function setExpenseType(type){const box=document.getElementById('expensePersonal');if(box){box.checked=type==='personal';updateExpenseMode();}}
function clearExpenseValidation(id){const input=document.getElementById(id);const error=document.getElementById(id+'Error');if(input)input.classList.remove('expense-field-invalid');if(error)error.hidden=true;}
function showExpenseValidation(id,message){const input=document.getElementById(id);const error=document.getElementById(id+'Error');if(input)input.classList.add('expense-field-invalid');if(error){error.textContent=message;error.hidden=false;}}
function clearExpenseField(id){const input=document.getElementById(id);if(input){input.value='';clearExpenseValidation(id);input.focus();try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}}}
function toggleSplitChoices(){const panel=document.getElementById('splitPartyChoices');if(panel) panel.hidden=!panel.hidden;}
function updateSplitSummary(){const selected=[...document.querySelectorAll('#expenseModal input[data-split]:checked')];const all=document.querySelectorAll('#expenseModal input[data-split]').length;const button=document.getElementById('splitBySummary');if(button){const text=selected.length===all?'All':selected.length?`${selected.length} selected`:'None';button.innerHTML=`${text} <span>⌄</span>`;}}
function openExpenseCalculator(targetId){expenseCalculatorTarget=targetId||'expenseTotal';const target=document.getElementById(expenseCalculatorTarget);expenseCalculatorExpression=String(target?.value||'').replace(/[^0-9.+\-*/()]/g,'');const display=document.getElementById('expenseCalculatorDisplay');if(display)display.textContent=expenseCalculatorExpression||'0';document.getElementById('expenseCalculatorModal')?.classList.add('show');}
function closeExpenseCalculator(){document.getElementById('expenseCalculatorModal')?.classList.remove('show');}
function safeExpenseCalculation(expression){if(!/^[0-9+\-*/().\s]+$/.test(expression||''))throw new Error('Invalid');return Function(`"use strict";return (${expression})`)();}
function calcPress(key){if(key==='C')expenseCalculatorExpression='';else if(key==='⌫')expenseCalculatorExpression=expenseCalculatorExpression.slice(0,-1);else if(key==='='){try{expenseCalculatorExpression=String(Math.round(safeExpenseCalculation(expenseCalculatorExpression)*100)/100);}catch(e){expenseCalculatorExpression='';}}else expenseCalculatorExpression+=key;const display=document.getElementById('expenseCalculatorDisplay');if(display)display.textContent=expenseCalculatorExpression||'0';}
function useExpenseCalculatorResult(){try{const value=Math.round(safeExpenseCalculation(expenseCalculatorExpression)*100)/100;const target=document.getElementById(expenseCalculatorTarget);if(target){target.value=String(value);target.dispatchEvent(new Event('input',{bubbles:true}));}closeExpenseCalculator();}catch(e){alert('Please complete the calculation first.');}}

/* ============================================================================
   STAGE 4F-Q — EXPENSES SINGLE CANONICAL MODULE
   ----------------------------------------------------------------------------
   One active implementation owns the Expenses open/save/reset/render/edit/
   delete/history flow. Storage schema, UI copy, modal behaviour and calculations
   are unchanged from the deploy-tested Stage 4F-P baseline.
   ============================================================================ */
(function(){
  const FRIEND_ORDER=VN_PRESENTATION.participants.order;
  const MONEY=window.CCMV_EXPENSE_CALCULATOR||Object.freeze({
    normalizeAmount(value){const amount=Number(String(value==null?'':value).replace(/[^0-9.]/g,''));return Number.isFinite(amount)?amount:0;},
    automaticRemainder(total,used){return this.normalizeAmount(total)-Array.from(used||[]).reduce((sum,value)=>sum+this.normalizeAmount(value),0);},
    validateCustomAllocations(total,allocations,tolerance){const allocated=Array.from(allocations||[]).reduce((sum,row)=>sum+this.normalizeAmount(row&&row.amount),0);const difference=this.normalizeAmount(total)-allocated;return {valid:Array.from(allocations||[]).length>0&&Math.abs(difference)<=Math.abs(Number(tolerance??0.01)),allocated,difference};}
  });
  let expenseSplitMode='equal';


  function selectedSplit(){
    return [...document.querySelectorAll('#expenseModal input[data-split]:checked')].map(x=>x.value);
  }
  function renderCustomSplitPanel(values){
    const panel=document.getElementById('customSplitPanel'); if(!panel) return;
    const previous=values||Object.fromEntries([...panel.querySelectorAll('input[data-custom-party]')].map(i=>[i.dataset.customParty,i.value]));
    const selected=selectedSplit();
    panel.hidden=expenseSplitMode!=='custom';
    panel.innerHTML=selected.map(k=>`<label class="custom-split-row"><span class="custom-party-label"><span class="party-emoji">${emojiFor(k)}</span><span>${plainLabelFor(k)}</span></span><div class="custom-split-field"><input data-custom-party="${k}" inputmode="decimal" type="text" value="${previous[k]??''}" placeholder="0" oninput="recalculateCustomSplit()" onblur="autofillCustomRemainderOnExit('${k}')"><button class="custom-clear-btn" type="button" onclick="clearCustomAmount('${k}')">Clear</button><button class="custom-remainder-btn" type="button" onclick="calculateCustomRemainder('${k}')" aria-label="Calculate remainder for ${plainLabelFor(k)}"><svg class="calculator-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="2.75" width="16" height="18.5" rx="2.25"></rect><rect class="calculator-screen" x="7" y="5.5" width="10" height="3.5" rx=".6"></rect><circle cx="8" cy="12.5" r="1"></circle><circle cx="12" cy="12.5" r="1"></circle><circle cx="16" cy="12.5" r="1"></circle><circle cx="8" cy="16.5" r="1"></circle><circle cx="12" cy="16.5" r="1"></circle><circle cx="16" cy="16.5" r="1"></circle></svg></button></div></label>`).join('')+`<p class="custom-split-status" id="customSplitStatus"></p>`;
    recalculateCustomSplit();
  }
  function customShares(){
    const out={};
    selectedSplit().forEach(k=>{out[k]=MONEY.normalizeAmount(document.querySelector(`[data-custom-party="${k}"]`)?.value);});
    return out;
  }
  function updateSplitModeUI(){
    document.querySelectorAll('[data-split-mode]').forEach(b=>b.classList.toggle('active',b.dataset.splitMode===expenseSplitMode));
    renderCustomSplitPanel();
  }
  window.setExpenseSplitMode=function(mode){expenseSplitMode=mode==='custom'?'custom':'equal';updateSplitModeUI();};
  window.recalculateCustomSplit=function(){
    const status=document.getElementById('customSplitStatus'); if(!status||expenseSplitMode!=='custom') return;
    const total=MONEY.normalizeAmount(document.getElementById('expenseTotal')?.value);
    const result=MONEY.validateCustomAllocations(total,Object.entries(customShares()).map(([partyId,amount])=>({partyId,amount})),0.01);
    status.className='custom-split-status '+(result.valid?'valid':result.difference<0?'invalid':'pending');
    status.textContent=result.valid?'Allocated total matches.':result.difference<0?`Over-allocated by ${Math.abs(result.difference).toLocaleString()} VND.`:`Under-allocated by ${result.difference.toLocaleString()} VND.`;
  };
  window.calculateCustomRemainder=function(target){
    const total=MONEY.normalizeAmount(document.getElementById('expenseTotal')?.value);
    const used=selectedSplit().filter(k=>k!==target).map(k=>document.querySelector(`[data-custom-party="${k}"]`)?.value);
    const remainder=MONEY.automaticRemainder(total,used);
    if(remainder<0){const status=document.getElementById('customSplitStatus');if(status){status.className='custom-split-status invalid';status.textContent=`Over-allocated by ${Math.abs(remainder).toLocaleString()} VND.`;}return;}
    const input=document.querySelector(`[data-custom-party="${target}"]`); if(input){input.value=String(remainder);recalculateCustomSplit();}
  };
  window.autofillCustomRemainderOnExit=function(){
    if(expenseSplitMode!=='custom') return;
    const inputs=[...document.querySelectorAll('#customSplitPanel input[data-custom-party]')];
    const blanks=inputs.filter(i=>i.value.trim()==='');
    if(blanks.length===1){const target=blanks[0].dataset.customParty;calculateCustomRemainder(target);}
  };
  window.clearCustomAmount=function(party){const input=document.querySelector(`[data-custom-party="${party}"]`);if(input){input.value='';input.focus();recalculateCustomSplit();}};

  function currentUser(){
    try{return (typeof getFriend==='function' ? getFriend() : STORAGE.local.get(STORAGE_CONFIG.keys.friend,VN_PRESENTATION.participants.defaultKey));}
    catch(e){return VN_PRESENTATION.participants.defaultKey;}
  }
  function labelFor(k){
    try{return participantLabel(k);}
    catch(e){return k||'';}
  }
  function emojiFor(k){return ({christal:'🧸',crystal:'👓',mero:'✝️',vivian:'👟'})[k]||'';}
  function plainLabelFor(k){return ({christal:'Christal',crystal:'Crystal',mero:'Mero',vivian:'Vivian'})[k]||String(k||'');}
  function readExpenses(){
    try{return STORAGE.local.readJSON(STORAGE_CONFIG.keys.expenses,[]);}
    catch(e){return [];}
  }
  function observeExpenseShadow(action,records){
    try{window.CCMV_EXPENSE_READ_SHADOW?.observe({action,legacyRecords:records});}
    catch(error){}
  }
  function writeExpenses(arr){
    STORAGE.local.writeJSON(STORAGE_CONFIG.keys.expenses,Array.isArray(arr)?arr:[]);
  }
  function timeLabel(iso){
    try{return (typeof formatTime==='function') ? formatTime(iso) : (iso?new Date(iso).toLocaleString():'');}
    catch(e){return iso||'';}
  }
  function setSelectValue(id,value){
    const el=document.getElementById(id); if(!el) return;
    el.value=value;
    Array.from(el.options||[]).forEach(opt=>{opt.selected=(opt.value===value);});
    try{el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
  }
  function updatePaidByDisplay(){
    const hidden=document.getElementById('expensePaidBy');
    const paid=hidden?.value || currentUser();
    const display=document.getElementById('paidByDisplayName');
    if(display) display.textContent=labelFor(paid);
    document.querySelectorAll('#paidByChoices button').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.friend===paid);
    });
  }
  function ensurePaidByUI(){
    const select=document.getElementById('expensePaidBy');
    if(!select) return;
    if(!document.getElementById('paidByDisplay')){
      select.classList.add('paid-by-hidden-select');
      select.setAttribute('aria-hidden','true');
      select.tabIndex=-1;
      const panel=document.createElement('div');
      panel.className='paid-by-panel';
      panel.innerHTML=`<div class="paid-by-display" id="paidByDisplay"><span class="paid-by-current" id="paidByDisplayName">${labelFor(select.value||currentUser())}</span><button type="button" class="paid-by-change" id="paidByChangeButton">Change</button></div><div class="paid-by-choices" id="paidByChoices" hidden>${FRIEND_ORDER.map(k=>`<button type="button" data-friend="${k}">${labelFor(k)}</button>`).join('')}</div>`;
      select.insertAdjacentElement('afterend',panel);
      panel.querySelector('#paidByChangeButton')?.addEventListener('click',()=>{
        const choices=panel.querySelector('#paidByChoices'); if(choices) choices.hidden=!choices.hidden;
        updatePaidByDisplay();
      });
      panel.querySelectorAll('#paidByChoices button').forEach(btn=>{
        btn.addEventListener('click',()=>{
          setSelectValue('expensePaidBy',btn.dataset.friend);
          try{if(typeof syncConsumedIfAuto==='function') syncConsumedIfAuto();}catch(e){}
          const choices=panel.querySelector('#paidByChoices'); if(choices) choices.hidden=true;
          updatePaidByDisplay();
        });
      });
      select.addEventListener('change',updatePaidByDisplay);
    }
    updatePaidByDisplay();
  }
  function showExpenseSavedNote(){
    const sheet=document.querySelector('#expenseModal .tools-sheet');
    if(!sheet) return;
    let note=document.getElementById('expenseSavedNote');
    if(!note){
      note=document.createElement('div');
      note.id='expenseSavedNote';
      note.className='expense-saved-note';
      note.textContent='✓ Expense saved. Ready for the next one.';
      const form=sheet.querySelector('.expense-form');
      sheet.insertBefore(note,form||sheet.firstChild);
    }
    note.classList.add('show');
    setTimeout(()=>note.classList.remove('show'),1400);
  }
  function resetExpenseForm(){
    editingExpenseIndex=null;
    const user=currentUser();
    const item=document.getElementById('expenseItem'); if(item) item.value='';
    const total=document.getElementById('expenseTotal'); if(total) total.value='';
    clearExpenseValidation('expenseItem');clearExpenseValidation('expenseTotal');
    setSelectValue('expensePaidBy',user);
    const personal=document.getElementById('expensePersonal'); if(personal) personal.checked=false;
    const consumed=document.getElementById('expenseConsumedBy');
    if(consumed){consumed.dataset.manual='false';setSelectValue('expenseConsumedBy',user);}
    expenseSplitMode='equal';
    try{splitAll();}
    catch(e){document.querySelectorAll('#expenseModal input[data-split]').forEach(x=>x.checked=true);}
    try{updateExpenseMode();updateSplitModeUI();updateSplitSummary();}catch(e){}
    const title=document.getElementById('expenseModalTitle'); if(title) title.textContent='💰 What did we spend?';
    const save=document.getElementById('expenseSaveButton'); if(save) save.textContent='Save';
    ensurePaidByUI();
    updatePaidByDisplay();
  }
  function expenseCard(e){
    const personal=e.type==='personal';
    const split=e.split||[];
    const consumer=e.consumedBy || split[0] || e.paidBy;
    const who=personal ? `Consumed by ${labelFor(consumer)}` : `${e.splitMode==='custom'?'Custom':'Equal'} split: ${split.map(labelFor).join(' · ')}`;
    return `<div class="expense-card"><strong>${escapeHTML(e.item||'')}</strong><p class="timestamp">${timeLabel(e.createdAt)}${e.editedAt?` · Edited ${timeLabel(e.editedAt)}`:''}</p><p>${Number(e.total||0).toLocaleString()} VND · Paid by ${labelFor(e.paidBy)}</p><p>${personal?'Personal Expense':'Shared Expense'} · ${who}</p><div class="entry-actions"><button class="mini-btn" onclick="editExpense(${e._idx})">✏️ Edit</button><button class="mini-btn" onclick="deleteExpense(${e._idx})">🗑 Delete</button></div></div>`;
  }
  function ensureToolHistory(){
    if(document.body.classList.contains('expenses-page')) return;
    const sheet=document.querySelector('#expenseModal .tools-sheet');
    if(!sheet || document.getElementById('toolTransactionHistory')) return;
    const form=sheet.querySelector('.expense-form');
    const holder=document.createElement('div');
    holder.className='tool-transaction-history';
    holder.id='toolTransactionHistory';
    if(form && form.parentNode) form.parentNode.insertBefore(holder,form.nextSibling);
    else sheet.appendChild(holder);
  }

  window.openExpenseModal=function(){
    ensurePaidByUI();
    resetExpenseForm();
    const modal=document.getElementById('expenseModal');
    if(modal) modal.classList.add('show');
    try{if(typeof renderLatestExpenseMini==='function') renderLatestExpenseMini();}catch(e){}
    const first=document.getElementById('expenseItem'); if(first) setTimeout(()=>first.focus(),60);
  };

  window.saveExpense=function(){
    ensurePaidByUI();
    const item=(document.getElementById('expenseItem')?.value||'').trim();
    const total=Number(String(document.getElementById('expenseTotal')?.value||'').replace(/[^0-9.]/g,''));
    const paidBy=document.getElementById('expensePaidBy')?.value || currentUser();
    const personal=!!document.getElementById('expensePersonal')?.checked;
    const split=selectedSplit();
    const consumedBy=document.getElementById('expenseConsumedBy')?.value || paidBy;
    let hasFieldError=false;
    clearExpenseValidation('expenseItem');
    clearExpenseValidation('expenseTotal');
    if(!item){showExpenseValidation('expenseItem','Please enter details.');hasFieldError=true;}
    if(!total){showExpenseValidation('expenseTotal','Please enter an amount.');hasFieldError=true;}
    if(hasFieldError){document.getElementById(!item?'expenseItem':'expenseTotal')?.focus();return;}
    if(!personal && !split.length) return alert('Please choose who to split between.');
    const splitMode=personal?'personal':expenseSplitMode;
    const shares=(!personal&&splitMode==='custom')?customShares():null;
    if(shares){
      const check=MONEY.validateCustomAllocations(total,Object.entries(shares).map(([partyId,amount])=>({partyId,amount})),0.01);
      if(!check.valid){recalculateCustomSplit();document.getElementById('customSplitPanel')?.scrollIntoView({block:'nearest'});return;}
    }

    const arr=readExpenses();
    const now=new Date().toISOString();
    const operationIndex=editingExpenseIndex;
    const operation=operationIndex!==null?'update':'create';
    const previousRecord=operationIndex!==null&&arr[operationIndex]?Object.assign({},arr[operationIndex]):null;
    const data={item:item||'Expense',total,paidBy,type:personal?'personal':'shared',split:personal?[consumedBy]:split,splitMode,shares:personal?null:shares,consumedBy:personal?consumedBy:null,createdAt:now};
    if(editingExpenseIndex!==null && arr[editingExpenseIndex]){
      data.createdAt=arr[editingExpenseIndex].createdAt || now;
      data.editedAt=now;
      arr[editingExpenseIndex]=data;
      editingExpenseIndex=null;
    }else{
      arr.push(data);
    }
    writeExpenses(arr);
    try{
      window.CCMV_EXPENSE_DUAL_WRITE?.afterLegacyWrite({
        action:operation,
        legacyRecords:readExpenses(),
        targetIndex:operationIndex!==null?operationIndex:arr.length-1,
        previousRecord
      });
    }catch(error){}
    window.renderExpenses(operation);
    resetExpenseForm();
    showExpenseSavedNote();
    const first=document.getElementById('expenseItem'); if(first) setTimeout(()=>first.focus(),60);
    // Intentional: keep modal open for quick multiple expense entry.
  };

  window.renderToolTransactionHistory=function(){
    if(document.body.classList.contains('expenses-page')) return;
    const box=document.getElementById('toolTransactionHistory');
    if(!box) return;
    const latest=readExpenses().map((e,i)=>({...e,_idx:i})).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).slice(0,5);
    box.innerHTML=`<h3>Transaction History</h3>${latest.length?latest.map(expenseCard).join(''):'<p class="timestamp">No transactions yet.</p>'}`;
  };

  window.renderExpenses=function(shadowAction){
    const pageBox=document.getElementById('expensePageList');
    const arr=readExpenses();
    observeExpenseShadow(typeof shadowAction==='string'?shadowAction:'render',arr);
    const sorted=arr.map((e,i)=>({...e,_idx:i})).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    if(pageBox){
      const total=arr.reduce((sum,e)=>sum+Number(e.total||0),0);
      const personalSpend={christal:0,crystal:0,mero:0,vivian:0};
      const balance={christal:0,crystal:0,mero:0,vivian:0};
      arr.forEach(e=>{
        const amount=Number(e.total||0);
        if(!balance[e.paidBy]) balance[e.paidBy]=0;
        balance[e.paidBy]+=amount;
        if(e.type==='personal'){
          const consumer=e.consumedBy || ((e.split||[])[0]) || e.paidBy;
          if(!personalSpend[consumer]) personalSpend[consumer]=0;
          if(!balance[consumer]) balance[consumer]=0;
          personalSpend[consumer]+=amount;
          balance[consumer]-=amount;
        }else{
          const split=(e.split&&e.split.length)?e.split:[e.paidBy];
          if(e.splitMode==='custom'&&e.shares&&typeof e.shares==='object'){
            split.forEach(k=>{const share=MONEY.normalizeAmount(e.shares[k]);if(!personalSpend[k]) personalSpend[k]=0;if(!balance[k]) balance[k]=0;personalSpend[k]+=share;balance[k]-=share;});
          }else{
            const share=amount/split.length;
            split.forEach(k=>{if(!personalSpend[k]) personalSpend[k]=0;if(!balance[k]) balance[k]=0;personalSpend[k]+=share;balance[k]-=share;});
          }
        }
      });
      const spendHtml=FRIEND_ORDER.map(k=>`<p>${labelFor(k)}<br><strong>${Math.round(personalSpend[k]||0).toLocaleString()} VND</strong></p>`).join('');
      const balanceHtml=FRIEND_ORDER.map(k=>{const v=balance[k]||0;return `<p>${labelFor(k)}<br><strong>${v>=0?'Receive':'Owes'} ${Math.abs(Math.round(v)).toLocaleString()} VND</strong></p>`;}).join('');
      pageBox.innerHTML=`<div class="expense-dashboard-v33"><div class="expense-total-card"><span>Trip Total</span><strong>${total.toLocaleString()} VND</strong><small>Shared + personal expenses</small></div><div class="expense-focus-grid"><div class="expense-focus-card"><h3>Personal Spend</h3>${spendHtml}</div><div class="expense-focus-card"><h3>Settlement</h3>${balanceHtml}</div></div></div><div class="expense-history-block"><h3>Transaction History</h3><p class="timestamp">最新交易會顯示喺最上面。</p><div class="transaction-scroll">${sorted.length?sorted.map(expenseCard).join(''):'<p>No transactions yet.</p>'}</div></div>`;
    }
    ensureToolHistory();
    window.renderToolTransactionHistory();
  };

  window.exportExpenseData=function(){
    const arr=readExpenses();
    if(!arr.length) return alert('No expense data to export yet.');
    const quote=value=>`"${String(value??'').replace(/"/g,'""')}"`;
    const total=arr.reduce((sum,e)=>sum+Number(e.total||0),0);
    const personalSpend={christal:0,crystal:0,mero:0,vivian:0};
    const balance={christal:0,crystal:0,mero:0,vivian:0};
    arr.forEach(e=>{
      const amount=Number(e.total||0);
      if(!(e.paidBy in balance)) balance[e.paidBy]=0;
      balance[e.paidBy]+=amount;
      if(e.type==='personal'){
        const consumer=e.consumedBy || ((e.split||[])[0]) || e.paidBy;
        if(!(consumer in personalSpend)) personalSpend[consumer]=0;
        if(!(consumer in balance)) balance[consumer]=0;
        personalSpend[consumer]+=amount;
        balance[consumer]-=amount;
      }else{
        const split=(e.split&&e.split.length)?e.split:[e.paidBy];
        split.forEach(k=>{
          const share=e.splitMode==='custom'&&e.shares?MONEY.normalizeAmount(e.shares[k]):amount/split.length;
          if(!(k in personalSpend)) personalSpend[k]=0;
          if(!(k in balance)) balance[k]=0;
          personalSpend[k]+=share;
          balance[k]-=share;
        });
      }
    });
    const rows=[
      ['CCMV SAIGON EXPENSE SUMMARY'],
      ['Trip Total VND',Math.round(total)],
      [],
      ['Personal Spend','Amount VND'],
      ...FRIEND_ORDER.map(k=>[labelFor(k),Math.round(personalSpend[k]||0)]),
      [],
      ['Settlement','Position','Amount VND'],
      ...FRIEND_ORDER.map(k=>{
        const v=balance[k]||0;
        return [labelFor(k),v>=0?'Receive':'Owes',Math.abs(Math.round(v))];
      }),
      [],
      ['TRANSACTION HISTORY'],
      ['Created At','Item','Total VND','Paid By','Type','Split Between','Consumed By','Edited At'],
      ...arr.map(e=>[
        e.createdAt||'',
        e.item||'',
        Number(e.total||0),
        labelFor(e.paidBy),
        e.type==='personal'?'Personal':'Shared',
        (e.split||[]).map(labelFor).join(' | '),
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
    a.download=`CCMV-Saigon-Expenses-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  window.editExpense=function(i){
    const arr=readExpenses();
    observeExpenseShadow('edit-load',arr);
    const e=arr[i]; if(!e) return;
    editingExpenseIndex=i;
    ensurePaidByUI();
    const item=document.getElementById('expenseItem'); if(item) item.value=e.item||'';
    const total=document.getElementById('expenseTotal'); if(total) total.value=e.total||'';
    setSelectValue('expensePaidBy',e.paidBy||'crystal');
    const personal=(e.type==='personal');
    const personalBox=document.getElementById('expensePersonal'); if(personalBox) personalBox.checked=personal;
    const consumed=document.getElementById('expenseConsumedBy');
    if(consumed){
      consumed.value=e.consumedBy || ((e.split||[])[0]) || e.paidBy || 'crystal';
      consumed.dataset.manual=personal && consumed.value!==e.paidBy ? 'true':'false';
    }
    document.querySelectorAll('#expenseModal input[data-split]').forEach(x=>x.checked=(e.split||[]).includes(x.value));
    expenseSplitMode=!personal&&e.splitMode==='custom'?'custom':'equal';
    try{updateExpenseMode();updateSplitModeUI();if(expenseSplitMode==='custom')renderCustomSplitPanel(e.shares||{});}catch(e){}
    const title=document.getElementById('expenseModalTitle'); if(title) title.textContent='✏️ Edit Expense';
    const save=document.getElementById('expenseSaveButton'); if(save) save.textContent='Update Expense';
    const modal=document.getElementById('expenseModal'); if(modal) modal.classList.add('show');
    updatePaidByDisplay();
  };

  window.deleteExpense=function(i){
    const arr=readExpenses();
    if(!arr[i]) return;
    const previousRecord=Object.assign({},arr[i]);
    arr.splice(i,1);
    writeExpenses(arr);
    try{
      window.CCMV_EXPENSE_DUAL_WRITE?.afterLegacyWrite({
        action:'delete',legacyRecords:readExpenses(),targetIndex:i,previousRecord
      });
    }catch(error){}
    if(editingExpenseIndex===i) editingExpenseIndex=null;
    window.renderExpenses('delete');
  };

  window.resetExpenseForm=resetExpenseForm;
  document.addEventListener('DOMContentLoaded',()=>{
    ensurePaidByUI();
    updatePaidByDisplay();
    document.querySelectorAll('#expenseModal input[data-split]').forEach(x=>x.addEventListener('change',()=>{updateSplitSummary();if(expenseSplitMode==='custom')renderCustomSplitPanel();}));
    document.getElementById('expenseTotal')?.addEventListener('input',()=>{clearExpenseValidation('expenseTotal');recalculateCustomSplit();});
    document.getElementById('expenseItem')?.addEventListener('input',()=>clearExpenseValidation('expenseItem'));
    window.renderExpenses();
  });
})();
