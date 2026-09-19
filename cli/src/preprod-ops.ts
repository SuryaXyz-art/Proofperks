// SPDX-License-Identifier: Apache-2.0

import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPublicStates, getUnshieldedBalances, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { DustSecretKey, ZswapSecretKeys, nativeToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { UnboundTransaction, WalletProvider, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { ledger, CompiledProofPerksContract, bytes32FromHex, deriveIssuerPublicKey, proofPerksPrivateStateKey, uint128 } from '../../contract/dist/index.js';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.ts';
import { assertProofServer, deploymentPath, loadManifest, managedPath, privateStateRoot, startWallet, withTimeout, waitFor } from './preprod-runtime.ts';

setNetworkId(PREPROD_CONFIG.networkId);
const command = process.argv[2];
if (command !== 'fund' && command !== 'verify') throw new Error('Use `fund` or `verify`.');
const deployment = JSON.parse(await readFile(deploymentPath, 'utf8'));
const manifest = await loadManifest();
if (deployment.sourceDigest !== manifest.source.sha256) throw new Error('Deployment source digest does not match the current compiled artifact. Refusing to operate.');
if (deployment.network !== PREPROD_CONFIG.networkId) throw new Error('Deployment record is not for Preprod.');

const publicDataProvider = indexerPublicDataProvider(PREPROD_CONFIG.indexer, PREPROD_CONFIG.indexerWS);
if (command === 'verify') {
  await assertProofServer();
  const [state, balances] = await Promise.all([
    withTimeout(getPublicStates(publicDataProvider, deployment.address), 30_000, 'contract state read'),
    withTimeout(getUnshieldedBalances(publicDataProvider, deployment.address), 30_000, 'contract token balance read'),
  ]);
  const publicLedger = ledger(state.contractState as any);
  const actualNativeBalance = balances.find((entry) => entry.tokenType === nativeToken().raw)?.balance ?? 0n;
  const result = { status: 'confirmed', address: deployment.address, transactionId: deployment.transactionId, network: deployment.network, sourceDigest: manifest.source.sha256, artifactCount: manifest.artifacts.length, campaign: { id: publicLedger.campaign.id.toString(), thresholdPoints: publicLedger.campaign.thresholdPoints.toString(), active: publicLedger.campaign.active, issuerPublicKey: Buffer.from(publicLedger.issuer).toString('hex'), rewardAmount: publicLedger.rewardAmount.toString(), rewardBudget: publicLedger.rewardBudget.toString() }, actualNativeTokenBalance: actualNativeBalance.toString(), budgetCap: publicLedger.rewardBudget.toString(), reservedRewardBudget: publicLedger.reservedRewardBudget.toString() };
  console.log(JSON.stringify(result, null, 2));
} else {
  await assertProofServer();
  const amount = uint128(requirePreprodEnv('PROOFPERKS_FUND_REWARD_POOL'), 'PROOFPERKS_FUND_REWARD_POOL');
  const issuerSecret = bytes32FromHex(requirePreprodEnv('PROOFPERKS_ISSUER_SECRET'), 'PROOFPERKS_ISSUER_SECRET');
  const issuerPublicKey = bytes32FromHex(requirePreprodEnv('PROOFPERKS_ISSUER_PUBLIC_KEY'), 'PROOFPERKS_ISSUER_PUBLIC_KEY');
  if (Buffer.compare(Buffer.from(issuerPublicKey), Buffer.from(deriveIssuerPublicKey(issuerSecret))) !== 0) throw new Error('Issuer public key does not match the configured issuer secret.');
  const privateStatePassword = requirePreprodEnv('PROOFPERKS_PRIVATE_STATE_PASSWORD');
  const runtime = await startWallet();
  try {
    if (runtime.dustBalance <= 0n) throw new Error('Wallet has no DUST available for transaction fees.');
    if (runtime.nativeBalance < amount + 1000n) throw new Error(`Wallet native balance is insufficient for funding plus reserve. Required at least ${amount + 1000n}; actual balance is ${runtime.nativeBalance}.`);
    const zswapSecretKeys = ZswapSecretKeys.fromSeed(runtime.seeds.shielded);
    const dustSecretKey = DustSecretKey.fromSeed(runtime.seeds.dust);
    const walletProvider: WalletProvider = { getCoinPublicKey: () => zswapSecretKeys.coinPublicKey, getEncryptionPublicKey: () => zswapSecretKeys.encryptionPublicKey, async balanceTx(tx: UnboundTransaction, ttl = new Date(Date.now() + 60 * 60 * 1000)) { const balanced = await runtime.wallet.balanceUnboundTransaction(tx, { shieldedSecretKeys: zswapSecretKeys, dustSecretKey }, { ttl }); const signed = await runtime.wallet.signRecipe(balanced, (payload) => runtime.keystore.signData(payload)); return runtime.wallet.finalizeRecipe(signed); } };
    await mkdir(privateStateRoot, { recursive: true, mode: 0o700 });
    const privateStateProvider = levelPrivateStateProvider({ privateStateStoreName: path.join(privateStateRoot, 'private-state'), signingKeyStoreName: path.join(privateStateRoot, 'signing-keys'), privateStoragePasswordProvider: () => privateStatePassword, accountId: runtime.walletAddress });
    const zkConfigProvider = new NodeZkConfigProvider(managedPath);
    const providers: MidnightProviders<any, any, any> = { privateStateProvider, publicDataProvider, zkConfigProvider, proofProvider: httpClientProofProvider(PREPROD_CONFIG.proofServer, zkConfigProvider), walletProvider, midnightProvider: { submitTx: (tx) => runtime.wallet.submitTransaction(tx) } };
    const initialPrivateState = { issuerSecret, approvedContributorSecret: new Uint8Array(32), approvedContributorAnchor: new Uint8Array(32), approvedPoints: 0n, contributorAnchor: new Uint8Array(32), contributorSecret: new Uint8Array(32), contributorPoints: 0n, revocationTargetSecret: new Uint8Array(32), oldContributorAnchor: new Uint8Array(32), oldContributorSecret: new Uint8Array(32), commitmentPaths: new Map() };
    const deployed = await findDeployedContract(providers, { contractAddress: deployment.address, compiledContract: CompiledProofPerksContract, privateStateId: `${proofPerksPrivateStateKey}:organizer:${runtime.walletAddress}`, initialPrivateState });
    const before = await getUnshieldedBalances(publicDataProvider, deployment.address);
    const beforeBalance = before.find((entry) => entry.tokenType === nativeToken().raw)?.balance ?? 0n;
    const tx = await deployed.callTx.fund_reward_pool(amount);
    const txHash = tx.public.txHash;
    const after = await waitFor(async () => getUnshieldedBalances(publicDataProvider, deployment.address), (balances) => (balances.find((entry) => entry.tokenType === nativeToken().raw)?.balance ?? 0n) >= beforeBalance + amount, 120_000, 'funding confirmation');
    const afterBalance = after.find((entry) => entry.tokenType === nativeToken().raw)?.balance ?? 0n;
    console.log(JSON.stringify({ status: 'confirmed', address: deployment.address, transactionId: txHash, network: PREPROD_CONFIG.networkId, actualNativeTokenBalanceBefore: beforeBalance.toString(), amountFunded: amount.toString(), actualNativeTokenBalanceAfter: afterBalance.toString(), budgetCapUnchanged: deployment.campaign.rewardBudget, note: 'Actual contract token balance is reported separately from the public campaign budget cap.' }, null, 2));
  } finally { await runtime.stop().catch(() => undefined); }
}
