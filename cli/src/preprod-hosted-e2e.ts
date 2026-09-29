// SPDX-License-Identifier: Apache-2.0

// Hosted browser E2E: drives the deployed console in headless Chrome the way a user would
// (connect wallet → organizer approves → contributor checks, claims, collects). Chrome gets a
// mock `window.midnight` DApp connector whose calls are bridged over CDP to testkit's
// DAppConnectorWalletAdapter, backed by the funded headless Preprod wallet. Proving uses the
// local proof server exactly as a Lace user's session would.
//
// Usage: npm run e2e:hosted -- [url]   (default https://proofperks.vercel.app)
// Needs: .env.preprod values in the environment, a running proof server, Chrome installed.

import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { DAppConnectorWalletAdapter } from '@midnight-ntwrk/testkit-js';
import { DustSecretKey, ZswapSecretKeys } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.ts';
import { assertProofServer, startWallet } from './preprod-runtime.ts';

const targetUrl = process.argv[2] ?? 'https://proofperks.vercel.app/';
const chromePath = process.env.PROOFPERKS_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const stepTimeoutMs = 12 * 60_000;
const issuerSecret = requirePreprodEnv('PROOFPERKS_ISSUER_SECRET');
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const json = (value: unknown) => JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? item.toString() : item));

const bridgeScript = `(() => {
  const pending = new Map(); let seq = 0;
  window.__ppResolve = (id, ok, value) => { const entry = pending.get(id); pending.delete(id); if (entry) ok ? entry.resolve(value) : entry.reject(new Error(value)); };
  const call = (method, args) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); window.__ppBridge(JSON.stringify({ id, method, args })); });
  const methods = ['getConfiguration', 'getConnectionStatus', 'getShieldedAddresses', 'getUnshieldedAddress', 'getDustAddress', 'balanceUnsealedTransaction', 'balanceSealedTransaction', 'submitTransaction', 'hintUsage'];
  const api = Object.fromEntries(methods.map((method) => [method, (...args) => call(method, args)]));
  api.getProvingProvider = async () => { throw new Error('ProofPerks E2E mock wallet does not bridge an in-wallet prover.'); };
  window.midnight = Object.assign(window.midnight ?? {}, { proofperksE2E: { name: 'ProofPerks E2E wallet', icon: '', apiVersion: '4.0.0', connect: async (networkId) => { if (networkId !== 'preprod') throw new Error('Mock wallet only serves preprod'); return api; } } });
})();`;

await assertProofServer();
const runtime = await startWallet();
const adapter = new DAppConnectorWalletAdapter({
  wallet: runtime.wallet,
  unshieldedKeystore: runtime.keystore,
  zswapSecretKeys: ZswapSecretKeys.fromSeed(runtime.seeds.shielded),
  dustSecretKey: DustSecretKey.fromSeed(runtime.seeds.dust),
}, PREPROD_CONFIG as any);

const profile = await mkdtemp(path.join(tmpdir(), 'proofperks-e2e-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--remote-debugging-port=9334', `--user-data-dir=${profile}`,
  // Chrome prompts a real user before a public page reaches a loopback proof server; headless cannot click it.
  '--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults,BlockInsecurePrivateNetworkRequests',
  'about:blank',
], { stdio: 'ignore' });

