// SPDX-License-Identifier: Apache-2.0

import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { encodeUserAddress } from '@midnight-ntwrk/compact-runtime';
import { findDeployedContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { DustSecretKey, ZswapSecretKeys } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { MidnightProviders, UnboundTransaction, WalletProvider } from '@midnight-ntwrk/midnight-js-types';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { bytes32FromHex, CompiledProofPerksContract, deriveClaimNullifier, deriveContributionCommitment, ledger, proofPerksPrivateStateKey, uint64 } from '../../contract/dist/index.js';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.ts';
import { assertProofServer, deploymentPath, loadManifest, managedPath, privateStateRoot, startWallet, withTimeout, waitFor } from './preprod-runtime.ts';

setNetworkId(PREPROD_CONFIG.networkId);

type DemoInput = { issuerSecret?: string; contributorSecret: string; points: number; recipient?: string };
type Timing = { transactionMs: number; measurementProvenance: 'live_midnight_transaction'; provingMs?: number };
type DemoSnapshot = { commitmentsRoot: string; usedNullifiers: string[] };

const zero = new Uint8Array(32);
const hex = (value: Uint8Array) => Buffer.from(value).toString('hex');

export async function createProofPerksDeployment({ network, scenario }: { network: 'preprod' | 'local' | 'testnet'; scenario: string }) {
  if (network !== 'preprod') throw new Error('The live adapter supports only the configured Preprod deployment.');
  await assertProofServer();
  const deployment = JSON.parse(await readFile(deploymentPath, 'utf8')) as { address: string; network: string; campaign: { id: string }; credentialScope: { networkId: string; deploymentId: string } };
  if (deployment.network !== 'preprod' || !deployment.address) throw new Error('A confirmed Preprod deployment record is required.');
  const manifest = await loadManifest();
  const runtime = await startWallet();
  const credentialNetworkId = bytes32FromHex(deployment.credentialScope.networkId, 'deployment credential network id');
  const credentialDeploymentId = bytes32FromHex(deployment.credentialScope.deploymentId, 'deployment credential id');
  const privateStatePassword = requirePreprodEnv('PROOFPERKS_PRIVATE_STATE_PASSWORD');
  const stateKey = `${proofPerksPrivateStateKey}:demo:${scenario}:${runtime.walletAddress}`;
  await mkdir(privateStateRoot, { recursive: true, mode: 0o700 });
  const privateStateProvider = levelPrivateStateProvider({ privateStateStoreName: path.join(privateStateRoot, 'private-state'), signingKeyStoreName: path.join(privateStateRoot, 'signing-keys'), privateStoragePasswordProvider: () => privateStatePassword, accountId: runtime.walletAddress });
  const zswapSecretKeys = ZswapSecretKeys.fromSeed(runtime.seeds.shielded);
  const dustSecretKey = DustSecretKey.fromSeed(runtime.seeds.dust);
  const walletProvider: WalletProvider = { getCoinPublicKey: () => zswapSecretKeys.coinPublicKey, getEncryptionPublicKey: () => zswapSecretKeys.encryptionPublicKey, async balanceTx(tx: UnboundTransaction, ttl = new Date(Date.now() + 60 * 60 * 1000)) { const balanced = await runtime.wallet.balanceUnboundTransaction(tx, { shieldedSecretKeys: zswapSecretKeys, dustSecretKey }, { ttl }); const signed = await runtime.wallet.signRecipe(balanced, (payload) => runtime.keystore.signData(payload)); return runtime.wallet.finalizeRecipe(signed); } };
  const publicDataProvider = indexerPublicDataProvider(PREPROD_CONFIG.indexer, PREPROD_CONFIG.indexerWS);
  const zkConfigProvider = new NodeZkConfigProvider(managedPath);
  const providers: MidnightProviders<any, any, any> = { privateStateProvider, publicDataProvider, zkConfigProvider, proofProvider: httpClientProofProvider(PREPROD_CONFIG.proofServer, zkConfigProvider), walletProvider, midnightProvider: { submitTx: (tx) => runtime.wallet.submitTransaction(tx) } };
  const initialPrivateState = { issuerSecret: zero, approvedContributorSecret: zero, approvedContributorAnchor: zero, approvedPoints: 0n, contributorAnchor: zero, contributorSecret: zero, contributorPoints: 0n, revocationTargetSecret: zero, oldContributorAnchor: zero, oldContributorSecret: zero, commitmentPaths: new Map() };
  const deployed = await findDeployedContract(providers, { contractAddress: deployment.address, compiledContract: CompiledProofPerksContract, privateStateId: stateKey, initialPrivateState });
  const update = async (input: DemoInput, pathMap = new Map()) => privateStateProvider.set(stateKey, { ...initialPrivateState, issuerSecret: input.issuerSecret ? bytes32FromHex(input.issuerSecret, 'issuer secret') : zero, approvedContributorSecret: bytes32FromHex(input.contributorSecret, 'contributor secret'), approvedContributorAnchor: bytes32FromHex(input.contributorSecret, 'contributor anchor'), approvedPoints: uint64(String(input.points), 'points'), contributorAnchor: bytes32FromHex(input.contributorSecret, 'contributor anchor'), contributorSecret: bytes32FromHex(input.contributorSecret, 'contributor secret'), contributorPoints: uint64(String(input.points), 'points'), commitmentPaths: pathMap });
  const snapshot = async (): Promise<DemoSnapshot> => { const state = ledger((await getPublicStates(publicDataProvider, deployment.address)).contractState as any); return { commitmentsRoot: String(state.approvedCommitments.root()), usedNullifiers: [...state.usedNullifiers].map((value) => hex(value)) }; };
  return {
    network: 'preprod' as const,
    address: deployment.address,
    snapshot,
    async approveContribution(input: DemoInput) { await update(input); const started = performance.now(); const result = await withTimeout(deployed.callTx.approve_contribution(), 10 * 60_000, 'live approval transaction'); const transactionMs = performance.now() - started; return { transactionId: String((result as any)?.txHash ?? ''), commitment: hex(deriveContributionCommitment({ credentialVersion: 1n, networkId: credentialNetworkId, deploymentId: credentialDeploymentId, campaignId: BigInt(deployment.campaign.id), anchor: bytes32FromHex(input.contributorSecret, 'contributor anchor'), secret: bytes32FromHex(input.contributorSecret, 'contributor secret'), points: BigInt(input.points) })), timings: { transactionMs, measurementProvenance: 'live_midnight_transaction' as const } }; },
    async claimReward(input: DemoInput) { const secret = bytes32FromHex(input.contributorSecret, 'contributor secret'); const commitment = deriveContributionCommitment({ credentialVersion: 1n, networkId: credentialNetworkId, deploymentId: credentialDeploymentId, campaignId: BigInt(deployment.campaign.id), anchor: secret, secret, points: BigInt(input.points) }); const state = ledger((await getPublicStates(publicDataProvider, deployment.address)).contractState as any); const commitmentPath = state.approvedCommitments.findPathForLeaf(commitment); if (!commitmentPath) throw new Error('No current Merkle path for the approved credential.'); await update(input, new Map([[hex(commitment), commitmentPath]])); const recipientAddress = input.recipient ?? (await runtime.wallet.unshielded.getAddress()).toString(); const started = performance.now(); const result = await withTimeout(deployed.callTx.claim_reward({ bytes: encodeUserAddress(recipientAddress) }), 10 * 60_000, 'live claim transaction'); const transactionMs = performance.now() - started; const nullifier = deriveClaimNullifier({ credentialVersion: 1n, networkId: credentialNetworkId, deploymentId: credentialDeploymentId, campaignId: BigInt(deployment.campaign.id), secret }); return { nullifier: hex(nullifier), transactionId: String((result as any)?.txHash ?? ''), timings: { transactionMs, measurementProvenance: 'live_midnight_transaction' as const } }; },
    async payoutReward(nullifierHex: string) { const started = performance.now(); const result = await withTimeout(deployed.callTx.payout_reward(bytes32FromHex(nullifierHex, 'nullifier')), 10 * 60_000, 'live payout transaction'); return { transactionId: String((result as any)?.txHash ?? ''), timings: { transactionMs: performance.now() - started, measurementProvenance: 'live_midnight_transaction' as const } }; },
    async close() { await runtime.stop().catch(() => undefined); },
    manifest,
  };
}
