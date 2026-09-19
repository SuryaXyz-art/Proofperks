// SPDX-License-Identifier: Apache-2.0

import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const evidencePath = path.join(root, 'docs', 'evidence', 'phase3-release-latest.txt');
const child = spawn(npm, ['test'], {
  cwd: root,
  env: { ...process.env, PROOFPERKS_REQUIRE_INTEGRATION: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
});

let output = '';
child.stdout.on('data', chunk => { output += chunk; process.stdout.write(chunk); });
child.stderr.on('data', chunk => { output += chunk; process.stderr.write(chunk); });

const exitCode = await new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('close', code => resolve(code ?? 1));
});

// Evidence is deliberately sanitized: no environment values, seeds, private
// witnesses, serialized transactions, or arbitrary provider bodies are saved.
const sanitized = output
  .replaceAll(root, '<repo>')
  .replaceAll(/[A-Fa-f0-9]{64}/g, '<redacted-hex>')
  .replaceAll(/(seed|secret|password|credential)\s*[:=]\s*[^\s]+/gi, '$1=<redacted>');
await mkdir(path.dirname(evidencePath), { recursive: true });
await writeFile(evidencePath, `ProofPerks Phase 3 release test\nGenerated: ${new Date().toISOString()}\nExit code: ${exitCode}\n\n${sanitized}`, 'utf8');

if (/SKIPPED|# skipped [1-9]|# tests 0|integration infrastructure is available/i.test(output)) {
  console.error('Release test failed: required integration scenarios were skipped or did not execute.');
  process.exitCode = 1;
} else if (exitCode !== 0) {
  console.error(`Release test failed with exit code ${exitCode}.`);
  process.exitCode = 1;
} else {
  console.log(`Release test passed; sanitized evidence saved to ${evidencePath}.`);
}
