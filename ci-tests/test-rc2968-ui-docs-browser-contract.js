const fs=require('fs');function ok(x,m){if(!x)throw new Error(m)}
const css=fs.readFileSync('styles.css','utf8'),idx=fs.readFileSync('index.html','utf8'),docs=fs.readFileSync('documents-runtime.js','utf8'),browser=fs.readFileSync('ci-tests/test-browser-release-smoke.py','utf8');
ok(css.includes('repeat(6,minmax(0,1fr))'),'bottom nav must be six columns');
ok(css.includes('.docs-form label[hidden]{display:none!important;}'),'document cascading rows must respect hidden');
ok(idx.includes('id="currencyAmount"')&&idx.includes('value="100000"'),'VND converter default must be 100000');
ok(docs.includes('function canLink(){return true}'),'VN collaborative documents must permit contextual link selection');
ok(browser.includes('__submitCount')&&browser.includes('__doubleSubmitRealSaveBookingEdit'),'browser smoke must count the actual submit-handler boundary, not authority reconciliation saves');
console.log('RC29.69 UI + DOCUMENTS + BROWSER CONTRACT: PASS');