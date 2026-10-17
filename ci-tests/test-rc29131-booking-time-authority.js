const fs=require('fs'),assert=require('assert');
const day=fs.readFileSync('day.html','utf8');
assert(/function\s+bookingAuthorityTime\s*\(item\)/.test(day),'booking authority helper missing');
assert(/const\s+authoritative\s*=\s*bookingAuthorityTime\(item\)/.test(day),'timeline must resolve booking authority');
assert(/item\.bookingId\s*&&\s*bookingAuthorityTime\(item\)/.test(day),'timeline editor must resolve booking authority');
// Time and venue names are intentionally not fixed: user edits must remain valid.
console.log('DYNAMIC BOOKING TIME AUTHORITY SOURCE CONTRACT: PASS');
