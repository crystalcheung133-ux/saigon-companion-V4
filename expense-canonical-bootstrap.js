/* Stage 3.2D Vietnam production wiring.
   Loads the validation-only canonical path before expenses-runtime.js. */
(function(root){
  'use strict';
  if(root.TRIP_CONFIG?.features?.expenseCanonicalDualWrite!==true||root.CCMV_EXPENSE_DUAL_WRITE)return;
  document.write([
    'expense-calculator.js',
    'legacy-expense-adapter.js',
    'canonical-expense-repository.js',
    'canonical-expense-core.js',
    'canonical-expense-local-provider.js',
    'expense-dual-write.js'
  ].map(file=>`<script src="${file}?v=stage3-2d-vn-wiring-1"><\/script>`).join(''));
})(globalThis);
