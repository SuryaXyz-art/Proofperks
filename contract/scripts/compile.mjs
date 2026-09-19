// SPDX-License-Identifier: Apache-2.0

import { createHash } from 'node:crypto';
import { readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const contractDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(contractDir, 'src', 'proofperks.compact');
const output = resolve(contractDir, 'managed');
const manifestPath = resolve(output, 'manifest.json');
const timeoutMs = Number(process.env.PROOFPERKS_COMPILE_TIMEOUT_MS ?? 10 * 60 * 1000);
const circuits = ['approve_contribution', 'claim_reward', 'fund_reward_pool', 'payout_reward', 'reissue_contribution', 'revoke_contribution'];
const requiredArtifacts = [
  'contract/index.js',
  'contract/index.d.ts',
  ...circuits.flatMap((name) => [`keys/${name}.prover`, `keys/${name}.verifier`, `zkir/${name}.zkir`]),
];

const installHint = [
  'Compact is not available in the active environment.',
  'Install it in WSL with:',
  "curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh",
  'source ~/.bashrc',
  'compact update 0.31.1',
].join('\n');

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function windowsPathForWsl(value) {
  const match = value.match(/^([A-Za-z]):\\(.*)$/);
  if (!match) throw new Error(`Cannot translate path for WSL: ${value}`);
  return `/mnt/${match[1].toLowerCase()}/${match[2].replaceAll('\\', '/')}`;
}

function compactInvocation(action, target = null) {
  const actionArgs = action.split(' ').filter(Boolean);
  if (process.platform !== 'win32') return { command: process.env.COMPACT ?? 'compact', args: target ? [...actionArgs, source, target] : actionArgs };
  const wslSource = windowsPathForWsl(source);
  const wslTarget = target ? windowsPathForWsl(target) : '';
  const command = target
    ? `if [ ! -x "$HOME/.local/bin/compact" ]; then exit 127; fi; exec "$HOME/.local/bin/compact" ${actionArgs.join(' ')} ${shellQuote(wslSource)} ${shellQuote(wslTarget)}`
    : `if [ ! -x "$HOME/.local/bin/compact" ]; then exit 127; fi; exec "$HOME/.local/bin/compact" ${actionArgs.join(' ')}`;
  return { command: 'wsl', args: ['--', 'bash', '-lc', command] };
}

function runProcess(command, args, label) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(command, args, { cwd: contractDir, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      const error = new Error(`${label} timed out after ${timeoutMs} ms`);
      error.code = 'ETIMEDOUT';
      settled = true;
      reject(error);
    }, timeoutMs);
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); process.stdout.write(chunk); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); process.stderr.write(chunk); });
    child.once('error', (error) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      reject(error);
    });
    child.once('close', (code, signal) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      if (code === 0) resolveResult({ stdout, stderr });
      else {
        const error = new Error(`${label} failed with exit code ${code ?? 'unknown'}${signal ? ` (${signal})` : ''}`);
        error.code = code ?? 1;
        error.signal = signal;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

async function existsNonempty(file) {
  try {
    const info = await stat(file);
    return info.isFile() && info.size > 0;
  } catch {
    return false;
  }
}

async function assertArtifacts() {
  const missing = [];
  for (const artifact of requiredArtifacts) if (!(await existsNonempty(join(output, artifact)))) missing.push(artifact);
  if (missing.length) throw new Error(`Compact completed but required artifacts are missing or empty: ${missing.join(', ')}`);
  const declaration = await readFile(join(output, 'contract/index.d.ts'), 'utf8');
  if (!declaration.includes('initialRewardBudget_0: bigint') || !declaration.includes('export declare const pureCircuits')) {
    throw new Error('Generated contract declaration is incomplete; refusing to report a successful build.');
  }
}

async function collectFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'manifest.json') continue;
    const relativeName = `${prefix}${entry.name}`;
    const absoluteName = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(absoluteName, `${relativeName}/`));
    else files.push(relativeName);
  }
  return files.sort();
}

async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function toolchainVersion(action) {
  const invocation = compactInvocation(action);
  try {
    return (await runProcess(invocation.command, invocation.args, `compact ${action}`)).stdout.trim();
  } catch (error) {
    if (error.code === 127) throw new Error(`${installHint}\n${error.message}`);
    throw error;
  }
}

async function writeManifest() {
  const sourceText = await readFile(source, 'utf8');
  const files = await collectFiles(output);
  const artifacts = [];
  for (const file of files) {
    const absolute = join(output, file);
    artifacts.push({ path: file.replaceAll('\\', '/'), sha256: await sha256(absolute), bytes: (await stat(absolute)).size });
  }
  const manifest = {
    schema: 1,
    source: { path: relative(contractDir, source).replaceAll('\\', '/'), sha256: createHash('sha256').update(sourceText).digest('hex') },
    toolchain: {
      compactDevtools: await toolchainVersion('--version'),
      compactCompiler: await toolchainVersion('compile --version'),
      languagePragma: sourceText.match(/pragma language_version\s+([^;]+);/)?.[1]?.trim() ?? null,
      node: process.version,
    },
    circuits,
    artifacts,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
}

try {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000) throw new Error('PROOFPERKS_COMPILE_TIMEOUT_MS must be at least 1000 ms.');
  await rm(output, { recursive: true, force: true });
  await rm(resolve(contractDir, 'src', 'managed'), { recursive: true, force: true });
  await rm(resolve(contractDir, 'dist', 'managed'), { recursive: true, force: true });
  const invocation = compactInvocation('compile', output);
  await runProcess(invocation.command, invocation.args, 'Compact compilation');
  await assertArtifacts();
  const manifest = await writeManifest();
  console.log(`Generated ${manifest.circuits.length} circuits and ${manifest.artifacts.length} hashed artifacts.`);
  console.log(`Manifest: ${manifestPath}`);
} catch (error) {
  await rm(output, { recursive: true, force: true });
  if (error.code === 127) console.error(installHint);
  else console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
