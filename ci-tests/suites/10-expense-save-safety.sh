#!/bin/sh
set -u
failed=0
echo "== EXPENSE SAVE SAFETY =="
node ci-tests/test-expense-save-safety.js || failed=1
node ci-tests/test-expense-modal-scroll-reset.js || failed=1
node ci-tests/test-rc2990-expense-entry-scroll.js || failed=1
[ "$failed" -eq 0 ] || exit 1
echo "EXPENSE SAVE SAFETY: PASS"
