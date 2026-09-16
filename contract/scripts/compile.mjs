import { readFile, rm, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const contractDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(contractDir, 'src', 'proofperks.compact');
const output = resolve(contractDir, 'src', 'managed', 'proofperks');
const requiredArtifacts = [
  'keys/approve_contribution.prover',
  'keys/approve_contribution.verifier',
  'keys/claim_reward.prover',
  'keys/claim_reward.verifier',
  'keys/revoke_contribution.prover',
  'keys/revoke_contribution.verifier',
  'keys/reissue_contribution.prover',
  'keys/reissue_contribution.verifier',
  'keys/payout_reward.prover',
  'keys/payout_reward.verifier',
  'contract/index.js',
  'contract/index.d.ts',
];
const contractDeclaration = resolve(output, 'contract', 'index.d.ts');

const installHint = [
  'Compact is not available in the active environment.',
  'Install it in WSL with:',
  "curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh",
  'compact update 0.31.1',
].join('\n');

// Prevent a failed or interrupted run from being mistaken for a valid build.
await rm(output, { recursive: true, force: true });

let command;
let args;
if (process.platform === 'win32') {
  const windowsPath = (value) => {
    const match = value.match(/^([A-Za-z]):\\(.*)$/);
    if (!match) throw new Error(`Cannot translate Windows path for WSL: ${value}`);
    return `/mnt/${match[1].toLowerCase()}/${match[2].replaceAll('\\', '/')}`;
  };
  const wslSource = windowsPath(source);
  const wslOutput = windowsPath(output);
  command = 'wsl';
  args = ['--', 'bash', '-lc', `if [ ! -x "$HOME/.local/bin/compact" ]; then echo ${JSON.stringify(installHint)} >&2; exit 127; fi; exec "$HOME/.local/bin/compact" compile ${JSON.stringify(wslSource)} ${JSON.stringify(wslOutput)}`];
} else {
  command = 'compact';
  args = ['compile', source, output];
}

const child = spawn(command, args, { cwd: contractDir, stdio: 'inherit', shell: false });
let childResult;
child.on('error', (error) => { childResult = { error }; });
child.on('close', (code, signal) => { childResult = { code, signal }; });

const deadline = Date.now() + 10 * 60 * 1000;
let complete = false;
while (Date.now() < deadline) {
  const statuses = await Promise.all(requiredArtifacts.map(async (name) => {
    try {
      return (await stat(resolve(output, name))).size > 0;
    } catch {
      return false;
    }
  }));
  let declarationComplete = false;
  try {
    const declaration = await readFile(contractDeclaration, 'utf8');
    declarationComplete = declaration.includes('issuerAddress_0: Uint8Array):')
      && declaration.includes('export declare const pureCircuits');
  } catch {
    declarationComplete = false;
  }
  complete = statuses.every(Boolean) && declarationComplete;
  if (complete || (childResult?.code !== undefined && childResult.code !== 0)) break;
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
}

if (complete) {
  // Compact 0.31.x can leave a WSL launcher alive after its artifacts are flushed.
  if (!childResult) child.kill();
  process.exit(0);
}
if (childResult?.error) {
  console.error(installHint);
  process.exit(127);
}
const incomplete = [];
for (const name of requiredArtifacts) {
  try {
    if ((await stat(resolve(output, name))).size === 0) incomplete.push(name);
  } catch {
    incomplete.push(name);
  }
}
console.error(`Compact did not produce complete artifacts: ${incomplete.join(', ')}`);
process.exit(childResult?.code ?? 1);
