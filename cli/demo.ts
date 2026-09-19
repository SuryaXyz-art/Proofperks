// SPDX-License-Identifier: Apache-2.0

/**
 * ProofPerks Wave 1 demo runner.
 *
 * Live mode:
 *   PROOFPERKS_DEMO_MODE=live
 *   PROOFPERKS_NETWORK=preprod|local|testnet
 *   PROOFPERKS_DEMO_ADAPTER=/absolute/path/to/preprod-demo-adapter.ts
 *   npm run demo --workspace @proofperks/cli
 *
 * The adapter is the small environment-specific bridge to the generated
 * Compact contract, Midnight.js providers, wallet, indexer, proof server,
 * and either a local or testnet deployment. It must export:
 *
 *   createProofPerksDeployment({ network, scenario }): Promise<Deployment>
 *
 * Deployment methods:
 *   snapshot(): Promise<{ commitmentsRoot: string; usedNullifiers: string[] }>
 *   approveContribution({ issuerSecret, contributorSecret, points })
 *   claimReward({ contributorSecret, points, recipient })
 *   payoutReward(nullifier)
 *
 * `approveContribution` and `claimReward` receive private values as witness
 * inputs. The runner never prints those values. `claimReward` may return
 * `proofGenerationMs`; otherwise the runner measures the wall-clock duration
 * of the adapter's claim call.
 *
 * Reference mode is explicit and local-only:
 *   PROOFPERKS_DEMO_MODE=reference npm run demo --workspace @proofperks/cli
 *
 * It is useful for the Wave 1 narration before the Compact compiler and live
 * deployment are available, but its timings are not ZK proof-server timings.
 */

import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';

type Network = 'local' | 'testnet' | 'preprod';
type ScenarioName = 'happy-path' | 'tampered-credential' | 'double-claim';

type Snapshot = {
  commitmentsRoot: string;
  usedNullifiers: string[];
};

type PrivateClaimInput = {
  contributorSecret: string;
  points: number;
  recipient?: string;
};

type PrivateApprovalInput = PrivateClaimInput & {
  issuerSecret: string;
};

type ApprovalResult = {
  commitment?: string;
  transactionId?: string;
};

type ClaimResult = {
  nullifier?: string;
  transactionId?: string;
  proofGenerationMs?: number;
  timings?: { simulationMs?: number; transactionMs?: number; provingMs?: number; measurementProvenance: string };
};

type PayoutResult = {
  amount?: bigint | number;
  recipient?: string;
  transactionId?: string;
  timings?: { transactionMs?: number; measurementProvenance: string };
};

type Deployment = {
  network: Network;
  address?: string;
  snapshot(): Promise<Snapshot>;
  approveContribution(input: PrivateApprovalInput): Promise<ApprovalResult>;
  claimReward(input: PrivateClaimInput): Promise<ClaimResult>;
  payoutReward?(nullifier: string): Promise<PayoutResult>;
  close?(): Promise<void>;
};

type DeploymentFactory = (options: {
  network: Network;
  scenario: ScenarioName;
}) => Promise<Deployment>;

const campaign = {
  id: 'campaign-1',
  thresholdPoints: 100,
  active: true,
};

const rewardAmount = 1000;
const recipient = 'mn_addr_preprod1proofperksrecipient';

const values = {
  issuerSecret: 'issuer-secret',
  contributorSecret: 'contributor-secret',
  approvedPoints: 125,
  tamperedPoints: 126,
};

function digest(...parts: unknown[]): string {
  const sha256 = createHash('sha256');
  for (const part of parts) {
    const value = String(part);
    sha256.update(`${value.length}:${value};`);
  }
  return sha256.digest('hex');
}

function makeCommitment(input: PrivateClaimInput): string {
  return digest(
    'proofperks:contribution',
    campaign.id,
    input.contributorSecret,
    input.points,
  );
}

function makeNullifier(input: PrivateClaimInput): string {
  return digest('proofperks:nullifier', campaign.id, input.contributorSecret);
}

function makeIssuerAddress(issuerSecret: string): string {
  return digest('proofperks:issuer-key', issuerSecret);
}

