const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = __dirname;
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ccmv-vn-stage-e-legacy-'));
for (const name of fs.readdirSync(root)) {
  if (name.endsWith('.js') || name.endsWith('.html')) fs.copyFileSync(path.join(root, name), path.join(temporary, name));
}
const tests = [
  'booking-repository.test.js', 'booking-stage-c-migration.test.js',
  'stage-3.2b-expenses.test.js', 'stage-3.2c-repository.test.js',
  'stage-3.2d-dual-write.test.js', 'stage-3.2d-vn-production-wiring.test.js',
  'stage-3.2e-read-shadow.test.js'
];
const result = spawnSync(process.execPath, ['--test', ...tests], { cwd: temporary, stdio: 'inherit' });
fs.rmSync(temporary, { recursive: true, force: true });
process.exitCode = result.status ?? 1;
