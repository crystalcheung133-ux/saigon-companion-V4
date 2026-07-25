/* expenses-runtime.js - CCMV Travel Engine reusable owner.
   Owns the existing Frozen VN Expenses behaviour; calculations and schema are unchanged.
   Vietnam-specific values are supplied by config/data modules. */
function updateExpenseMode(){
  const personal = document.getElementById('expensePersonal')?.checked;
  const custom = document.getElementById('expenseCustom')?.checked;
  const splitBlock = document.getElementById('splitBetweenBlock');
  const consumedBlock = document.getElementById('consumedByBlock');
  if(splitBlock) splitBlock.style.display = personal ? 'none' : 'block';
  const customBlock=document.getElementById('customSplitBlock'); if(customBlock) customBlock.style.display=(!personal&&custom)?'block':'none';
  const equalBlock=document.getElementById('equalSplitChoices'); if(equalBlock) equalBlock.style.display=(!personal&&!custom)?'block':'none';
  if(consumedBlock) consumedBlock.style.display = personal ? 'block' : 'none';
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

/* ============================================================================
   STAGE 4F-Q — EXPENSES SINGLE CANONICAL MODULE
   ----------------------------------------------------------------------------
   One active implementation owns the Expenses open/save/reset/render/edit/
   delete/history flow. Storage schema, UI copy, modal behaviour and calculations
   are unchanged from the deploy-tested Stage 4F-P baseline.
   ============================================================================ */
(function(){
  const FRIEND_ORDER=VN_PRESENTATION.participants.order;

  function currentUser(){
    try{return (typeof getFriend==='function' ? getFriend() : STORAGE.local.get(STORAGE_CONFIG.keys.friend,VN_PRESENTATION.participants.defaultKey));}
    catch(e){return VN_PRESENTATION.participants.defaultKey;}
  }
  function labelFor(k){
    try{return participantLabel(k);}
    catch(e){return k||'';}
  }
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
    setSelectValue('expensePaidBy',user);
    const personal=document.getElementById('expensePersonal'); if(personal) personal.checked=false;
    const custom=document.getElementById('expenseCustom'); if(custom) custom.checked=false;
    document.querySelectorAll('[data-custom-split]').forEach(x=>x.value='');
    const consumed=document.getElementById('expenseConsumedBy');
    if(consumed){consumed.dataset.manual='false';setSelectValue('expenseConsumedBy',user);}
    try{splitAll();}
    catch(e){document.querySelectorAll('#expenseModal input[data-split]').forEach(x=>x.checked=true);}
    try{updateExpenseMode();}catch(e){}
    const title=document.getElementById('expenseModalTitle'); if(title) title.textContent='💰 What did we spend?';
    const save=document.getElementById('expenseSaveButton'); if(save) save.textContent='Save';
    ensurePaidByUI();
    updatePaidByDisplay();
  }
  function expenseCard(e){
    const personal=e.type==='personal';
    const split=e.split||[];
    const consumer=e.consumedBy || split[0] || e.paidBy;
    const who=personal ? `Consumed by ${labelFor(consumer)}` : `Split: ${split.map(labelFor).join(' · ')}`;
    return `<div class="expense-card"><strong>${escapeHTML(e.item||'')}</strong><p class="timestamp">${timeLabel(e.createdAt)}${e.editedAt?` · Edited ${timeLabel(e.editedAt)}`:''}</p><p>${Number(e.total||0).toLocaleString()} VND · Paid by ${labelFor(e.paidBy)}</p><p>${personal?'Personal Expense':'Shared Expense'} · ${who}</p><div class="entry-actions"><button class="mini-btn" onclick="editExpense(${e._idx})">✏️ Edit</button><button class="mini-btn" onclick="deleteExpense(${e._idx})">🗑 Delete</button></div></div>`;
  }
  function ensureToolHistory(){
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
    const custom=!!document.getElementById('expenseCustom')?.checked;
    const split=[...document.querySelectorAll('#expenseModal input[data-split]:checked')].map(x=>x.value);
    const consumedBy=document.getElementById('expenseConsumedBy')?.value || paidBy;
    if(!item || !total) return alert('Please complete item and total.');
    if(!personal && !custom && !split.length) return alert('Please choose who to split between.');
    let customAllocations=null;
    if(!personal&&custom){customAllocations={};document.querySelectorAll('[data-custom-split]').forEach(x=>{const v=Number(String(x.value||'').replace(/[^0-9.]/g,''));if(v)customAllocations[x.dataset.customSplit]=v});const sum=Object.values(customAllocations).reduce((a,b)=>a+b,0);if(Math.abs(sum-total)>1)return alert('Custom split amounts must equal the total.');}

    const arr=readExpenses();
    const now=new Date().toISOString();
    const operationIndex=editingExpenseIndex;
    const operation=operationIndex!==null?'update':'create';
    const previousRecord=operationIndex!==null&&arr[operationIndex]?Object.assign({},arr[operationIndex]):null;
    const data={item,total,paidBy,type:personal?'personal':'shared',split:personal?[consumedBy]:(custom?Object.keys(customAllocations):split),customAllocations:custom?customAllocations:null,consumedBy:personal?consumedBy:null,createdAt:now};
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
          Object.entries(CCMV_EXPENSE_CALC.allocations(e)).forEach(([k,share])=>{if(!personalSpend[k]) personalSpend[k]=0;if(!balance[k]) balance[k]=0;personalSpend[k]+=share;balance[k]-=share;});
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
        Object.entries(CCMV_EXPENSE_CALC.allocations(e)).forEach(([k,share])=>{if(!(k in personalSpend))personalSpend[k]=0;if(!(k in balance))balance[k]=0;personalSpend[k]+=share;balance[k]-=share;});
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
    const custom=document.getElementById('expenseCustom');if(custom)custom.checked=!!e.customAllocations;document.querySelectorAll('[data-custom-split]').forEach(x=>x.value=e.customAllocations?.[x.dataset.customSplit]||'');
    try{updateExpenseMode();}catch(e){}
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
    window.renderExpenses();
  });
})();


