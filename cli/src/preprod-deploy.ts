// SPDX-License-Identifier: Apache-2.0

/**
 * Deploy ProofPerks to Midnight Preprod with a headless issuer wallet.
 *
 * Required environment:
 *   PROOFPERKS_WALLET_SEED       32-byte hex wallet seed
 *   PROOFPERKS_ISSUER_PUBLIC_KEY 32-byte hex Compact issuer key
 *
 * Optional:
 *   PROOFPERKS_CAMPAIGN_ID       Field value, default 1
 *   PROOFPERKS_THRESHOLD         points, default 100
 *   PROOFPERKS_REWARD_BUDGET     native-token base units, default 100000
 *   PROOFPERKS_PROOF_SERVER       default http://127.0.0.1:6300
 */

import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fromHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { DustSecretKey, ZswapSecretKeys, Binding, Proof, SignatureEnabled, Transaction } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { FluentWalletBuilder } from '@midnight-ntwrk/testkit-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CompiledProofPerksContract, proofPerksPrivateStateKey } from '../../contract/dist/index.js';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.mjs';

setNetworkId(PREPROD_CONFIG.networkId);

const walletSeed = requirePreprodEnv('PROOFPERKS_WALLET_SEED');
const issuerPublicKey = fromHex(requirePreprodEnv('PROOFPERKS_ISSUER_PUBLIC_KEY'));
const privateStatePassword = requirePreprodEnv('PROOFPERKS_PRIVATE_STATE_PASSWORD');
const campaignId = BigInt(process.env.PROOFPERKS_CAMPAIGN_ID ?? '1');
const threshold = BigInt(process.env.PROOFPERKS_THRESHOLD ?? '100');
const rewardBudget = BigInt(process.env.PROOFPERKS_REWARD_BUDGET ?? '100000');

const { wallet, seeds, keystore } = await FluentWalletBuilder
  .forEnvironment(PREPROD_CONFIG)
  .withSeed(walletSeed)
  .buildWithoutStarting();

const zswapSecretKeys = ZswapSecretKeys.fromSeed(seeds.shielded);
const dustSecretKey = DustSecretKey.fromSeed(seeds.dust);
const walletProvider = {
  getCoinPublicKey: () => zswapSecretKeys.coinPublicKey,
  getEncryptionPublicKey: () => zswapSecretKeys.encryptionPublicKey,
  async balanceTx(tx) {
    const balanced = await wallet.balanceUnboundTransaction(tx, {
      shieldedSecretKeys: zswapSecretKeys,
      dustSecretKey,
    });
    const signed = await wallet.signRecipe(balanced, (payload) => keystore.signData(payload));
    return wallet.finalizeRecipe(signed);
  },
};

await wallet.start(zswapSecretKeys, dustSecretKey);
const privateStateProvider = levelPrivateStateProvider({
  privateStateStoreName: 'proofperks-preprod-private-state',
  signingKeyStoreName: 'proofperks-preprod-signing-keys',
  privateStoragePasswordProvider: () => privateStatePassword,
  accountId: walletSeed,
});

const contractRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'contract');
const zkConfigProvider = new NodeZkConfigProvider(path.join(contractRoot, 'src', 'managed', 'proofperks'));
const providers = {
  privateStateProvider,
  publicDataProvider: indexerPublicDataProvider(PREPROD_CONFIG.indexer, PREPROD_CONFIG.indexerWS),
  zkConfigProvider,
  proofProvider: httpClientProofProvider(PREPROD_CONFIG.proofServer, zkConfigProvider),
  walletProvider,
  midnightProvider: {
    submitTx: (tx) => wallet.submitTransaction(tx),
  },
};

const initialPrivateState = {
  issuerSecret: new Uint8Array(32),
  approvedContributorSecret: new Uint8Array(32),
  approvedContributorAnchor: new Uint8Array(32),
  approvedPoints: 0n,
  contributorAnchor: new Uint8Array(32),
  contributorSecret: new Uint8Array(32),
  contributorPoints: 0n,
  revocationTargetSecret: new Uint8Array(32),
  oldContributorAnchor: new Uint8Array(32),
  oldContributorSecret: new Uint8Array(32),
  commitmentPaths: new Map(),
};

const deployed = await deployContract(providers, {
  compiledContract: CompiledProofPerksContract,
  privateStateId: proofPerksPrivateStateKey,
  initialPrivateState,
  args: [campaignId, threshold, true, issuerPublicKey, rewardBudget],
});

console.log('ProofPerks deployed to Midnight Preprod.');
console.log(`Contract address: ${deployed.deployTxData.public.contractAddress}`);
console.log(`Deployment transaction: ${deployed.deployTxData.public.txHash}`);
console.log(`Network: ${PREPROD_CONFIG.networkId}`);
console.log(`Reward budget cap: ${rewardBudget} native-token base units`);
console.log(`Wallet seed loaded for address: ${seeds.masterSeed ? 'yes' : 'no'} (seed is never printed)`);

await wallet.stop();
