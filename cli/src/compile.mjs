// SPDX-License-Identifier: Apache-2.0

// SPDX-License-Identifier: Apache-2.0

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'compile', '--workspace', '@proofperks/contract'], {
  cwd: repoRoot,
  stdio: 'inherit',
  // npm.cmd is a Windows command script; Node requires shell dispatch for it.
  shell: process.platform === 'win32',
});
child.once('error', (error) => {
  console.error(`ProofPerks CLI compile delegation failed: ${error.message}`);
  process.exitCode = 1;
});
child.once('close', (code, signal) => {
  if (signal) {
    console.error(`ProofPerks CLI compile delegation stopped by ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});