/* VN capability UI v2: NZ-proven expense interaction without category. */
(function(){
  let calculatorTarget='expenseTotal';
  window.setExpenseType=function(type){
    const personal=type==='personal';
    document.getElementById('expensePersonal').checked=personal;
    document.getElementById('expenseSharedTab')?.classList.toggle('active',!personal);
    document.getElementById('expensePersonalTab')?.classList.toggle('active',personal);
    document.getElementById('splitPickerWrap').style.display=personal?'none':'';
    updateExpenseMode();
  };
  window.setSplitMode=function(mode){
    const custom=mode==='custom'; document.getElementById('expenseCustom').checked=custom;
    document.getElementById('equalModeBtn')?.classList.toggle('active',!custom);
    document.getElementById('customModeBtn')?.classList.toggle('active',custom);
    updateExpenseMode(); if(custom) recalculateCustomRemainder();
  };
  window.clearExpenseField=function(id){const el=document.getElementById(id);if(el){el.value='';el.focus();}recalculateCustomRemainder();};
  window.clearCustomParty=function(p){const el=document.querySelector(`[data-custom-split="${p}"]`);if(el){el.value='';el.focus();}recalculateCustomRemainder();};
  window.recalculateCustomRemainder=function(){
    const total=Number(String(document.getElementById('expenseTotal')?.value||'').replace(/[^0-9.]/g,''));
    const keys=['christal','crystal','mero']; let used=0; keys.forEach(k=>used+=Number(String(document.querySelector(`[data-custom-split="${k}"]`)?.value||'').replace(/[^0-9.]/g,''))||0);
    const last=document.querySelector('[data-custom-split="vivian"]'); const msg=document.getElementById('customBalanceMessage');
    if(!last)return; if(!total){last.value='';if(msg)msg.textContent='Enter the total amount first.';return;}
    const remainder=total-used; last.value=remainder>=0?String(Math.round(remainder)):'';
    if(msg)msg.textContent=remainder<0?`Over total by ${Math.abs(Math.round(remainder)).toLocaleString()} VND`:`Remaining ${Math.round(remainder).toLocaleString()} VND assigned to Vivian.`;
    msg?.classList.toggle('error',remainder<0);
  };
  window.applySplitPreset=function(){const v=document.getElementById('expenseSplitPreset')?.value;if(v==='all')splitAll();else document.getElementById('equalSplitChoices')?.scrollIntoView({block:'nearest'});syncSplitPreset();};
  window.syncSplitPreset=function(){const boxes=[...document.querySelectorAll('#equalSplitChoices [data-split]')];const all=boxes.every(x=>x.checked);const sel=document.getElementById('expenseSplitPreset');if(sel)sel.value=all?'all':'choose';};
  window.openExpenseCalculator=function(target){calculatorTarget=target||'expenseTotal';document.getElementById('calculatorExpression').value=document.getElementById(calculatorTarget)?.value||'';document.getElementById('expenseCalculator')?.classList.add('show');setTimeout(()=>document.getElementById('calculatorExpression')?.focus(),50);};
  window.openExpenseCalculatorForParty=function(p){openExpenseCalculator(`custom-${p}`); calculatorTarget=`custom-${p}`; const el=document.querySelector(`[data-custom-split="${p}"]`);document.getElementById('calculatorExpression').value=el?.value||'';};
  window.closeExpenseCalculator=function(){document.getElementById('expenseCalculator')?.classList.remove('show');};
  window.clearCalculator=function(){const el=document.getElementById('calculatorExpression');el.value='';el.focus();};
  window.applyCalculatorResult=function(){const raw=document.getElementById('calculatorExpression')?.value||'';if(!/^[0-9+\-*/().\s]+$/.test(raw))return alert('Use numbers and + − × ÷ only.');let result;try{result=Function(`"use strict";return (${raw})`)()}catch(e){return alert('Invalid calculation.')}if(!Number.isFinite(result)||result<0)return alert('Invalid calculation.');result=Math.round(result);if(calculatorTarget.startsWith('custom-')){const p=calculatorTarget.slice(7);const el=document.querySelector(`[data-custom-split="${p}"]`);if(el)el.value=result;}else{const el=document.getElementById(calculatorTarget);if(el)el.value=result;}closeExpenseCalculator();recalculateCustomRemainder();};
  document.addEventListener('DOMContentLoaded',()=>{setExpenseType('shared');setSplitMode('equal');syncSplitPreset();});
})();
