// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const source = await readFile(new URL('../src/proofperks.compact', import.meta.url), 'utf8');
const declaration = await readFile(new URL('../managed/contract/index.d.ts', import.meta.url), 'utf8');

test('compiled protocol exposes scoped credential and funding state', () => {
  for (const name of ['credentialVersion', 'networkId', 'deploymentId', 'approvedCommitmentSet', 'reservedRewardBudget', 'rewardReservations']) {
    assert.match(declaration, new RegExp(name));
  }
  for (const name of ['issuerPublicKey', 'contributionCommitment', 'claimNullifier', 'fund_reward_pool']) {
    assert.match(declaration, new RegExp(name));
  }
});

test('source preserves fixed pilot reward and separate funding/reservation invariants', () => {
  assert.match(source, /rewardAmount = disclose\(1000 as Uint<128>\)/);
  assert.match(source, /receiveUnshielded\(nativeToken\(\), disclose\(amount\)\)/);
  assert.match(source, /unshieldedBalanceGte\(nativeToken\(\), \(reservedRewardBudget \+ rewardAmount\) as Uint<128>\)/);
  assert.match(source, /reservedRewardBudget = \(reservedRewardBudget \+ rewardAmount\) as Uint<128>/);
  assert.match(source, /rewardReservations\.remove/);
  assert.match(source, /paidRewardNullifiers\.insert/);
});
