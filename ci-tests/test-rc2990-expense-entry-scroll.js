const fs=require('fs'),assert=require('assert');
const e=fs.readFileSync('expenses.js','utf8');
const h=fs.readFileSync('expenses.html','utf8');
assert(h.includes('oninput="handleExpenseTotalInput()"'),'Total typing must not rebuild split UI');
assert(e.includes('expenseTotalDerivedFromCustom'),'Custom split -> Total state missing');
assert(e.includes('handleCustomSplitInput()'),'Custom typing handler missing');
assert(e.includes('leave the field to check the balance'),'Manual Total must defer Remaining until blur');
assert(e.includes('Current total:'),'Derived Total feedback missing');
assert(e.includes('remaining · ${blanks} blank.'),'Blank/remaining feedback missing');
assert(e.includes('✓ Matches total'),'Match feedback missing');
assert(e.includes('beginCustomSplitClear()'),'Clear suppression missing');
assert(e.includes('suppressNextCustomAutofill'),'Clear must not trigger blur autofill');
assert(e.includes('previousHistoryScrollTop'),'History scroll preservation missing');
assert(e.includes('nextHistory.scrollTop=Math.min(previousHistoryScrollTop'),'History scroll restore missing');

const ex=fs.readFileSync('export-runtime.js','utf8');
assert(ex.includes('SPENDING SUMMARY - LIFETIME'),'Share PDF must keep lifetime spending');
assert(ex.includes('CURRENT SETTLEMENT PERIOD'),'Share PDF must separate current settlement period');
assert(ex.includes('FINAL SETTLEMENT'),'Share PDF must show final settlement');
assert(ex.includes("e.type==='settlement_checkpoint'"),'Share summary must understand Settle to here checkpoints');
assert(ex.includes("String(e.createdAt||'')>through"),'Final settlement must exclude settled history');
assert(ex.includes('<strong>${escapeHtml(e.item||\'Expense\')}</strong>'),'Transaction title must be bold');
assert(ex.includes('Paid by <strong>${escapeHtml(expensePayerLabel(e))}</strong>'),'Paid-by person(s) must be bold');
assert(ex.includes('Share PDF')&&ex.includes('Share Excel'),'Share Summary must offer PDF and Excel');

console.log('RC29.93 expense entry + share summary regression PASS');
