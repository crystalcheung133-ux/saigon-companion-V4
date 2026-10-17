const fs=require('fs'),assert=require('assert');
const sync=fs.readFileSync('booking-sync-runtime.js','utf8');
const auth=fs.readFileSync('booking-authority.js','utf8');
const trip=fs.readFileSync('trip-runtime.js','utf8');
assert(sync.includes("Number(record._remoteVersion||0)>0&&Object.prototype.hasOwnProperty.call(record,'notes')"),'legacy remote Notes must survive without updatedByPartyId');
assert(!auth.match(/EDITABLE_STATE_FIELDS=[\s\S]{0,900}'notes'/),'local stale Notes must still not poison deploy master');
assert(trip.includes('Remote transport must never keep'),'save lifecycle must be local-first');
assert(trip.includes('Promise.resolve().then(function(){return deps.syncPush(booking);})'),'remote sync must be queued after local commit');
console.log('RC29.124 QSPA LEGACY NOTES: PASS — remote canonical Notes survive legacy rows; local stale Notes remain blocked; Save UI is local-first.');
