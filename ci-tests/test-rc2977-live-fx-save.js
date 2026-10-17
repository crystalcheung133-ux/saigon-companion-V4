const fs=require('fs'); const s=fs.readFileSync('expenses.js','utf8');
function ok(x,m){if(!x)throw new Error(m)}
ok(s.includes('getExpenseRateRecord(forceLive=false)'), 'force-live FX path missing');
ok(s.includes("if(!(Number(fxRecord?.rate)>0)) fxRecord=await getExpenseRateRecord(true)"), 'save must wait for live FX only when no usable rate exists');
ok(s.includes("else if(operation==='create') getExpenseRateRecord(true)"), 'new expense must refresh live FX asynchronously when a usable rate already exists');
ok(s.includes('MONEY.isCacheFresh(current)')&&s.includes('MONEY.isCacheFresh(cached)'), 'fresh-cache gate missing');
ok(s.includes('MONEY.fetchLatestRate()'), 'live FX fetch missing');
console.log('RC29.78 LIVE FX SAVE CONTRACT: PASS');
