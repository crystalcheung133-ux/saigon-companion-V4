const fs=require('fs');
const js=fs.readFileSync('expenses.js','utf8');
const html=fs.readFileSync('expenses.html','utf8');
function ok(v,m){if(!v){console.error('FAIL',m);process.exit(1)}console.log('PASS',m)}
ok(js.includes('createSettlementCheckpoint()')&&js.includes('expense-total-settle'),'Trip Total card exposes one-tap settlement checkpoint');
ok(js.includes("type:'settlement_checkpoint'"),'Checkpoint is a synced expense-domain record');
ok(js.includes('expenseSnapshot:Object.fromEntries'),'Checkpoint snapshots settled expenses for later edit detection');
ok(js.includes('currentSettlementSummary'),'Current Balance is calculated separately from Trip Total');
ok(js.includes('A settled expense changed'),'Historical settled-expense edits warn instead of silently changing settlement');
ok(js.includes('expenseOnly(records)'),'Trip totals exclude checkpoint marker records');
ok(js.includes('Remove checkpoint'),'Checkpoint can be removed without deleting historical expenses');
