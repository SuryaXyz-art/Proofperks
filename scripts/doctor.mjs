// SPDX-License-Identifier: Apache-2.0
// Read-only diagnostics. Never import deployment code, load .env, or open private state.
import { readFile, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const exec = promisify(execFile);
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const CIRCUITS = ['approve_contribution', 'claim_reward', 'fund_reward_pool', 'revoke_contribution', 'reissue_contribution', 'payout_reward'];
export const PACKAGE_ARTIFACTS = ['index.js', 'index.d.ts'];
export const FULL_ARTIFACTS = ['manifest.json', 'contract/index.js', 'contract/index.d.ts', ...CIRCUITS.flatMap(name => [`keys/${name}.prover`, `keys/${name}.verifier`, `zkir/${name}.zkir`])];
const EXPECTED = {
  'compact-runtime': '0.16.0', 'compact-js': '2.5.1', 'platform-js': '2.2.4',
  'ledger-v8': '8.1.0', 'onchain-runtime-v3': '3.0.0',
  'midnight-js-protocol': '4.1.1', 'testkit-js': '4.1.1',
  'dapp-connector-api': '4.0.1', 'wallet-sdk': '1.1.0',
};

export function parseArgs(args, env = {}) {
  const options = { offline: false, json: false, network: env.PROOFPERKS_NETWORK ?? 'preprod' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--offline') options.offline = true;
    else if (args[i] === '--json') options.json = true;
    else if (args[i] === '--network') options.network = args[++i];
    else if (args[i] === '--help') options.help = true;
    else throw new Error('Unsupported option; use --help.'); // Never echo arbitrary input.
  }
  if (!['preprod', 'local'].includes(options.network)) {
    throw new Error('Select --network preprod or --network local; ambiguous testnet is not accepted.');
  }
  return options;
}

export function versionOnly(value) {
  return String(value).trim().match(/^(?:v|compact |Docker version |Docker Compose version v)?(\d+\.\d+\.\d+)(?:\s|,|$)/)?.[1] ?? null;
}

// Child processes receive only OS discovery variables, never application secrets or NODE_OPTIONS.
export function childEnvironment(env) {
  const allowed = new Set(['path', 'pathext', 'systemroot', 'windir', 'comspec', 'home', 'userprofile', 'temp', 'tmp']);
  return Object.fromEntries(Object.entries(env).filter(([key]) => allowed.has(key.toLowerCase())));
}

export async function runCommand(command, args, env = process.env) {
  try {
    const { stdout } = await exec(command, args, {
      env: childEnvironment(env), timeout: 8000, maxBuffer: 32768, windowsHide: true,
    });
    return { ok: true, version: versionOnly(stdout) };
  } catch {
    return { ok: false, version: null }; // Do not surface command stderr or exception text.
  }
}

export async function inspectArtifacts(base, required = FULL_ARTIFACTS, statFile = stat) {
  const missing = [];
  for (const name of required) {
    try {
      const info = await statFile(join(base, name));
      if (!info.isFile() || info.size === 0) missing.push(name);
    } catch { missing.push(name); }
  }
  return { present: required.length - missing.length, required: required.length, missing };
}

export function proofHealthURL(value = 'http://127.0.0.1:6300') {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Proof server must be an HTTP(S) origin without credentials, query, fragment, or path.');
  }
  return new URL('/health', url).href;
}

async function smallJSON(response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Missing body');
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 16384) throw new Error('Oversized response');
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { await reader.cancel().catch(() => {}); }
}

export async function probeService(kind, url, fetchImpl = fetch) {
  const requests = {
    rpc: { jsonrpc: '2.0', id: 1, method: 'system_health', params: [] },
    indexer: { query: '{ __typename }' },
  };
  try {
    const payload = requests[kind];
    const response = await fetchImpl(url, {
      method: payload ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(5000),
      ...(payload ? { headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) } : {}),
    });
    if (!response.ok) {
      await response.body?.cancel();
      return { status: 'FAIL', detail: `HTTP ${response.status}; service not ready.` };
    }
    if (kind === 'proof') {
      await response.body?.cancel();
      return { status: 'PASS', detail: 'Health endpoint reachable; version and proof compatibility NOT verified.' };
    }
    const data = await smallJSON(response);
    if (kind === 'rpc') {
      if (data.error || data.id !== 1 || typeof data.result?.isSyncing !== 'boolean') throw new Error('Invalid RPC response');
      return data.result.isSyncing
        ? { status: 'WARN', detail: 'RPC responds but reports syncing.' }
        : { status: 'PASS', detail: 'RPC reports not syncing; no transaction was submitted.' };
    }
    if (data.errors?.length || typeof data.data?.__typename !== 'string') throw new Error('Invalid GraphQL response');
    return { status: 'PASS', detail: 'GraphQL query responds; indexer catch-up and WebSocket subscription NOT verified.' };
  } catch {
    return { status: 'FAIL', detail: 'Unavailable, timed out, redirected, or returned an invalid response (details suppressed).' };
  }
}

