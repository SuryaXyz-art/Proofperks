// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import { FULL_ARTIFACTS, PACKAGE_ARTIFACTS, childEnvironment, doctor, inspectArtifacts, parseArgs, probeService, proofHealthURL, versionOnly } from './doctor.mjs';

test('network selection is explicit; untrusted argument values are not echoed', () => {
  assert.equal(parseArgs([]).network, 'preprod');
  assert.equal(parseArgs(['--network', 'local', '--offline']).offline, true);
  assert.throws(() => parseArgs([], { PROOFPERKS_NETWORK: 'testnet' }), /Select --network/);
  assert.throws(() => parseArgs(['--network']), /Select --network/);
  assert.throws(() => parseArgs(['synthetic-sensitive-value']), e => !e.message.includes('synthetic-sensitive-value'));
});

test('child processes do not inherit application secrets or injection flags', () => {
  assert.deepEqual(childEnvironment({ PATH: '/bin', HOME: '/home/test', PROOFPERKS_WALLET_SEED: 'synthetic', NODE_OPTIONS: '--import=unsafe', VITE_SECRET: 'synthetic' }), { PATH: '/bin', HOME: '/home/test' });
  assert.equal(versionOnly('compact 0.5.2'), '0.5.2');
  assert.equal(versionOnly('unexpected synthetic-sensitive-value'), null);
});

test('proof health origin rejects embedded credentials, paths, queries, fragments and non-HTTP protocols', () => {
  for (const origin of ['https://user:synthetic@example.com', 'https://example.com/?key=synthetic', 'https://example.com/private', 'https://example.com/#synthetic', 'file:///private']) {
    assert.throws(() => proofHealthURL(origin));
  }
  assert.equal(proofHealthURL(), 'http://127.0.0.1:6300/health');
});

test('artifact inspection requires every nonempty key, ZKIR and wrapper file', async () => {
  assert.equal(PACKAGE_ARTIFACTS.length, 2);
  assert.equal(FULL_ARTIFACTS.length, 21);
  const complete = await inspectArtifacts('/test', FULL_ARTIFACTS, async () => ({ isFile: () => true, size: 1 }));
  assert.equal(complete.present, 21);
  const absent = await inspectArtifacts('/test', FULL_ARTIFACTS, async () => { throw new Error('synthetic'); });
  assert.equal(absent.missing.length, 21);
  const empty = await inspectArtifacts('/test', PACKAGE_ARTIFACTS, async () => ({ isFile: () => true, size: 0 }));
  assert.equal(empty.present, 0);
});

test('RPC uses only a read-only method and distinguishes syncing', async () => {
  const result = await probeService('rpc', 'https://example.com', async (_url, init) => {
    assert.equal(JSON.parse(init.body).method, 'system_health');
    assert.equal(init.redirect, 'error');
    return Response.json({ id: 1, result: { isSyncing: true } });
  });
  assert.equal(result.status, 'WARN');
  assert.equal((await probeService('rpc', 'https://example.com', async () => Response.json({ id: 1, result: { isSyncing: false } }))).status, 'PASS');
});

test('HTTP success is insufficient for GraphQL and RPC readiness', async () => {
  assert.equal((await probeService('indexer', 'https://example.com', async () => Response.json({ errors: [{ message: 'synthetic' }] }))).status, 'FAIL');
  assert.equal((await probeService('rpc', 'https://example.com', async () => Response.json({ result: {} }))).status, 'FAIL');
  assert.equal((await probeService('indexer', 'https://example.com', async () => Response.json({ data: { __typename: 'Query' } }))).status, 'PASS');
});

test('service failures suppress response bodies, exceptions and endpoint credentials', async () => {
  const fail = await probeService('proof', 'https://example.com', async () => { throw new Error('synthetic-sensitive-value'); });
  const httpFail = await probeService('proof', 'https://example.com', async () => new Response('synthetic-sensitive-value', { status: 503 }));
  assert.equal(JSON.stringify([fail, httpFail]).includes('synthetic-sensitive-value'), false);
  assert.equal(fail.status, 'FAIL');
});

test('proof health is explicitly not a real proof or version check', async () => {
  const result = await probeService('proof', 'https://example.com', async (_url, init) => {
    assert.equal(init.method, 'GET');
    assert.equal(init.body, undefined);
    return new Response('OK');
  });
  assert.equal(result.status, 'PASS');
  assert.match(result.detail, /NOT verified/);
});

test('oversized service responses are rejected', async () => {
  assert.equal((await probeService('indexer', 'https://example.com', async () => new Response('x'.repeat(20000)))).status, 'FAIL');
});

test('offline doctor makes no HTTP calls and does not surface secret environment values', async () => {
  const report = await doctor({ network: 'preprod', offline: true }, {
    platform: 'linux', env: { HOME: '/home/test', PROOFPERKS_WALLET_SEED: 'synthetic-sensitive-value' },
    run: async () => ({ ok: false, version: null }),
    fetchImpl: async () => { assert.fail('Offline mode must not fetch'); },
  });
  assert.ok(report.checks.some(c => c.name === 'Service probes' && c.status === 'NOT_RUN'));
  assert.equal(JSON.stringify(report).includes('synthetic-sensitive-value'), false);
  assert.match(report.validation, /No compilation/);
});
