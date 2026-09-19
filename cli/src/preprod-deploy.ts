// SPDX-License-Identifier: Apache-2.0

import { access, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { deployContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { DustSecretKey, ZswapSecretKeys, nativeToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { UnboundTransaction, WalletProvider, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { ledger, CompiledProofPerksContract, bytes32FromHex, deriveIssuerPublicKey, proofPerksPrivateStateKey, uint64, uint128 } from '../../contract/dist/index.js';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.ts';
import { assertProofServer, deploymentPath, loadManifest, managedPath, privateStateRoot, startWallet, withTimeout, waitFor } from './preprod-runtime.ts';

setNetworkId(PREPROD_CONFIG.networkId);

try {
  await access(new URL('../../deployments/preprod.json', import.meta.url));
  if (process.env.PROOFPERKS_ALLOW_NEW_DEPLOYMENT !== '1') throw new Error('deployments/preprod.json already exists. Refusing a blind second deployment; set PROOFPERKS_ALLOW_NEW_DEPLOYMENT=1 only after manual review.');
} catch (error) {
  if (error instanceof Error && !('code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT')) throw error;
}

const issuerSecret = bytes32FromHex(requirePreprodEnv('PROOFPERKS_ISSUER_SECRET'), 'PROOFPERKS_ISSUER_SECRET');
const issuerPublicKey = bytes32FromHex(requirePreprodEnv('PROOFPERKS_ISSUER_PUBLIC_KEY'), 'PROOFPERKS_ISSUER_PUBLIC_KEY');
if (Buffer.compare(Buffer.from(issuerPublicKey), Buffer.from(deriveIssuerPublicKey(issuerSecret))) !== 0) throw new Error('Issuer public key does not match the configured issuer secret.');
const credentialNetworkId = bytes32FromHex(requirePreprodEnv('PROOFPERKS_CREDENTIAL_NETWORK_ID'), 'PROOFPERKS_CREDENTIAL_NETWORK_ID');
const credentialDeploymentId = bytes32FromHex(requirePreprodEnv('PROOFPERKS_CREDENTIAL_DEPLOYMENT_ID'), 'PROOFPERKS_CREDENTIAL_DEPLOYMENT_ID');
const privateStatePassword = requirePreprodEnv('PROOFPERKS_PRIVATE_STATE_PASSWORD');
const campaignId = BigInt(process.env.PROOFPERKS_CAMPAIGN_ID ?? '1');
const threshold = uint64(process.env.PROOFPERKS_THRESHOLD ?? '100', 'PROOFPERKS_THRESHOLD');
const rewardBudget = uint128(process.env.PROOFPERKS_REWARD_BUDGET ?? '100000', 'PROOFPERKS_REWARD_BUDGET');
const fundingAmount = uint128(process.env.PROOFPERKS_FUND_REWARD_POOL ?? '0', 'PROOFPERKS_FUND_REWARD_POOL');
const minimumNativeReserve = uint128(process.env.PROOFPERKS_MIN_NATIVE_RESERVE ?? '1000', 'PROOFPERKS_MIN_NATIVE_RESERVE');

const manifest = await loadManifest();
await assertProofServer();
const runtime = await startWallet();
try {
  if (runtime.dustBalance <= 0n) throw new Error('Wallet has no DUST available for transaction fees. Fund/register DUST locally, then rerun once.');
  if (runtime.nativeBalance < fundingAmount + minimumNativeReserve) throw new Error(`Wallet native balance is insufficient for requested pool funding plus reserve. Required at least ${fundingAmount + minimumNativeReserve}; actual balance is ${runtime.nativeBalance}.`);
  const zswapSecretKeys = ZswapSecretKeys.fromSeed(runtime.seeds.shielded);
  const dustSecretKey = DustSecretKey.fromSeed(runtime.seeds.dust);
  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => zswapSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => zswapSecretKeys.encryptionPublicKey,
    async balanceTx(tx: UnboundTransaction, ttl = new Date(Date.now() + 60 * 60 * 1000)) {
      const balanced = await runtime.wallet.balanceUnboundTransaction(tx, { shieldedSecretKeys: zswapSecretKeys, dustSecretKey }, { ttl });
      const signed = await runtime.wallet.signRecipe(balanced, (payload) => runtime.keystore.signData(payload));
      return runtime.wallet.finalizeRecipe(signed);
    },
  };
  await mkdir(privateStateRoot, { recursive: true, mode: 0o700 });
  const privateStateProvider = levelPrivateStateProvider({ privateStateStoreName: path.join(privateStateRoot, 'private-state'), signingKeyStoreName: path.join(privateStateRoot, 'signing-keys'), privateStoragePasswordProvider: () => privateStatePassword, accountId: runtime.walletAddress });
  const zkConfigProvider = new NodeZkConfigProvider(managedPath);
  const providers: MidnightProviders<any, any, any> = {
    privateStateProvider,
    publicDataProvider: indexerPublicDataProvider(PREPROD_CONFIG.indexer, PREPROD_CONFIG.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(PREPROD_CONFIG.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: { submitTx: (tx) => runtime.wallet.submitTransaction(tx) },
  };
  const initialPrivateState = { issuerSecret, approvedContributorSecret: new Uint8Array(32), approvedContributorAnchor: new Uint8Array(32), approvedPoints: 0n, contributorAnchor: new Uint8Array(32), contributorSecret: new Uint8Array(32), contributorPoints: 0n, revocationTargetSecret: new Uint8Array(32), oldContributorAnchor: new Uint8Array(32), oldContributorSecret: new Uint8Array(32), commitmentPaths: new Map() };
  const deployed = await withTimeout(deployContract(providers, { compiledContract: CompiledProofPerksContract, privateStateId: `${proofPerksPrivateStateKey}:organizer:${runtime.walletAddress}`, initialPrivateState, args: [campaignId, threshold, true, issuerPublicKey, rewardBudget, credentialNetworkId, credentialDeploymentId] }), 10 * 60_000, 'contract deployment');
  const address = deployed.deployTxData.public.contractAddress;
  const txHash = deployed.deployTxData.public.txHash;
  const publicState = await waitFor(() => getPublicStates(providers.publicDataProvider, address), (value) => Boolean(value?.contractState), 120_000, 'deployment confirmation');
  const publicLedger = ledger(publicState.contractState as any);
  await mkdir(new URL('../../deployments/', import.meta.url), { recursive: true });
  const bundlePath = path.join(path.dirname(deploymentPath), 'preprod-circuit-bundle');
  for (const artifact of manifest.artifacts) {
    const source = path.join(managedPath, artifact.path);
    const destination = path.join(bundlePath, artifact.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
  await writeFile(deploymentPath, JSON.stringify({ address, transactionId: txHash, network: PREPROD_CONFIG.networkId, sourceDigest: manifest.source.sha256, toolchain: manifest.toolchain, circuits: manifest.circuits, artifacts: manifest.artifacts, circuitBundle: path.relative(path.dirname(deploymentPath), bundlePath), credentialScope: { networkId: Buffer.from(credentialNetworkId).toString('hex'), deploymentId: Buffer.from(credentialDeploymentId).toString('hex') }, campaign: { id: campaignId.toString(), thresholdPoints: threshold.toString(), active: true, issuerPublicKey: Buffer.from(issuerPublicKey).toString('hex'), rewardAmount: publicLedger.rewardAmount.toString(), rewardBudget: publicLedger.rewardBudget.toString() }, walletAddress: runtime.walletAddress, recordedAt: new Date().toISOString() }, null, 2));
  console.log(JSON.stringify({ status: 'confirmed', address, transactionId: txHash, network: PREPROD_CONFIG.networkId, walletAddress: runtime.walletAddress, nativeBalance: runtime.nativeBalance.toString(), dustBalance: runtime.dustBalance.toString(), campaign: { id: publicLedger.campaign.id.toString(), thresholdPoints: publicLedger.campaign.thresholdPoints.toString(), active: publicLedger.campaign.active, issuerPublicKey: Buffer.from(publicLedger.issuer).toString('hex'), rewardAmount: publicLedger.rewardAmount.toString(), rewardBudget: publicLedger.rewardBudget.toString() }, deploymentRecord: deploymentPath }, null, 2));
} finally {
  await runtime.stop().catch(() => undefined);
}
