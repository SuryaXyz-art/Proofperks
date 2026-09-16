// SPDX-License-Identifier: Apache-2.0

import '@midnight-ntwrk/dapp-connector-api';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { Transaction } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { findDeployedContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledProofPerksContract, ledger, proofPerksPrivateStateKey } from '@proofperks/contract';

export const PREPROD = {
  networkId: 'preprod',
  node: 'https://rpc.preprod.midnight.network',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWs: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  proofServer: 'http://localhost:6300',
  faucet: 'https://faucet.preprod.midnight.network',
};

setNetworkId(PREPROD.networkId);

function toBytes32(value) {
  const bytes = new TextEncoder().encode(value);
  const result = new Uint8Array(32);
  result.set(bytes.slice(0, 32));
  return result;
}

function findWallet() {
  const wallets = globalThis.midnight ? Object.values(globalThis.midnight) : [];
  return wallets.find((candidate) => candidate && typeof candidate.connect === 'function' && /^4\./.test(candidate.apiVersion ?? ''));
}

export async function connectPreprodWallet() {
  const initial = findWallet();
  if (!initial) throw new Error('Midnight Lace wallet not found. Install the extension and unlock it first.');
  const connected = await initial.connect(PREPROD.networkId);
  const addresses = await connected.getUnshieldedAddress();
  return { api: connected, address: addresses?.unshieldedAddress ?? addresses };
}

function privateStateProvider() {
  const states = new Map();
  const signingKeys = new Map();
  let contractAddress;
  const requireAddress = () => {
    if (!contractAddress) throw new Error('Contract address is not set.');
    return contractAddress;
  };
  return {
    setContractAddress(address) { contractAddress = address; },
    async set(key, state) { states.set(`${requireAddress()}:${key}`, state); },
    async get(key) { return states.get(`${requireAddress()}:${key}`) ?? null; },
    async remove(key) { states.delete(`${requireAddress()}:${key}`); },
    async clear() { for (const key of states.keys()) if (key.startsWith(`${requireAddress()}:`)) states.delete(key); },
    async setSigningKey(address, key) { signingKeys.set(address, key); },
    async getSigningKey(address) { return signingKeys.get(address) ?? null; },
    async removeSigningKey(address) { signingKeys.delete(address); },
    async clearSigningKeys() { signingKeys.clear(); },
  };
}

async function createProviders(wallet, privateState) {
  const config = await wallet.api.getConfiguration().catch(() => PREPROD);
  const addresses = await wallet.api.getShieldedAddresses();
  const zkConfigProvider = new FetchZkConfigProvider('/zkconfig', fetch.bind(window));
  return {
    privateStateProvider: privateState,
    publicDataProvider: indexerPublicDataProvider(config.indexerUri ?? PREPROD.indexer, config.indexerWsUri ?? PREPROD.indexerWs),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proverServerUri ?? PREPROD.proofServer, zkConfigProvider),
    walletProvider: {
      getCoinPublicKey: () => addresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => addresses.shieldedEncryptionPublicKey,
      async balanceTx(tx) {
        const response = await wallet.api.balanceUnsealedTransaction(toHex(tx.serialize()));
        return Transaction.deserialize('signature', 'proof', 'binding', fromHex(response.tx));
      },
    },
    midnightProvider: {
      async submitTx(tx) {
        await wallet.api.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      },
    },
  };
}

