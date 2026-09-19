// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bytes32FromHex,
  bytes32ToHex,
  deriveClaimNullifier,
  deriveContributionCommitment,
  deriveIssuerPublicKey,
  randomBytes32,
  uint64,
  uint128,
} from '../dist/index.js';

const zero = new Uint8Array(32);
const one = new Uint8Array(32).fill(1);
const scope = { credentialVersion: 1n, networkId: zero, deploymentId: one, campaignId: 7n };

test('credential bytes are strict canonical 32-byte hex, never truncated text', () => {
  const value = bytes32FromHex(`0x${'ab'.repeat(32)}`);
  assert.equal(bytes32ToHex(value), `0x${'ab'.repeat(32)}`);
  assert.throws(() => bytes32FromHex('human-readable-secret'), /exactly 32 bytes/);
  assert.throws(() => bytes32FromHex(`0x${'ab'.repeat(31)}`), /exactly 32 bytes/);
  assert.throws(() => bytes32FromHex(`0x${'ab'.repeat(33)}`), /exactly 32 bytes/);
});

test('credential generators use cryptographic randomness and numeric bounds are explicit', () => {
  const first = randomBytes32();
  const second = randomBytes32();
  assert.equal(first.length, 32);
  assert.equal(second.length, 32);
  assert.notDeepEqual(first, second);
  assert.equal(uint64(2n ** 64n - 1n), 2n ** 64n - 1n);
  assert.equal(uint128(2n ** 128n - 1n), 2n ** 128n - 1n);
  assert.throws(() => uint64(-1n), /Uint<64>/);
  assert.throws(() => uint64(2n ** 64n), /Uint<64>/);
  assert.throws(() => uint128(2n ** 128n), /Uint<128>/);
});

test('stable generated helpers bind derivations to credential scope', () => {
  const secret = new Uint8Array(32).fill(2);
  const anchor = new Uint8Array(32).fill(3);
  assert.deepEqual(deriveIssuerPublicKey(secret), deriveIssuerPublicKey(secret));
  const first = deriveContributionCommitment({ ...scope, anchor, secret, points: 100n });
  const differentDeployment = deriveContributionCommitment({ ...scope, deploymentId: new Uint8Array(32).fill(4), anchor, secret, points: 100n });
  const nullifier = deriveClaimNullifier({ ...scope, secret });
  assert.notDeepEqual(first, differentDeployment);
  assert.notDeepEqual(first, nullifier);
});
