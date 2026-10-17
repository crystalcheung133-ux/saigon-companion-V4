const fs=require('fs'),assert=require('assert');
const data=fs.readFileSync('data.js','utf8'),trip=fs.readFileSync('trip-runtime.js','utf8');
function has(x,msg){assert(data.includes(x),msg);}
assert(/"hours"\s*:\s*"09:00–22:00 · verify directly"/.test(data),'Mộc Hương branch hours metadata missing');
has('"hours": "09:00–20:00 daily"','Nha Suga hours missing');
has('"hours": "08:30–22:00 daily"','Hạ Spa hours missing');
has('"hours": "09:30–23:00 daily"','Norah Spa 2 hours missing');
assert(/"address"\s*:\s*"03 Đặng Hữu Phổ, An Khánh, Hồ Chí Minh, Vietnam"/.test(data),'Mộc Hương address missing');
assert(!/\"SPA\"\s*:\s*\[[\s\S]*?\"key\": \"(?:moc-healing|mojo-spa|thao-dien-spa|golden-lotus-thao-dien)\"/.test(data),'Retired wellness shortlist leaked into visible SPA Guide inventory');
assert(trip.includes('function genericBookingDetailNavigationHTML'),'Generic booking Previous/Next helper missing');
assert(trip.includes('${genericBookingDetailNavigationHTML(booking)}'),'Generic booking detail does not render navigation');
assert(trip.includes('disabled aria-disabled="true"'),'Edge navigation must disable, not wrap');
assert(!trip.includes("if(index<0||bookings.length<2)return ''"),'Single-card booking categories must still render disabled Previous/Next controls');
console.log('GUIDE FACTS + BOOKING NAVIGATION CAPABILITY: PASS');