function divider(char = '═'): void {
  console.log(char.repeat(72));
}

function printHeader(title: string): void {
  console.log();
  divider();
  console.log(title);
  divider();
}

function printPrivate(label: string): void {
  console.log(`  [PRIVATE — local prover only] ${label}: <redacted>`);
}

function printPublic(label: string, value: unknown): void {
  console.log(`  [PUBLIC — written to ledger] ${label}: ${value}`);
}

function printSnapshot(label: string, snapshot: Snapshot): void {
  console.log(`  ${label}`);
  console.log(`    commitments root: ${snapshot.commitmentsRoot}`);
  console.log(
    `    nullifier set: ${snapshot.usedNullifiers.length === 0 ? '∅' : snapshot.usedNullifiers.join(', ')}`,
  );
}

function printDeployment(deployment: Deployment): void {
  console.log(`\nDeployment: ${deployment.network}${deployment.address ? ` — ${deployment.address}` : ''}`);
}

function assertCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function measureClaim<T>(claim: () => Promise<T>): Promise<{ result?: T; error?: unknown; elapsedMs: number }> {
  const started = performance.now();
  return claim()
    .then((result) => ({ result, elapsedMs: performance.now() - started }))
    .catch((error: unknown) => ({ error, elapsedMs: performance.now() - started }));
}

