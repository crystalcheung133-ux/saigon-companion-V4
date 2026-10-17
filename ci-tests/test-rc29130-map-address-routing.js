const fs=require('fs'),assert=require('assert');
const day=fs.readFileSync('day.html','utf8');
const data=fs.readFileSync('data.js','utf8');
assert(day.includes("const routeQuery=isTrustedVietnamLocation(address)?address"),'timeline routing must use address-only destination');
assert(day.includes('origin_place_id=${encodeURIComponent(from[2])}'),'shopping exact Place ID support must remain intact');
assert(data.includes('query=46%20M%C3%AA%20Linh%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20Ho%20Chi%20Minh%20City'),'Maruco map must use its street address');
// Static contract: every literal Google Maps API URL has api=1 and a non-empty query/origin/destination parameter.
for(const file of fs.readdirSync('.').filter(x=>/\.(js|html)$/.test(x))){
 const txt=fs.readFileSync(file,'utf8');
 for(const m of txt.matchAll(/https:\/\/www\.google\.com\/maps\/(?:search|dir)\/\?[^\"'`\\\s<>]+/g)){
   const u=m[0]; if(u.includes('${')) continue; assert(u.includes('api=1'),`${file}: Maps URL missing api=1: ${u}`);
   if(u.includes('/search/')) assert(/(?:\?|&)query=/.test(u),`${file}: search map missing query`);
   if(u.includes('/dir/')) {assert(/(?:\?|&)origin=/.test(u),`${file}: directions missing origin`);assert(/(?:\?|&)destination=/.test(u),`${file}: directions missing destination`);}
 }
}
console.log('RC29.130 map address-routing contract PASS');
