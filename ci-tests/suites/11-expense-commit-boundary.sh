#!/bin/sh
set -u
failed=0
echo "== EXPENSE COMMIT BOUNDARY =="
node ci-tests/test-expense-save-commit-boundary.js || failed=1
[ "$failed" -eq 0 ] || exit 1
echo "EXPENSE COMMIT BOUNDARY: PASS"