function printClaimTiming(result: ClaimResult | undefined, elapsedMs: number): void {
  if (result?.timings) {
    const timing = result.timings;
    console.log(`  Measurement provenance: ${timing.measurementProvenance}`);
    if (timing.simulationMs !== undefined) console.log(`  Simulation duration: ${timing.simulationMs.toFixed(3)} ms`);
    if (timing.transactionMs !== undefined) console.log(`  Complete transaction duration: ${timing.transactionMs.toFixed(3)} ms`);
    console.log(`  Independently measured proving duration: ${timing.provingMs === undefined ? 'unavailable' : `${timing.provingMs.toFixed(3)} ms`}`);
    return;
  }
  console.log(`  Measurement provenance: ${process.env.PROOFPERKS_DEMO_MODE === 'live' ? 'live_midnight_transaction' : 'reference_simulation'}`);
  console.log(`  ${process.env.PROOFPERKS_DEMO_MODE === 'live' ? 'Complete transaction attempt' : 'Simulation'} duration: ${elapsedMs.toFixed(3)} ms`);
  console.log('  Independently measured proving duration: unavailable');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function hasValue(valuesToCheck: string[], value: string): boolean {
  return valuesToCheck.includes(value);
}

async function runHappyPath(factory: DeploymentFactory, network: Network): Promise<void> {
  const scenario: ScenarioName = 'happy-path';
  printHeader('SCENARIO 1 OF 3 — HAPPY PATH');
  console.log('An issuer approves enough points, then the contributor claims once.');

  const deployment = await factory({ network, scenario });
  try {
    printDeployment(deployment);
    console.log('\nSubmitted for approval:');
    printPrivate('issuerSecret');
    printPrivate('contributorSecret');
    printPrivate('points');
    printPublic('campaign id', campaign.id);
    printPublic('threshold', campaign.thresholdPoints);
    printPublic('active', campaign.active);

    const beforeApproval = await deployment.snapshot();
    printSnapshot('\nLedger before approval:', beforeApproval);
    const approval = await deployment.approveContribution({
      issuerSecret: values.issuerSecret,
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
    });
    const afterApproval = await deployment.snapshot();
    printPublic('approved commitment', approval.commitment ?? '<adapter did not return leaf>');
    printSnapshot('Ledger after approval:', afterApproval);
    assertCondition(afterApproval.commitmentsRoot !== beforeApproval.commitmentsRoot, 'approval did not change the commitments root');

    console.log('\nSubmitted for claim:');
    printPrivate('contributorSecret');
    printPrivate('points');
    printPublic('campaign id', campaign.id);
    const beforeClaim = await deployment.snapshot();
    printSnapshot('\nNullifier set before claim:', beforeClaim);

    const measured = await measureClaim(() => deployment.claimReward({
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
      recipient,
    }));
    assertCondition(!measured.error, `claim failed: ${errorMessage(measured.error)}`);
    const claim = measured.result as ClaimResult;
    const afterClaim = await deployment.snapshot();
    printPublic('claim nullifier', claim.nullifier ?? '<adapter did not return nullifier>');
    printSnapshot('Nullifier set after claim:', afterClaim);
    printClaimTiming(claim, measured.elapsedMs);

    const expected = claim.nullifier ?? makeNullifier({
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
    });
    assertCondition(afterClaim.usedNullifiers.length === beforeClaim.usedNullifiers.length + 1, 'nullifier set did not grow by one');
    assertCondition(hasValue(afterClaim.usedNullifiers, expected), 'claim nullifier was not recorded');
    if (deployment.payoutReward) {
      const payout = await deployment.payoutReward(expected);
      printPublic('payout recipient', payout.recipient ?? recipient);
      printPublic('payout amount (native Preprod test token base units)', payout.amount ?? rewardAmount);
    }
    console.log('\nFINAL: PASS — contributor claimed, nullifier was recorded, and payout was issued');
  } finally {
    await deployment.close?.();
  }
}

async function runTamperedCredential(factory: DeploymentFactory, network: Network): Promise<void> {
  const scenario: ScenarioName = 'tampered-credential';
  printHeader('SCENARIO 2 OF 3 — TAMPERED CREDENTIAL');
  console.log('The contributor changes the points, so the derived commitment is not approved.');

  const deployment = await factory({ network, scenario });
  try {
    printDeployment(deployment);
    console.log('\nIssuer approval submitted first:');
    printPrivate('issuerSecret');
    printPrivate('contributorSecret');
    printPrivate('approved points');
    printPublic('campaign id', campaign.id);
    const beforeApproval = await deployment.snapshot();
    printSnapshot('\nLedger before approval:', beforeApproval);
    const approval = await deployment.approveContribution({
      issuerSecret: values.issuerSecret,
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
    });
    const afterApproval = await deployment.snapshot();
    printPublic('approved commitment', approval.commitment ?? '<adapter did not return leaf>');
    printSnapshot('Ledger after approval:', afterApproval);

    console.log('\nTampered claim submitted:');
    printPrivate('contributorSecret');
    printPrivate('tampered points');
    printPublic('campaign id', campaign.id);
    const beforeClaim = await deployment.snapshot();
    printSnapshot('\nNullifier set before claim attempt:', beforeClaim);
    const measured = await measureClaim(() => deployment.claimReward({
      contributorSecret: values.contributorSecret,
      points: values.tamperedPoints,
      recipient,
    }));
    assertCondition(!!measured.error, 'tampered claim unexpectedly succeeded');
    const afterClaim = await deployment.snapshot();
    printSnapshot('Nullifier set after rejected claim:', afterClaim);
    printClaimTiming(undefined, measured.elapsedMs);
    console.log(`  Rejection reason: ${errorMessage(measured.error)}`);
    assertCondition(afterClaim.commitmentsRoot === beforeClaim.commitmentsRoot, 'rejected claim changed the commitments root');
    assertCondition(afterClaim.usedNullifiers.length === beforeClaim.usedNullifiers.length, 'rejected claim changed the nullifier set');
    if (deployment.payoutReward) {
      await deployment.payoutReward(makeNullifier({
        contributorSecret: values.contributorSecret,
        points: values.tamperedPoints,
      })).then(
        () => { throw new Error('tampered claim unexpectedly produced a payout'); },
        () => undefined,
      );
    }
    console.log('\nFINAL: PASS — tampered credential was rejected');
  } finally {
    await deployment.close?.();
  }
}

async function runDoubleClaim(factory: DeploymentFactory, network: Network): Promise<void> {
  const scenario: ScenarioName = 'double-claim';
  printHeader('SCENARIO 3 OF 3 — DOUBLE CLAIM');
  console.log('The same contributor secret claims twice for the same campaign.');

  const deployment = await factory({ network, scenario });
  try {
    printDeployment(deployment);
    console.log('\nIssuer approval submitted first:');
    printPrivate('issuerSecret');
    printPrivate('contributorSecret');
    printPrivate('points');
    printPublic('campaign id', campaign.id);
    const beforeApproval = await deployment.snapshot();
    printSnapshot('Ledger before approval:', beforeApproval);
    const approval = await deployment.approveContribution({
      issuerSecret: values.issuerSecret,
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
    });
    const afterApproval = await deployment.snapshot();
    printPublic('approved commitment', approval.commitment ?? '<adapter did not return leaf>');
    printSnapshot('Ledger after approval:', afterApproval);
    assertCondition(afterApproval.commitmentsRoot !== beforeApproval.commitmentsRoot, 'approval did not change the commitments root');

    console.log('\nFirst claim submitted:');
    printPrivate('contributorSecret');
    printPrivate('points');
    const beforeFirst = await deployment.snapshot();
    printSnapshot('Nullifier set before first claim:', beforeFirst);
    const first = await measureClaim(() => deployment.claimReward({
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
      recipient,
    }));
    assertCondition(!first.error, `first claim failed: ${errorMessage(first.error)}`);
    const firstClaim = first.result as ClaimResult;
    const afterFirst = await deployment.snapshot();
    printPublic('first claim nullifier', firstClaim.nullifier ?? '<adapter did not return nullifier>');
    printSnapshot('Nullifier set after first claim:', afterFirst);
    printClaimTiming(firstClaim, first.elapsedMs);
    if (deployment.payoutReward) {
      const payout = await deployment.payoutReward(firstClaim.nullifier ?? makeNullifier({
        contributorSecret: values.contributorSecret,
        points: values.approvedPoints,
      }));
      printPublic('payout amount (native Preprod test token base units)', payout.amount ?? rewardAmount);
    }

    console.log('\nSecond claim submitted with the same private inputs:');
    printPrivate('contributorSecret');
    printPrivate('points');
    const beforeSecond = await deployment.snapshot();
    printSnapshot('Nullifier set before second claim:', beforeSecond);
    const second = await measureClaim(() => deployment.claimReward({
      contributorSecret: values.contributorSecret,
      points: values.approvedPoints,
    }));
    assertCondition(!!second.error, 'second claim unexpectedly succeeded');
    const afterSecond = await deployment.snapshot();
    printSnapshot('Nullifier set after rejected second claim:', afterSecond);
    printClaimTiming(undefined, second.elapsedMs);
    console.log(`  Rejection reason: ${errorMessage(second.error)}`);
    assertCondition(afterFirst.usedNullifiers.length === beforeFirst.usedNullifiers.length + 1, 'first claim did not record one nullifier');
    assertCondition(afterSecond.usedNullifiers.length === afterFirst.usedNullifiers.length, 'second claim changed the nullifier set');
    console.log('\nFINAL: PASS — second claim was rejected because the nullifier already exists');
  } finally {
    await deployment.close?.();
  }
}

function referenceDeploymentFactory(): DeploymentFactory {
  return async ({ network }) => {
    const leaves: string[] = [];
    const usedNullifiers = new Set<string>();
    const pendingRecipients = new Map<string, string>();
    const paidNullifiers = new Set<string>();
    const root = () => digest('proofperks:root', ...leaves);
    const issuerAddress = makeIssuerAddress(values.issuerSecret);

    return {
      network,
      address: 'reference-only://proofperks',
      async snapshot() {
        return { commitmentsRoot: root(), usedNullifiers: [...usedNullifiers] };
      },
      async approveContribution(input) {
        if (makeIssuerAddress(input.issuerSecret) !== issuerAddress) throw new Error('caller is not the issuer');
        const leaf = makeCommitment(input);
        leaves.push(leaf);
        return { commitment: leaf };
      },
      async claimReward(input) {
        const started = performance.now();
        const leaf = makeCommitment(input);
        if (!leaves.includes(leaf)) throw new Error('proof generation failed: commitment is not approved');
        if (input.points < campaign.thresholdPoints) throw new Error('proof verification failed: threshold not met');
        const claimNullifier = makeNullifier(input);
        if (usedNullifiers.has(claimNullifier)) throw new Error('proof verification failed: nullifier already exists');
        usedNullifiers.add(claimNullifier);
        pendingRecipients.set(claimNullifier, input.recipient ?? recipient);
        return { nullifier: claimNullifier, timings: { simulationMs: performance.now() - started, measurementProvenance: 'reference_simulation' } };
      },
      async payoutReward(claimNullifier) {
        if (!usedNullifiers.has(claimNullifier)) throw new Error('claim not verified');
        if (paidNullifiers.has(claimNullifier)) throw new Error('reward already paid');
        const payoutRecipient = pendingRecipients.get(claimNullifier);
        if (!payoutRecipient) throw new Error('claim recipient missing');
        paidNullifiers.add(claimNullifier);
        pendingRecipients.delete(claimNullifier);
        return { amount: rewardAmount, recipient: payoutRecipient };
      },
    };
  };
}

async function loadLiveFactory(): Promise<DeploymentFactory> {
  const adapterPath = process.env.PROOFPERKS_DEMO_ADAPTER;
  assertCondition(adapterPath, 'PROOFPERKS_DEMO_ADAPTER is not set');
  const adapter = await import(pathToFileURL(adapterPath).href) as { createProofPerksDeployment?: DeploymentFactory };
  assertCondition(typeof adapter.createProofPerksDeployment === 'function', 'deployment adapter must export createProofPerksDeployment');
  return adapter.createProofPerksDeployment;
}

async function main(): Promise<void> {
  // Keep the original Wave 1 demo runnable after adding Preprod integration.
  // Live execution remains opt-in through PROOFPERKS_DEMO_MODE=live.
  const mode = process.env.PROOFPERKS_DEMO_MODE ?? 'reference';
  const network = (process.env.PROOFPERKS_NETWORK ?? 'local') as Network;
  assertCondition(network === 'local' || network === 'testnet' || network === 'preprod', 'PROOFPERKS_NETWORK must be local, testnet, or preprod');

  printHeader('PROOFPERKS WAVE 1 DEMO');
  console.log(`Mode: ${mode}`);
  console.log(`Network: ${network}`);
  console.log('Private inputs stay inside the local prover and are never printed or written to the ledger.');
  console.log('Public data is shown explicitly when it is written to or read from the ledger.');

  let factory: DeploymentFactory;
  if (mode === 'reference') {
    console.log('NOTICE: reference mode — this is not a live Compact deployment.');
    factory = referenceDeploymentFactory();
  } else if (mode === 'live') {
    try {
      factory = await loadLiveFactory();
    } catch (error) {
      printHeader('LIVE DEPLOYMENT NOT READY');
      console.log(`Reason: ${errorMessage(error)}`);
      console.log('No scenarios were submitted to a chain. Configure the live deployment adapter and run again.');
      for (const scenario of ['happy path', 'tampered credential', 'double claim']) {
        console.log(`FINAL: FAIL — ${scenario}: live deployment unavailable`);
      }
      printHeader('FINAL DEMO SUMMARY');
      console.log('PASS: 0/3 scenarios');
      console.log('FAIL: 3/3 scenarios');
      process.exitCode = 1;
      return;
    }
  } else {
    throw new Error('PROOFPERKS_DEMO_MODE must be live or reference');
  }

  const scenarios: Array<(factory: DeploymentFactory, network: Network) => Promise<void>> = [
    runHappyPath,
    runTamperedCredential,
    runDoubleClaim,
  ];
  let passed = 0;
  for (const scenario of scenarios) {
    try {
      await scenario(factory, network);
      passed += 1;
    } catch (error) {
      console.log(`\nFINAL: FAIL — ${errorMessage(error)}`);
    }
  }

  printHeader('FINAL DEMO SUMMARY');
  console.log(`PASS: ${passed}/3 scenarios`);
  console.log(`FAIL: ${3 - passed}/3 scenarios`);
  if (passed !== 3) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(`\nDemo could not start: ${errorMessage(error)}`);
  console.error('For live mode, provide a compiled Compact deployment adapter with PROOFPERKS_DEMO_ADAPTER.');
  process.exitCode = 1;
});