export async function createProofPerksClient({ wallet, contractAddress, issuerPublicKey, issuerSecret, contributorAnchor, contributorSecret, points }) {
  const stableAnchor = contributorAnchor || contributorSecret;
  const privateState = privateStateProvider();
  const providers = await createProviders(wallet, privateState);
  privateState.setContractAddress(contractAddress);
  await privateState.set(proofPerksPrivateStateKey, {
    issuerSecret: toBytes32(issuerSecret),
    approvedContributorSecret: toBytes32(contributorSecret),
    approvedContributorAnchor: toBytes32(stableAnchor),
    approvedPoints: BigInt(points),
    contributorAnchor: toBytes32(stableAnchor),
    contributorSecret: toBytes32(contributorSecret),
    contributorPoints: BigInt(points),
    revocationTargetSecret: toBytes32(contributorSecret),
    oldContributorAnchor: toBytes32(stableAnchor),
    oldContributorSecret: toBytes32(contributorSecret),
    commitmentPaths: new Map(),
  });
  const deployed = await findDeployedContract(providers, {
    contractAddress,
    compiledContract: CompiledProofPerksContract,
    privateStateId: proofPerksPrivateStateKey,
    initialPrivateState: await privateState.get(proofPerksPrivateStateKey),
  });
  return {
    async approveContribution() {
      // callTx is balanced and submitted through the connected wallet provider.
      // issuerPublicKey is deployment configuration, never a hardcoded signing key.
      void issuerPublicKey;
      const tx = await deployed.callTx.approve_contribution();
      return { txHash: tx.public.txHash, deployed };
    },
    async revokeContribution() {
      // The target secret remains in local private state while the connected
      // issuer wallet signs the revocation transaction.
      const tx = await deployed.callTx.revoke_contribution();
      return { txHash: tx.public.txHash, deployed };
    },
  };
}

export async function createProofPerksReissueClient({
  wallet,
  contractAddress,
  issuerPublicKey,
  issuerSecret,
  contributorAnchor,
  oldContributorSecret,
  newContributorSecret,
  newPoints,
}) {
  const privateState = privateStateProvider();
  const providers = await createProviders(wallet, privateState);
  privateState.setContractAddress(contractAddress);
  await privateState.set(proofPerksPrivateStateKey, {
    issuerSecret: toBytes32(issuerSecret),
    approvedContributorSecret: new Uint8Array(32),
    approvedContributorAnchor: toBytes32(contributorAnchor),
    approvedPoints: 0n,
    contributorAnchor: toBytes32(contributorAnchor),
    contributorSecret: toBytes32(newContributorSecret),
    contributorPoints: BigInt(newPoints),
    revocationTargetSecret: toBytes32(oldContributorSecret),
    oldContributorAnchor: toBytes32(contributorAnchor),
    oldContributorSecret: toBytes32(oldContributorSecret),
    commitmentPaths: new Map(),
  });
  const deployed = await findDeployedContract(providers, {
    contractAddress,
    compiledContract: CompiledProofPerksContract,
    privateStateId: proofPerksPrivateStateKey,
    initialPrivateState: await privateState.get(proofPerksPrivateStateKey),
  });
  return {
    async reissueContribution() {
      void issuerPublicKey;
      const tx = await deployed.callTx.reissue_contribution();
      return { txHash: tx.public.txHash, deployed };
    },
  };
}

// Reads only public ledger state. The dashboard never needs a private-state
// lookup to render campaign aggregates, so contributor PII cannot be fetched
// from or written to browser storage by this helper.
export async function readCampaignDashboard({ wallet, contractAddress }) {
  if (!wallet) throw new Error('Connect the organizer wallet first.');
  if (!contractAddress) throw new Error('Enter the deployed Preprod contract address.');

  const privateState = privateStateProvider();
  privateState.setContractAddress(contractAddress);
  const providers = await createProviders(wallet, privateState);
  const publicStates = await getPublicStates(providers.publicDataProvider, contractAddress);
  const publicLedger = ledger(publicStates.contractState);
  const root = publicLedger.approvedCommitments.root();

  return {
    campaign: publicLedger.campaign,
    approvedCommitmentCount: Number(publicLedger.approvedCommitments.firstFree()),
    commitmentsRoot: root
      ? `0x${root.field.toString(16).padStart(64, '0')}`
      : '0x' + '0'.repeat(64),
    claimCount: Number(publicLedger.usedNullifiers.size()),
    rewardAmount: publicLedger.rewardAmount.toString(),
    remainingBudget: publicLedger.rewardBudget.toString(),
  };
}
