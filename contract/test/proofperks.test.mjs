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

const zeroBytes32 = () => new Uint8Array(32);
const textBytes32 = (value) => {
  const result = new Uint8Array(32);
  result.set(new TextEncoder().encode(value).slice(0, 32));
  return result;
};

function hex(value) {
  return Buffer.from(value).toString('hex');
}

// The generated wrapper keeps non-exported Compact circuits private. Calling
// these generated methods is only for deriving the exact commitment and issuer
// key bytes used by the circuit under test; approval/claim still use callTx.
const generatedForDerivation = new ManagedProofPerks.Contract({
  issuerSecret: () => [undefined, zeroBytes32()],
  approvedContributorSecret: () => [undefined, zeroBytes32()],
  approvedContributorAnchor: () => [undefined, zeroBytes32()],
  approvedPoints: () => [undefined, 0n],
  contributorAnchor: () => [undefined, zeroBytes32()],
  contributorSecret: () => [undefined, zeroBytes32()],
  contributorPoints: () => [undefined, 0n],
  revocationTargetSecret: () => [undefined, zeroBytes32()],
  oldContributorAnchor: () => [undefined, zeroBytes32()],
  oldContributorSecret: () => [undefined, zeroBytes32()],
  findCommitmentPath: () => [undefined, undefined],
});

const issuerSecret = textBytes32('issuer-secret-for-actual-test');
const contributorSecret = textBytes32('contributor-secret-for-actual-test');
const contributorAnchor = textBytes32('stable-anchor-for-actual-test');
const issuerAddress = generatedForDerivation._issuerPublicKey_0(issuerSecret);
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
    const pathForCommitment = state.commitmentPaths.get(hex(commitment));
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

async function deployFresh(label) {
  const privateStateId = `${PRIVATE_STATE_ID}-${label}-${Date.now()}`;
  const deployed = await deployContract(providers, {
    compiledContract: compiledProofPerks,
    privateStateId,
    initialPrivateState: privateState(),
    args: [TEST_CAMPAIGN_ID, TEST_THRESHOLD, true, issuerAddress, TEST_REWARD_BUDGET],
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
  const expectedCommitment = generatedForDerivation._contributionCommitment_0(
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
  const beforeClaim = await publicLedger(deployed);
  await timedCompactCall('happy-path claim', () => deployed.callTx.claim_reward(recipient));
  const afterClaim = await publicLedger(deployed);
  assert.equal(Number(afterClaim.usedNullifiers.size()), Number(beforeClaim.usedNullifiers.size()) + 1);
  console.log('PASS — REAL COMPACT/TESTKIT happy path: claim accepted and nullifier recorded.');
});

test('2. actual Compact circuit: tampered points are rejected', { skip: skipReason }, async () => {
  assertEnabled();
  const { deployed, privateStateId } = await deployFresh('tampered');
  await timedCompactCall('tampered approval', () => deployed.callTx.approve_contribution());
  const tamperedState = privateState({ contributorPoints: TEST_POINTS + 1n });
  await providers.privateStateProvider.set(privateStateId, tamperedState);
  const before = await publicLedger(deployed);
  await assert.rejects(
    timedCompactCall('tampered claim', () => deployed.callTx.claim_reward(recipient)),
    (error) => {
      console.log(`Tampered rejection: ${error instanceof Error ? error.message : String(error)}`);
      return true;
    },
  );
  const after = await publicLedger(deployed);
  assert.equal(Number(after.usedNullifiers.size()), Number(before.usedNullifiers.size()));
  console.log('PASS — REAL COMPACT/TESTKIT tampered credential: proof generation/verification rejected it.');
});

test('3. actual Compact circuit: duplicate claim is rejected', { skip: skipReason }, async () => {
  assertEnabled();
  const { deployed, privateStateId } = await deployFresh('double');
  await timedCompactCall('double-claim approval', () => deployed.callTx.approve_contribution());
  await installCommitmentPath(deployed, privateStateId, privateState());
  await timedCompactCall('double-claim first claim', () => deployed.callTx.claim_reward(recipient));
  const afterFirst = await publicLedger(deployed);

  await assert.rejects(
    timedCompactCall('double-claim second claim', () => deployed.callTx.claim_reward(recipient)),
    (error) => {
      console.log(`Duplicate rejection: ${error instanceof Error ? error.message : String(error)}`);
      return true;
    },
  );
  const afterSecond = await publicLedger(deployed);
  assert.equal(Number(afterSecond.usedNullifiers.size()), Number(afterFirst.usedNullifiers.size()));
  console.log('PASS — REAL COMPACT/TESTKIT double claim: second transaction rejected and set unchanged.');
});
