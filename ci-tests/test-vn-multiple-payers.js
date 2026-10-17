const fs=require('fs'),assert=require('assert');const h=fs.readFileSync('expenses.html','utf8'),e=fs.readFileSync('expenses.js','utf8'),x=fs.readFileSync('export-runtime.js','utf8');
assert(h.includes('expenseMultiplePayers')&&h.includes('payerContributionsPanel'));
for(const q of ['payerContributionsForExpense','payerContributionsForSave','payerContributions:personal?null:payerContributions'])assert(e.includes(q),q);
for(const q of ['expensePayerContributions','expensePayerLabel','payerParts=expensePayerContributions(e)'])assert(x.includes(q),q);
console.log('VN MULTIPLE PAYERS: PASS');
