// SPDX-License-Identifier: Apache-2.0

/**
 * Integration tests for the generated Compact contract.
 *
 * These tests intentionally do not contain a JS state-transition model. They
 * deploy contract/managed, generate real proofs through Midnight.js/testkit,
 * submit the transactions, and assert public ledger state afterward.
 *
 * Local execution requires Docker Desktop for the testkit's node, indexer,
 * wallet, and proof-server containers. Set MN_TEST_ENVIRONMENT to use a
 * configured remote test environment. If neither is available, the tests are
 * reported as skipped rather than silently falling back to a mock.
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';

import {
  createDefaultTestLogger,
  getTestEnvironment,
  initializeMidnightProviders,
} from '@midnight-ntwrk/testkit-js';
import { deployContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { dummyUserAddress, encodeUserAddress } from '@midnight-ntwrk/compact-runtime';

import * as ManagedProofPerks from '../managed/contract/index.js';

const TEST_CAMPAIGN_ID = 1n;
const TEST_THRESHOLD = 100n;
const TEST_POINTS = 125n;
const TEST_REWARD_BUDGET = 100_000n;
const TEST_NETWORK_ID = Uint8Array.from(randomBytes(32));
const TEST_DEPLOYMENT_ID = Uint8Array.from(randomBytes(32));
const PRIVATE_STATE_ID = 'proofperks-actual-compact-test';
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const managedPath = path.join(repositoryRoot, 'contract', 'managed');

function dockerAvailable() {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore', timeout: 5_000 });
    return true;
  } catch {
    return false;
  }
}

const testEnvironmentRequested = Boolean(process.env.MN_TEST_ENVIRONMENT);
const skipReason = dockerAvailable() || testEnvironmentRequested
  ? undefined
  : 'Midnight testkit unavailable: start Docker Desktop or set MN_TEST_ENVIRONMENT for a configured remote test environment.';

if (skipReason) {
  console.log(`COMPACT TESTKIT: SKIPPED — ${skipReason}`);
} else {
  console.log('COMPACT TESTKIT: enabled — generated contract/managed artifact only; no JS mock is used.');
}

if (process.env.PROOFPERKS_REQUIRE_INTEGRATION === '1') {
  test('required Compact integration infrastructure is available', () => {
    assert.equal(skipReason, undefined, skipReason ?? 'integration infrastructure is available');
  });
}

const zeroBytes32 = () => new Uint8Array(32);

function hex(value) {
  return Buffer.from(value).toString('hex');
}

const issuerSecret = Uint8Array.from(randomBytes(32));
const contributorSecret = Uint8Array.from(randomBytes(32));
const contributorAnchor = Uint8Array.from(randomBytes(32));
const issuerAddress = ManagedProofPerks.pureCircuits.issuerPublicKey(issuerSecret);
const recipient = { bytes: encodeUserAddress(dummyUserAddress()) };

const privateState = (overrides = {}) => ({
  issuerSecret,
  approvedContributorSecret: contributorSecret,
  approvedContributorAnchor: contributorAnchor,
  approvedPoints: TEST_POINTS,
  contributorAnchor,
  contributorSecret,
  contributorPoints: TEST_POINTS,
  revocationTargetSecret: contributorSecret,
  oldContributorAnchor: contributorAnchor,
  oldContributorSecret: contributorSecret,
  commitmentPaths: new Map(),
  ...overrides,
});

const witnesses = {
  issuerSecret: ({ privateState: state }) => [state, state.issuerSecret],
  approvedContributorSecret: ({ privateState: state }) => [state, state.approvedContributorSecret],
  approvedContributorAnchor: ({ privateState: state }) => [state, state.approvedContributorAnchor],
  approvedPoints: ({ privateState: state }) => [state, state.approvedPoints],
  contributorAnchor: ({ privateState: state }) => [state, state.contributorAnchor],
  contributorSecret: ({ privateState: state }) => [state, state.contributorSecret],
  contributorPoints: ({ privateState: state }) => [state, state.contributorPoints],
  revocationTargetSecret: ({ privateState: state }) => [state, state.revocationTargetSecret],
  oldContributorAnchor: ({ privateState: state }) => [state, state.oldContributorAnchor],
  oldContributorSecret: ({ privateState: state }) => [state, state.oldContributorSecret],
  findCommitmentPath: ({ privateState: state }, commitment) => {
    const pathForCommitment = state.commitmentPaths.get(hex(commitment)) ?? state.fallbackCommitmentPath;
    if (!pathForCommitment) throw new Error(`No Merkle path for commitment ${hex(commitment)}`);
    return [state, pathForCommitment];
  },
};

const compiledProofPerks = CompiledContract.make('ProofPerksActualTest', ManagedProofPerks.Contract)
  .pipe(
    CompiledContract.withWitnesses(witnesses),
    CompiledContract.withCompiledFileAssets(managedPath),
  );

let testEnvironment;
let environmentConfiguration;
let providers;

before(async () => {
  if (skipReason) return;
  testEnvironment = getTestEnvironment(createDefaultTestLogger());
  environmentConfiguration = await testEnvironment.start();
  const walletProvider = await testEnvironment.getMidnightWalletProvider();
  providers = initializeMidnightProviders(walletProvider, environmentConfiguration, {
    privateStateStoreName: `${PRIVATE_STATE_ID}-${process.pid}`,
    zkConfigPath: managedPath,
  });
});

after(async () => {
  await testEnvironment?.shutdown();
});

async function deployFresh(label, { rewardBudget = TEST_REWARD_BUDGET } = {}) {
  const privateStateId = `${PRIVATE_STATE_ID}-${label}-${Date.now()}`;
  const deployed = await deployContract(providers, {
    compiledContract: compiledProofPerks,
    privateStateId,
    initialPrivateState: privateState(),
    args: [TEST_CAMPAIGN_ID, TEST_THRESHOLD, true, issuerAddress, rewardBudget, TEST_NETWORK_ID, TEST_DEPLOYMENT_ID],
  });
  return { deployed, privateStateId };
}

function contractAddressOf(deployed) {
  return deployed.deployTxData.public.contractAddress;
}

async function publicLedger(deployed) {
  const state = await getPublicStates(providers.publicDataProvider, contractAddressOf(deployed));
  return ManagedProofPerks.ledger(state.contractState);
}

async function installCommitmentPath(deployed, privateStateId, claimState) {
  const expectedCommitment = ManagedProofPerks.pureCircuits.contributionCommitment(
    1n,
    TEST_NETWORK_ID,
    TEST_DEPLOYMENT_ID,
    TEST_CAMPAIGN_ID,
    claimState.contributorAnchor,
    claimState.contributorSecret,
    claimState.contributorPoints,
  );
  const ledgerState = await publicLedger(deployed);
  const path = ledgerState.approvedCommitments.findPathForLeaf(expectedCommitment);
  assert.ok(path, 'the approved commitment must be discoverable in the generated ledger tree');
  await providers.privateStateProvider.set(privateStateId, {
    ...claimState,
    commitmentPaths: new Map([[hex(expectedCommitment), path]]),
  });
}

async function fundRewardPool(deployed, amount = TEST_REWARD_BUDGET) {
  await timedCompactCall(`fund reward pool (${amount} base units)`, () => deployed.callTx.fund_reward_pool(amount));
}

function assertCircuitReason(pattern) {
  return (error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`Expected circuit rejection: ${message}`);
    assert.match(message, pattern);
    return true;
  };
}

async function timedCompactCall(label, call) {
  const started = performance.now();
  try {
    const result = await call();
    const elapsedMs = performance.now() - started;
    console.log(`REAL COMPACT/TESTKIT ${label}: ${elapsedMs.toFixed(3)} ms (proof generation + transaction finalization)`);
    return { result, elapsedMs };
  } catch (error) {
    const elapsedMs = performance.now() - started;
    console.log(`REAL COMPACT/TESTKIT ${label}: ${elapsedMs.toFixed(3)} ms (rejected during proving or verification)`);
    throw Object.assign(error instanceof Error ? error : new Error(String(error)), { elapsedMs });
  }
}

function assertEnabled() {
  if (skipReason) assert.fail(skipReason);
}

test('1. actual Compact circuit: happy path records a nullifier', { skip: skipReason }, async () => {
  assertEnabled();
  const { deployed, privateStateId } = await deployFresh('happy');
  const before = await publicLedger(deployed);
  await timedCompactCall('happy-path approval', () => deployed.callTx.approve_contribution());
  const afterApproval = await publicLedger(deployed);
  assert.equal(Number(afterApproval.approvedCommitments.firstFree()), Number(before.approvedCommitments.firstFree()) + 1);

  await installCommitmentPath(deployed, privateStateId, privateState());
  await fundRewardPool(deployed);
  const beforeClaim = await publicLedger(deployed);
  await timedCompactCall('happy-path claim', () => deployed.callTx.claim_reward(recipient));
  const afterClaim = await publicLedger(deployed);
  assert.equal(Number(afterClaim.usedNullifiers.size()), Number(beforeClaim.usedNullifiers.size()) + 1);
  assert.equal(afterClaim.rewardAmount, 1000n);
  assert.equal(afterClaim.reservedRewardBudget, 1000n);
  assert.equal(afterClaim.pendingRewardRecipients.size(), 1n);
  const claimedNullifier = [...afterClaim.usedNullifiers][0];
  assert.equal(afterClaim.pendingRewardRecipients.lookup(claimedNullifier).bytes.length, recipient.bytes.length);
  await timedCompactCall('happy-path payout', () => deployed.callTx.payout_reward(claimedNullifier));
  const afterPayout = await publicLedger(deployed);
  assert.equal(afterPayout.rewardBudget, TEST_REWARD_BUDGET - 1000n);
  assert.equal(afterPayout.reservedRewardBudget, 0n);
  assert.equal(afterPayout.pendingRewardRecipients.size(), 0n);
  assert.equal(afterPayout.paidRewardNullifiers.size(), 1n);
  await assert.rejects(
    timedCompactCall('duplicate payout', () => deployed.callTx.payout_reward(claimedNullifier)),
    assertCircuitReason(/reward already paid/i),
  );
  console.log('PASS — REAL COMPACT/TESTKIT happy path: claim, reservation, payout, recipient binding, and duplicate-payout rejection verified.');
});

test('2. actual Compact circuit: tampered points use the original valid path and hit commitment mismatch', { skip: skipReason }, async () => {
  assertEnabled();
  const { deployed, privateStateId } = await deployFresh('tampered');
  await timedCompactCall('tampered approval', () => deployed.callTx.approve_contribution());
  const approvedCommitment = ManagedProofPerks.pureCircuits.contributionCommitment(1n, TEST_NETWORK_ID, TEST_DEPLOYMENT_ID, TEST_CAMPAIGN_ID, contributorAnchor, contributorSecret, TEST_POINTS);
  const approvedPath = (await publicLedger(deployed)).approvedCommitments.findPathForLeaf(approvedCommitment);
  assert.ok(approvedPath, 'the original approved path must exist');
  const tamperedState = privateState({ contributorPoints: TEST_POINTS + 1n, fallbackCommitmentPath: approvedPath });
  await providers.privateStateProvider.set(privateStateId, tamperedState);
  const before = await publicLedger(deployed);
  await assert.rejects(
    timedCompactCall('tampered claim', () => deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/path is not for this commitment/i),
  );
  const after = await publicLedger(deployed);
  assert.equal(Number(after.usedNullifiers.size()), Number(before.usedNullifiers.size()));
  console.log('PASS — REAL COMPACT/TESTKIT tampered credential: original valid path reached the commitment mismatch.');
});

test('3. actual Compact circuit: approved-below-threshold credential is rejected', { skip: skipReason }, async () => {
  assertEnabled();
  const { deployed, privateStateId } = await deployFresh('below-threshold');
  const belowThresholdState = privateState({ approvedPoints: TEST_THRESHOLD - 1n, contributorPoints: TEST_THRESHOLD - 1n });
  await providers.privateStateProvider.set(privateStateId, belowThresholdState);
  await timedCompactCall('below-threshold approval', () => deployed.callTx.approve_contribution());
  await installCommitmentPath(deployed, privateStateId, belowThresholdState);
  await assert.rejects(
    timedCompactCall('below-threshold claim', () => deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/threshold not met/i),
  );
});

test('4. actual Compact circuit: duplicate claim is rejected', { skip: skipReason }, async () => {
  assertEnabled();
  const { deployed, privateStateId } = await deployFresh('double');
  await timedCompactCall('double-claim approval', () => deployed.callTx.approve_contribution());
  await installCommitmentPath(deployed, privateStateId, privateState());
  await timedCompactCall('double-claim first claim', () => deployed.callTx.claim_reward(recipient));
  const afterFirst = await publicLedger(deployed);

  await assert.rejects(
    timedCompactCall('double-claim second claim', () => deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/reward already claimed|contributor already claimed|already exists/i),
  );
  const afterSecond = await publicLedger(deployed);
  assert.equal(Number(afterSecond.usedNullifiers.size()), Number(afterFirst.usedNullifiers.size()));
  console.log('PASS — REAL COMPACT/TESTKIT double claim: second transaction rejected and set unchanged.');
});

test('5. actual Compact circuit: invalid Merkle path is rejected', { skip: skipReason }, async () => {
  const { deployed, privateStateId } = await deployFresh('invalid-path');
  await timedCompactCall('invalid-path approval', () => deployed.callTx.approve_contribution());
  await installCommitmentPath(deployed, privateStateId, privateState());
  const state = await providers.privateStateProvider.get(privateStateId);
  const [commitment, path] = [...state.commitmentPaths.entries()][0];
  await providers.privateStateProvider.set(privateStateId, {
    ...state,
    commitmentPaths: new Map([[commitment, { ...path, leaf: new Uint8Array(32) }]]),
  });
  await assert.rejects(
    timedCompactCall('invalid Merkle path claim', () => deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/path is not for this commitment/i),
  );
});

test('6. actual Compact circuit: issuer authorization is enforced', { skip: skipReason }, async () => {
  const { deployed, privateStateId } = await deployFresh('issuer-auth');
  await providers.privateStateProvider.set(privateStateId, privateState({ issuerSecret: Uint8Array.from(randomBytes(32)) }));
  await assert.rejects(
    timedCompactCall('unauthorized approval', () => deployed.callTx.approve_contribution()),
    assertCircuitReason(/caller is not the issuer/i),
  );
});

test('7. actual Compact circuit: revocation blocks a future claim', { skip: skipReason }, async () => {
  const { deployed, privateStateId } = await deployFresh('revocation');
  await timedCompactCall('revocation approval', () => deployed.callTx.approve_contribution());
  await installCommitmentPath(deployed, privateStateId, privateState());
  await timedCompactCall('revoke credential', () => deployed.callTx.revoke_contribution());
  await assert.rejects(
    timedCompactCall('revoked claim', () => deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/credential revoked/i),
  );
});

test('8. actual Compact circuit: recovery revokes old credential and preserves anchor claim uniqueness', { skip: skipReason }, async () => {
  const { deployed, privateStateId } = await deployFresh('recovery');
  await timedCompactCall('recovery original approval', () => deployed.callTx.approve_contribution());
  const replacementSecret = Uint8Array.from(randomBytes(32));
  const replacementState = privateState({
    contributorSecret: replacementSecret,
    approvedContributorSecret: replacementSecret,
    oldContributorSecret: contributorSecret,
    contributorPoints: TEST_POINTS,
    approvedPoints: TEST_POINTS,
  });
  await providers.privateStateProvider.set(privateStateId, replacementState);
  await timedCompactCall('issuer-mediated recovery', () => deployed.callTx.reissue_contribution());
  await installCommitmentPath(deployed, privateStateId, replacementState);
  await fundRewardPool(deployed);
  await timedCompactCall('replacement credential claim', () => deployed.callTx.claim_reward(recipient));
  const afterReplacementClaim = await publicLedger(deployed);
  assert.equal(Number(afterReplacementClaim.usedNullifiers.size()), 1);
  await assert.rejects(
    timedCompactCall('old credential after recovery', async () => {
      await providers.privateStateProvider.set(privateStateId, privateState());
      const oldCommitment = ManagedProofPerks.pureCircuits.contributionCommitment(1n, TEST_NETWORK_ID, TEST_DEPLOYMENT_ID, TEST_CAMPAIGN_ID, contributorAnchor, contributorSecret, TEST_POINTS);
      const ledgerState = await publicLedger(deployed);
      const oldPath = ledgerState.approvedCommitments.findPathForLeaf(oldCommitment);
      await providers.privateStateProvider.set(privateStateId, { ...privateState(), commitmentPaths: new Map([[hex(oldCommitment), oldPath]]) });
      return deployed.callTx.claim_reward(recipient);
    }),
    assertCircuitReason(/credential revoked/i),
  );
});

test('9. actual Compact circuit: insufficient funds and budget are distinct rejections', { skip: skipReason }, async () => {
  const noFunds = await deployFresh('no-funds');
  await timedCompactCall('no-funds approval', () => noFunds.deployed.callTx.approve_contribution());
  await installCommitmentPath(noFunds.deployed, noFunds.privateStateId, privateState());
  await assert.rejects(
    timedCompactCall('insufficient native funds claim', () => noFunds.deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/insufficient unreserved reward balance/i),
  );

  const budget = await deployFresh('budget', { rewardBudget: 1_000n });
  await timedCompactCall('budget approval', () => budget.deployed.callTx.approve_contribution());
  await installCommitmentPath(budget.deployed, budget.privateStateId, privateState());
  await fundRewardPool(budget.deployed, 2_000n);
  await timedCompactCall('budget first claim', () => budget.deployed.callTx.claim_reward(recipient));

  const secondSecret = Uint8Array.from(randomBytes(32));
  const secondAnchor = Uint8Array.from(randomBytes(32));
  const secondState = privateState({
    contributorSecret: secondSecret,
    approvedContributorSecret: secondSecret,
    contributorAnchor: secondAnchor,
    approvedContributorAnchor: secondAnchor,
  });
  await providers.privateStateProvider.set(budget.privateStateId, secondState);
  await timedCompactCall('budget second approval', () => budget.deployed.callTx.approve_contribution());
  await installCommitmentPath(budget.deployed, budget.privateStateId, secondState);
  await assert.rejects(
    timedCompactCall('budget-exhausted second claim', () => budget.deployed.callTx.claim_reward(recipient)),
    assertCircuitReason(/reward budget exhausted/i),
  );
  const afterBudgetRejection = await publicLedger(budget.deployed);
  assert.equal(afterBudgetRejection.rewardBudget, 1_000n);
  assert.equal(afterBudgetRejection.reservedRewardBudget, 1_000n);
});
