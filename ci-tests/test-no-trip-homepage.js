const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'trip.html'),'utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(!html.includes('TRIP BOOKINGS'),'trip.html must not render Trip Homepage hero');
ok(!html.includes('<main class="content-page">'),'trip.html must not render a standalone Trip Homepage');
ok(html.includes("if(!q.get('bookingId')){location.replace('index.html');}"),'direct trip.html visit must redirect without rendering a homepage');
ok(html.includes('id="tripModal"'),'booking host must retain Trip booking modal');
ok(!html.includes('<nav class="app-nav">'),'booking host must not render bottom navigation behind cross-linked booking');
console.log('PASS no Trip Homepage; booking host retained');
