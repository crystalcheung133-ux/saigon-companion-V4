const fs=require('fs');
const e=fs.readFileSync('expenses.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(e.includes('const EXPENSE_FX_ADJUSTMENT=1.003'), 'missing +0.3% expense FX adjustment');
ok(e.includes('fxReferenceRate:'), 'reference FX not preserved');
ok(e.includes('fxAdjustment:'), 'FX adjustment not preserved');
ok(e.includes('function syncMultiplePayerTotal()'), 'multiple payer auto-total missing');
ok(e.includes("multiplePayerAuthority=expenseTotalValue()>0?'total':'payers'"), 'multiple-payer authority must preserve a pre-entered Total');
ok(e.includes("const derived=!!toggle.checked&&multiplePayerAuthority==='payers'"), 'payer-derived Total mode missing');
ok(e.includes("if(derived) totalInput.value=sum>0?FORMATTER.decimal(sum,2):''"), 'payer amounts must only overwrite Total in payer-authority mode');
ok(!e.includes('Total is calculated automatically.')&&!e.includes('Enter what each person paid.')&&!e.includes('incl. +0.3% card-rate adjustment'), 'developer/FX explanatory copy must stay out of user UI');
ok(e.includes("fxRecord=expenseRateRecord||MONEY.readCachedRate()"), 'Save must use an available rate before waiting for network');
ok(css.includes('RC29.98 — compact Multiple Payers mobile UI'), 'compact multiple-payer mobile UI guard missing');
ok(css.includes('grid-template-columns:92px minmax(0,1fr)'), 'mobile daypart rail collision guard missing');
console.log('RC29.97 expense authority PASS');
