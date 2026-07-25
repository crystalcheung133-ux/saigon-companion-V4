/* Shared production expense calculations. No DOM/storage ownership. */
(function(root){'use strict';
 const parties=['christal','crystal','mero','vivian'];
 function allocations(e){
  const total=Number(e?.total||0);
  if(e?.type==='personal'){const k=e.consumedBy||(e.split||[])[0]||e.paidBy;return k?{[k]:total}:{};}
  if(e?.customAllocations&&typeof e.customAllocations==='object'){
   const out={}; parties.forEach(k=>{const v=Number(e.customAllocations[k]||0);if(v)out[k]=v;});
   const sum=Object.values(out).reduce((a,b)=>a+b,0); if(Math.abs(sum-total)<=1)return out;
  }
  const split=(e?.split?.length?e.split:[e?.paidBy]).filter(Boolean); const share=split.length?total/split.length:0;
  return Object.fromEntries(split.map(k=>[k,share]));
 }
 function summarise(records){const personalSpend=Object.fromEntries(parties.map(k=>[k,0]));const balance=Object.fromEntries(parties.map(k=>[k,0]));let total=0;
  (records||[]).forEach(e=>{const amount=Number(e.total||0);total+=amount;balance[e.paidBy]=(balance[e.paidBy]||0)+amount;Object.entries(allocations(e)).forEach(([k,v])=>{personalSpend[k]=(personalSpend[k]||0)+v;balance[k]=(balance[k]||0)-v;});});
  return {total,personalSpend,balance};
 }
 root.CCMV_EXPENSE_CALC=Object.freeze({parties:Object.freeze(parties),allocations,summarise});
})(globalThis);