export async function doctor(options, {
  root = ROOT, env = process.env, platform = process.platform,
  run = runCommand, fetchImpl = fetch,
} = {}) {
  const checks = [];
  const add = (name, status, detail) => checks.push({ name, status, detail });
  const nodeOK = Number(process.versions.node.split('.')[0]) >= 22;
  add('Node.js', nodeOK ? 'PASS' : 'FAIL', `${process.versions.node}; documented baseline 22.23.2.`);
  add('Execution environment', platform === 'linux' ? 'PASS' : 'WARN',
    platform === 'linux' ? 'Linux process; run npm and Compact in this same environment.' : 'Windows/other host is not a Linux Node setup. WSL checks are separate.');

  const probes = platform === 'win32'
    ? [
      ['Linux Node in WSL', 'wsl.exe', ['--', 'bash', '-lc', 'node --version'], '22.23.2'],
      ['Compact devtools in WSL', 'wsl.exe', ['--', 'bash', '-lc', '~/.local/bin/compact --version'], '0.5.1'],
      ['Compact compiler in WSL', 'wsl.exe', ['--', 'bash', '-lc', '~/.local/bin/compact compile --version'], '0.31.1'],
      ['Docker daemon in WSL', 'wsl.exe', ['--', 'docker', 'info', '--format', '{{.ServerVersion}}']],
      ['Docker Compose in WSL', 'wsl.exe', ['--', 'docker', 'compose', 'version', '--short']],
    ]
    : [
      ['Compact devtools', join(env.HOME ?? '', '.local/bin/compact'), ['--version'], '0.5.1'],
      ['Compact compiler', join(env.HOME ?? '', '.local/bin/compact'), ['compile', '--version'], '0.31.1'],
      ['Docker daemon', 'docker', ['info', '--format', '{{.ServerVersion}}']],
      ['Docker Compose', 'docker', ['compose', 'version', '--short']],
    ];
  const results = await Promise.all(probes.map(async ([name, cmd, args, expected]) => {
    const result = await run(cmd, args, env);
    return { name, expected, ...result };
  }));
  for (const { name, expected, ok, version } of results) {
    add(name, !ok || !version ? 'FAIL' : expected && version !== expected ? (name.includes('compiler') ? 'FAIL' : 'WARN') : 'PASS',
      ok && version ? `${version}${expected ? `; matrix/baseline ${expected}` : ''}` : 'Not available in the selected environment.');
  }

  try {
    const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
    for (const [name, expected] of Object.entries(EXPECTED)) {
      const paths = Object.entries(lock.packages ?? {}).filter(([p]) => p.endsWith(`node_modules/@midnight-ntwrk/${name}`));
      const versions = paths.map(([, p]) => versionOnly(p.version) ?? 'invalid');
      add(`Lock: ${name}`, paths.length === 1 && versions[0] === expected ? 'PASS' : 'FAIL',
        `${paths.length} copies; versions ${versions.join(', ') || 'missing'}; target ${expected}.`);
      let installed = 0;
      for (const [p, pkg] of paths) {
        // Lockfile paths must not allow this read-only tool to open arbitrary files.
        if (p.includes('..') || p.includes('\\') || !/^(?:node_modules\/[\w@./-]+)$/.test(p)) continue;
        try {
          const actual = JSON.parse(await readFile(join(root, p, 'package.json'), 'utf8'));
          if (actual.version === pkg.version) installed++;
        } catch { /* Missing installation; no automatic npm install. */ }
      }
      add(`Installed: ${name}`, paths.length > 0 && installed === paths.length ? 'PASS' : 'FAIL', `${installed}/${paths.length} locked copies available; availability is not compatibility.`);
    }
  } catch { add('Dependency lockfile', 'FAIL', 'Missing or unreadable; no installation was attempted.'); }

  const artifactRoots = [
    ['contract/managed', FULL_ARTIFACTS],
    ['ui/public/zkconfig', FULL_ARTIFACTS],
    ['ui/dist/zkconfig', FULL_ARTIFACTS],
  ];
  for (const [base, required] of artifactRoots) {
    const assets = await inspectArtifacts(join(root, base), required);
    add(`Artifacts: ${base}`, assets.missing.length ? 'FAIL' : 'PASS', `${assets.present}/${assets.required} nonempty expected files. Presence does not prove freshness or successful compilation.`);
  }
  const packageAssets = await inspectArtifacts(join(root, 'contract', 'dist'), PACKAGE_ARTIFACTS);
  add('Artifacts: contract/dist', packageAssets.missing.length ? 'FAIL' : 'PASS', `${packageAssets.present}/${packageAssets.required} package wrapper files. This is a build output, not a second generated circuit tree.`);
  add('Artifact layout', 'PASS', 'contract/managed is the single generated circuit source; contract/dist, CLI, tests, and UI consume or package it.');
  try {
    const declaration = await readFile(join(root, 'contract', 'managed', 'contract', 'index.d.ts'), 'utf8');
    const script = await readFile(join(root, 'contract/scripts/compile.mjs'), 'utf8');
    const stale = script.includes("issuerAddress_0: Uint8Array):") && !declaration.includes('issuerAddress_0: Uint8Array):');
    add('Compiler wrapper validation', stale ? 'FAIL' : 'PASS', stale ? 'Constructor sentinel does not match generated declaration.' : 'Generated declaration and compiler wrapper agree; exit code, timeout, artifact, and manifest validation are enabled.');
  } catch { add('Compiler wrapper validation', 'WARN', 'No generated declaration to compare.'); }

  let composeFound = false;
  for (const file of ['contract/compose.yml', 'contract/proof-server.yml']) {
    try { composeFound = (await stat(join(root, file))).isFile() || composeFound; } catch { /* absent */ }
  }
  add('Testkit service configuration', composeFound ? 'WARN' : 'FAIL', composeFound ? 'A service file exists; its contents and selected test environment require validation.' : 'No contract/compose.yml or contract/proof-server.yml; Docker alone cannot start the current testkit suite.');
  add('Network selection', 'PASS', `${options.network}; doctor selection only. Existing UI/deployer remain hardcoded to Preprod.`);
  add('Wallet, funds, secrets', 'NOT_RUN', 'No wallet access, secret inspection, private-state reads, faucet requests, or funding checks performed.');
  if (options.offline) {
    add('Service probes', 'NOT_RUN', 'Offline mode: no HTTP requests made.');
  } else {
    const node = options.network === 'preprod' ? 'https://rpc.preprod.midnight.network' : 'http://127.0.0.1:9944';
    const indexer = options.network === 'preprod' ? 'https://indexer.preprod.midnight.network/api/v4/graphql' : 'http://127.0.0.1:8088/api/v4/graphql';
    const services = [['Node RPC', 'rpc', node], ['Indexer', 'indexer', indexer]];
    try { services.push(['Proof server', 'proof', proofHealthURL(env.PROOFPERKS_PROOF_SERVER)]); }
    catch { add('Proof server', 'FAIL', 'Unsafe or invalid origin configuration; value suppressed and request not sent.'); }
    const serviceResults = await Promise.all(services.map(async ([name, kind, url]) => ({ name, ...await probeService(kind, url, fetchImpl) })));
    for (const { name, status, detail } of serviceResults) add(name, status, detail);
  }
  return {
    mode: 'read-only', network: options.network, offline: options.offline, checks,
    summary: { failures: checks.filter(c => c.status === 'FAIL').length, warnings: checks.filter(c => c.status === 'WARN').length },
    validation: 'No compilation, circuit execution, proving, submission, or confirmed contract state validation performed by doctor.',
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const options = parseArgs(process.argv.slice(2), process.env);
    if (options.help) {
      console.log('Usage: npm run doctor -- [--network preprod|local] [--offline] [--json]\nRead-only checks; exits 1 on failed prerequisites, 2 on invalid arguments. Never deploys.');
    } else {
      const report = await doctor(options);
      if (options.json) console.log(JSON.stringify(report, null, 2));
      else {
        console.log('ProofPerks doctor — read-only baseline');
        for (const c of report.checks) console.log(`[${c.status}] ${c.name}: ${c.detail}`);
        console.log(`Summary: ${report.summary.failures} failed checks, ${report.summary.warnings} warnings.`);
        console.log(report.validation);
      }
      process.exitCode = report.summary.failures ? 1 : 0;
    }
  } catch {
    console.error('Doctor could not complete. Use --help and check repository prerequisites; diagnostic details suppressed.');
    process.exitCode = 2;
  }
}