const results: Array<{ step: string; ok: boolean; detail: string; ms: number }> = [];
let exitCode = 0;
try {
  let targets: any[] = [];
  for (let attempt = 0; attempt < 40 && !targets.length; attempt++) {
    try { targets = (await (await fetch('http://127.0.0.1:9334/json')).json()).filter((t: any) => t.type === 'page'); } catch { await sleep(500); }
  }
  const socket = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener('open', resolve));
  let nextId = 0;
  const waiting = new Map<number, (result: any) => void>();
  const consoleErrors: string[] = [];
  const send = (method: string, params: Record<string, unknown> = {}) => new Promise<any>((resolve) => { const id = ++nextId; waiting.set(id, resolve); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression: string) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value;

  socket.addEventListener('message', async (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id && waiting.has(message.id)) { waiting.get(message.id)!(message.result); waiting.delete(message.id); return; }
    if (message.method === 'Runtime.exceptionThrown') consoleErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push(message.params.args.map((a: any) => a.value ?? a.description ?? '').join(' '));
    if (message.method !== 'Runtime.bindingCalled' || message.params.name !== '__ppBridge') return;
    const { id, method, args } = JSON.parse(message.params.payload);
    try {
      const value = await (adapter as any)[method](...args);
      await send('Runtime.evaluate', { expression: `window.__ppResolve(${id}, true, ${json(value ?? null)})` });
    } catch (error) {
      await send('Runtime.evaluate', { expression: `window.__ppResolve(${id}, false, ${json(error instanceof Error ? error.message : String(error))})` });
    }
  });

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Runtime.addBinding', { name: '__ppBridge' });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: bridgeScript });
  await send('Page.navigate', { url: targetUrl });

  const bodyText = () => evaluate('document.body.innerText') as Promise<string>;
  // Action outcomes are read from the shared status banner so stale page text cannot pass a step.
  const statusText = () => evaluate("document.querySelector('.status-banner')?.textContent ?? ''") as Promise<string>;
  const waitForText = async (pattern: RegExp, failure: RegExp | null, timeoutMs: number, source: () => Promise<string> = statusText) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const text = await source();
      const hit = text.match(pattern);
      if (hit) return hit[0];
      const bad = failure && text.match(failure);
      if (bad) throw new Error(bad[0]);
      await sleep(1_000);
    }
    throw new Error(`Timed out waiting for ${pattern}`);
  };
  const click = (label: string) => evaluate(`(() => { const b = [...document.querySelectorAll('button')].find((el) => el.textContent.trim().startsWith(${json(label)})); if (!b) return 'missing'; if (b.disabled) return 'disabled'; b.click(); return 'clicked'; })()`);
  const fill = (selector: string, index: number, value: string) => evaluate(`(() => { const el = document.querySelectorAll(${json(selector)})[${index}]; if (!el) return false; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${json(value)}); el.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  const step = async (name: string, run: () => Promise<string>) => {
    const started = Date.now();
    try {
      const detail = await run();
      results.push({ step: name, ok: true, detail, ms: Date.now() - started });
      console.error(`PASS ${name} (${Math.round((Date.now() - started) / 1000)}s): ${detail}`);
    } catch (error) {
      results.push({ step: name, ok: false, detail: error instanceof Error ? error.message : String(error), ms: Date.now() - started });
      console.error(`FAIL ${name}: ${results.at(-1)!.detail}`);
      throw error;
    }
  };
  // A banner message that is neither the expected outcome nor an in-progress note is the failure reason.
  const unless = (...ok: string[]) => new RegExp(`^(?!.*(${ok.join('|')})).+$`, 's');

  const anchor = randomBytes(32).toString('hex');
  const secret = randomBytes(32).toString('hex');
  const points = '150';

  await step('public dashboard loads without a wallet', async () => waitForText(/Claims made\s*\n\s*\d+/, null, 60_000, bodyText));
  await step('connect wallet', async () => {
    if ((await click('Connect wallet')) !== 'clicked') throw new Error('Connect wallet button unavailable');
    return waitForText(/Wallet connected to Midnight Preprod[^\n]*/, /Midnight Lace wallet not found[^\n]*|missing required capabilities[^\n]*/, 60_000);
  });
  await step('organizer queues a credential', async () => {
    await click('Organizer console');
    await sleep(500);
    if (!(await fill('input[placeholder="Used locally to authorize approval"]', 0, issuerSecret))) throw new Error('issuer secret field missing');
    await fill('input[placeholder="Keep this anchor for future re-issue"]', 0, anchor);
    await fill('input[placeholder="Never written to the ledger"]', 0, secret);
    await evaluate(`(() => { const form = [...document.querySelectorAll('form')].find((f) => f.textContent.includes('Add to queue')); const el = form && [...form.querySelectorAll('input')].find((i) => i.type !== 'password'); if (!el) return false; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${json(points)}); el.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
    if ((await click('Add to queue')) !== 'clicked') throw new Error('Add to queue unavailable');
    return waitForText(/Pending approvals\s*1/, null, 10_000, bodyText);
  });
  await step('organizer approves on-chain', async () => {
    if ((await click('Approve on-chain')) !== 'clicked') throw new Error('Approve on-chain unavailable');
    return waitForText(/Approval submitted.*/, unless('Approval submitted', 'Credential added', 'Wallet connected'), stepTimeoutMs);
  });
  await step('contributor checks eligibility', async () => {
    await click('Contributor claim');
    await sleep(500);
    await fill('input[placeholder="32-byte credential anchor"]', 0, anchor);
    await fill('input[placeholder="32-byte credential secret"]', 0, secret);
    await evaluate(`(() => { const label = [...document.querySelectorAll('label')].find((l) => l.textContent.startsWith('Approved points')); const el = label && label.querySelector('input'); if (!el) return false; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${json(points)}); el.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
    if ((await click('Check eligibility')) !== 'clicked') throw new Error('Check eligibility unavailable');
    return waitForText(/Eligible:.*/, unless('Eligible:', 'Approval submitted'), 120_000);
  });
  const setPoints = (value: string) => evaluate(`(() => { const label = [...document.querySelectorAll('label')].find((l) => l.textContent.startsWith('Approved points')); const el = label && label.querySelector('input'); if (!el) return false; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${json(value)}); el.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await step('tampered points are reported as not approved', async () => {
    await setPoints('999');
    if ((await click('Check eligibility')) !== 'clicked') throw new Error('Check eligibility unavailable');
    const verdict = await waitForText(/not approved.*/, unless('not approved', 'Eligible:'), 120_000);
    await setPoints(points);
    if ((await click('Check eligibility')) !== 'clicked') throw new Error('Check eligibility unavailable');
    await waitForText(/Eligible:.*/, unless('Eligible:', 'not approved'), 120_000);
    return verdict;
  });
  await step('contributor claims with a ZK proof', async () => {
    await evaluate(`(() => { const box = document.querySelector('input[type="checkbox"]'); if (box && !box.checked) box.click(); return !!box; })()`);
    await sleep(500);
    const clicked = await click('Claim');
    if (clicked !== 'clicked') throw new Error(`Claim button ${clicked}`);
    return waitForText(/Claim confirmed.*/, unless('Claim submitted', 'Claim confirmed', 'Eligible:'), stepTimeoutMs);
  });
  await step('contributor collects the reward', async () => {
    const clicked = await click('Collect Reward');
    if (clicked !== 'clicked') throw new Error(`Collect Reward button ${clicked}`);
    return waitForText(/already been paid.*/, unless('Reward collection submitted', 'already been paid', 'Claim confirmed'), stepTimeoutMs);
  });
  await step('dashboard reflects the paid claim', async () => waitForText(/Claims made\s*\n\s*\d+/, null, 30_000, bodyText));
  await step('second claim is blocked for a paid credential', async () => {
    const state = await click('Claim');
    if (state !== 'disabled') throw new Error(`Claim button was ${state} after payout`);
    return 'Claim button disabled after payout';
  });
  if (consoleErrors.length) console.error(`Console errors:\n${consoleErrors.join('\n')}`);
  socket.close();
} catch {
  exitCode = 1;
} finally {
  chrome.kill();
  await runtime.stop().catch(() => undefined);
  await rm(profile, { recursive: true, force: true }).catch(() => undefined);
}
console.log(JSON.stringify({ target: targetUrl, network: PREPROD_CONFIG.networkId, passed: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results }, null, 2));
process.exit(exitCode);
