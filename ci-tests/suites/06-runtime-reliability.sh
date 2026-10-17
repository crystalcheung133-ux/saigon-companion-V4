#!/bin/sh
set -u
failed=0
echo "== RUNTIME RELIABILITY =="
node ci-tests/test-runtime-booking-persistence.js || failed=1
node ci-tests/test-runtime-indexeddb-lifecycle.js || failed=1
node ci-tests/test-runtime-reset-generation.js || failed=1
node ci-tests/test-runtime-reset-sequence.js || failed=1
node ci-tests/test-rc2982-clear-trip-records-scope.js || failed=1
node ci-tests/test-rc2983-guide-edit-session.js || failed=1
node ci-tests/test-rc2984-trip-presentation.js || failed=1
node ci-tests/test-rc2989-browser-fx-isolation.js || failed=1
[ "$failed" -eq 0 ] || exit 1
echo "RUNTIME RELIABILITY: PASS"

node ci-tests/test-rc2982-browser-cloud-isolation.js || failed=1
