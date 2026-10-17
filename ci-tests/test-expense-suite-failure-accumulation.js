const fs=require('fs'),assert=require('assert');
for(const file of ['ci-tests/suites/10-expense-save-safety.sh','ci-tests/suites/11-expense-commit-boundary.sh']){
  const s=fs.readFileSync(file,'utf8');
  assert(s.includes('failed=0'),file+': failure accumulator missing');
  assert(s.includes('|| failed=1'),file+': child test failure is not accumulated');
  assert(s.includes('[ "$failed" -eq 0 ] || exit 1'),file+': accumulated failure is not propagated');
}
console.log('EXPENSE SUITE FAILURE ACCUMULATION: PASS');
