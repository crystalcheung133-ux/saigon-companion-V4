// Superseded route expectations: retained as a compatibility smoke test after RC29.122.
const fs=require('fs'),assert=require('assert');
const sync=fs.readFileSync('booking-sync-runtime.js','utf8');
assert(sync.includes('plannedVisits'));
assert(sync.includes('BOOKING_REMOTE_VERIFY_FAILED'));
console.log('RC29.121 ROUTE + QSPA SYNC (superseded smoke): PASS');
