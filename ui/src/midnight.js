// SPDX-License-Identifier: Apache-2.0

import '@midnight-ntwrk/dapp-connector-api';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { Transaction } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { encodeUserAddress } from '@midnight-ntwrk/compact-runtime';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { findDeployedContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledProofPerksContract, ledger, proofPerksPrivateStateKey } from '@proofperks/contract';
import {
  CREDENTIAL_VERSION,
  bytes32FromHex,
  deriveIssuerPublicKey,
  deriveClaimNullifier,
  randomBytes32,
  uint64,
  uint128,
  validateCredentialScope,
} from '@proofperks/contract';
import {
  PREPROD_CLIENT_CONFIG,
  deriveCredentialCommitmentFromHex,
  explainClientError,
  privateStateNamespace,
  validateArtifactManifest,
  validateDeploymentAddress,
  validateWalletConfiguration,
} from '../../src/proofperks-client.ts';

export const PREPROD = {
  networkId: 'preprod',
  node: 'https://rpc.preprod.midnight.network',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWs: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  proofServer: 'http://localhost:6300',
  faucet: 'https://faucet.preprod.midnight.network',
};

setNetworkId(PREPROD.networkId);

function sameBytes(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function credentialInputs({ issuerSecret, issuerPublicKey, contributorSecret, contributorAnchor, points, networkId, deploymentId }) {
  const issuerSecretBytes = bytes32FromHex(issuerSecret, 'issuerSecret');
  const issuerPublicKeyBytes = bytes32FromHex(issuerPublicKey, 'issuerPublicKey');
  if (!sameBytes(deriveIssuerPublicKey(issuerSecretBytes), issuerPublicKeyBytes)) {
    throw new Error('issuerPublicKey does not match issuerSecret; the wallet address is not an issuer key.');
  }
  const contributorSecretBytes = bytes32FromHex(contributorSecret, 'contributorSecret');
  const anchorBytes = bytes32FromHex(contributorAnchor || contributorSecret, 'contributorAnchor');
  const scope = validateCredentialScope({
    networkId: bytes32FromHex(networkId, 'credential networkId'),
    deploymentId: bytes32FromHex(deploymentId, 'credential deploymentId'),
    campaignId: 1n,
  });
  return {
    issuerSecretBytes,
    contributorSecretBytes,
    anchorBytes,
    points: uint64(points, 'points'),
    credentialVersion: CREDENTIAL_VERSION,
    scope,
  };
}

function findWallet() {
  const wallets = globalThis.midnight ? Object.values(globalThis.midnight) : [];
  return wallets.find((candidate) => candidate && typeof candidate.connect === 'function' && /^4\./.test(candidate.apiVersion ?? ''));
}

export async function connectPreprodWallet() {
  const initial = findWallet();
  if (!initial) throw new Error('Midnight Lace wallet not found. Install the extension and unlock it first.');
  let connected;
  try {
    connected = await initial.connect(PREPROD.networkId);
  } catch (error) {
    throw new Error(explainClientError(error));
  }
  const configuration = await connected.getConfiguration();
  validateWalletConfiguration(configuration);
  const capabilities = ['getConfiguration', 'getShieldedAddresses', 'getUnshieldedAddress', 'balanceUnsealedTransaction', 'submitTransaction', 'getProvingProvider'];
  const missing = capabilities.filter((name) => typeof connected[name] !== 'function');
  if (missing.length) throw new Error(`Connected wallet is missing required capabilities: ${missing.join(', ')}.`);
  const addresses = await connected.getUnshieldedAddress();
  return { api: connected, address: addresses?.unshieldedAddress ?? addresses, configuration, capabilities };
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

async function assertBrowserArtifacts() {
  const response = await fetch('/zkconfig/manifest.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Generated artifact manifest is unavailable (${response.status}). Rebuild the UI.`);
  validateArtifactManifest(await response.json());
}

function walletRecipient(address) {
  try {
    const parsed = MidnightBech32m.parse(address).decode(UnshieldedAddress, PREPROD.networkId);
    void parsed;
    return { bytes: encodeUserAddress(address) };
  } catch (error) {
    throw new Error(`The connected wallet returned an invalid recipient address: ${explainClientError(error)}`);
  }
}

async function createProviders(wallet, privateState, { readOnly = false } = {}) {
  const config = wallet ? await wallet.api.getConfiguration() : PREPROD;
  validateWalletConfiguration({
    networkId: config.networkId,
    indexerUri: config.indexerUri ?? config.indexer,
    indexerWsUri: config.indexerWsUri ?? config.indexerWs,
    substrateNodeUri: config.substrateNodeUri ?? config.node,
    proverServerUri: config.proverServerUri ?? config.proofServer,
  });
  if (readOnly) {
    return { publicDataProvider: indexerPublicDataProvider(config.indexerUri ?? PREPROD.indexer, config.indexerWsUri ?? PREPROD.indexerWs) };
  }
  const addresses = await wallet.api.getShieldedAddresses();
  if (!config.proverServerUri && !wallet.api.getProvingProvider) throw new Error('No prover is configured. Connect a wallet with proving support or configure a proof server.');
  const zkConfigProvider = new FetchZkConfigProvider(
    new URL('/zkconfig/', window.location.origin).href,
    fetch.bind(window),
  );
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

export async function createProofPerksClient({ wallet, contractAddress, issuerPublicKey, issuerSecret, contributorAnchor, contributorSecret, points, networkId, deploymentId }) {
  validateDeploymentAddress(contractAddress);
  await assertBrowserArtifacts();
  const inputs = credentialInputs({ issuerSecret, issuerPublicKey, contributorSecret, contributorAnchor, points, networkId, deploymentId });
  if (!wallet?.api) throw new Error('Wallet is not connected.');
  const privateState = privateStateProvider();
  const providers = await createProviders(wallet, privateState);
  privateState.setContractAddress(contractAddress);
  const account = String(wallet.address ?? 'connected-wallet');
  const scopedStateKey = privateStateNamespace({ account, role: 'organizer', network: PREPROD.networkId, contractAddress });
  await privateState.set(scopedStateKey, {
    issuerSecret: inputs.issuerSecretBytes,
    approvedContributorSecret: inputs.contributorSecretBytes,
    approvedContributorAnchor: inputs.anchorBytes,
    approvedPoints: inputs.points,
    contributorAnchor: inputs.anchorBytes,
    contributorSecret: inputs.contributorSecretBytes,
    contributorPoints: inputs.points,
    revocationTargetSecret: inputs.contributorSecretBytes,
    oldContributorAnchor: inputs.anchorBytes,
    oldContributorSecret: inputs.contributorSecretBytes,
    commitmentPaths: new Map(),
  });
  const deployed = await findDeployedContract(providers, {
    contractAddress,
    compiledContract: CompiledProofPerksContract,
    privateStateId: scopedStateKey,
    initialPrivateState: await privateState.get(scopedStateKey),
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
    async fundRewardPool(amount) {
      const tx = await deployed.callTx.fund_reward_pool(uint128(amount, 'funding amount'));
      return { txHash: tx.public.txHash, deployed };
    },
  };
}

export function generateCredentialSecret() {
  return randomBytes32();
}

export function generateContributorAnchor() {
  return randomBytes32();
}

function bytesToBase64(bytes) {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

export async function exportEncryptedCredential(credential, password) {
  if (!password || password.length < 12) throw new Error('Use an explicit backup password of at least 12 characters.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const payload = new TextEncoder().encode(JSON.stringify({ version: 1, ...credential }));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, payload);
  return JSON.stringify({ format: 'proofperks-credential-backup-v1', salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)) });
}

export async function importEncryptedCredential(serialized, password) {
  if (!password) throw new Error('Enter the backup password.');
  const envelope = JSON.parse(serialized);
  if (envelope.format !== 'proofperks-credential-backup-v1') throw new Error('Unsupported credential backup format.');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: base64ToBytes(envelope.salt), iterations: 250_000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(envelope.iv) }, key, base64ToBytes(envelope.ciphertext));
    const credential = JSON.parse(new TextDecoder().decode(plaintext));
    if (credential.version !== 1 || !credential.secret || !credential.anchor || credential.points === undefined) throw new Error('Backup is missing credential fields.');
    return credential;
  } catch {
    throw new Error('Could not decrypt this backup. Check the password and use the original file.');
  }
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
  networkId,
  deploymentId,
}) {
  validateDeploymentAddress(contractAddress);
  await assertBrowserArtifacts();
  const inputs = credentialInputs({ issuerSecret, issuerPublicKey, contributorSecret: newContributorSecret, contributorAnchor, points: newPoints, networkId, deploymentId });
  const oldSecretBytes = bytes32FromHex(oldContributorSecret, 'oldContributorSecret');
  const anchorBytes = bytes32FromHex(contributorAnchor, 'contributorAnchor');
  const privateState = privateStateProvider();
  const providers = await createProviders(wallet, privateState);
  privateState.setContractAddress(contractAddress);
  const scopedStateKey = privateStateNamespace({ account: String(wallet.address ?? 'connected-wallet'), role: 'organizer', network: PREPROD.networkId, contractAddress });
  await privateState.set(scopedStateKey, {
    issuerSecret: inputs.issuerSecretBytes,
    approvedContributorSecret: new Uint8Array(32),
    approvedContributorAnchor: anchorBytes,
    approvedPoints: 0n,
    contributorAnchor: anchorBytes,
    contributorSecret: inputs.contributorSecretBytes,
    contributorPoints: inputs.points,
    revocationTargetSecret: oldSecretBytes,
    oldContributorAnchor: anchorBytes,
    oldContributorSecret: oldSecretBytes,
    commitmentPaths: new Map(),
  });
  const deployed = await findDeployedContract(providers, {
    contractAddress,
    compiledContract: CompiledProofPerksContract,
    privateStateId: scopedStateKey,
    initialPrivateState: await privateState.get(scopedStateKey),
  });
  return {
    async reissueContribution() {
      void issuerPublicKey;
      const tx = await deployed.callTx.reissue_contribution();
      return { txHash: tx.public.txHash, deployed };
    },
  };
}

export async function createContributorClient({ wallet, contractAddress, contributorAnchor, contributorSecret, points, networkId, deploymentId, campaignId = 1n }) {
  validateDeploymentAddress(contractAddress);
  if (!wallet?.api) throw new Error('Wallet is not connected.');
  await assertBrowserArtifacts();
  const secretBytes = bytes32FromHex(contributorSecret, 'contributorSecret');
  const anchorBytes = bytes32FromHex(contributorAnchor || contributorSecret, 'contributorAnchor');
  const pointsValue = uint64(points, 'points');
  const privateState = privateStateProvider();
  const providers = await createProviders(wallet, privateState);
  privateState.setContractAddress(contractAddress);
  const stateKey = privateStateNamespace({ account: String(wallet.address), role: 'contributor', network: PREPROD.networkId, contractAddress });
  const initialState = {
    issuerSecret: new Uint8Array(32),
    approvedContributorSecret: secretBytes,
    approvedContributorAnchor: anchorBytes,
    approvedPoints: pointsValue,
    contributorAnchor: anchorBytes,
    contributorSecret: secretBytes,
    contributorPoints: pointsValue,
    revocationTargetSecret: secretBytes,
    oldContributorAnchor: anchorBytes,
    oldContributorSecret: secretBytes,
    commitmentPaths: new Map(),
  };
  await privateState.set(stateKey, initialState);
  const commitment = deriveCredentialCommitmentFromHex({ networkId, deploymentId, campaignId, anchor: contributorAnchor || contributorSecret, secret: contributorSecret, points: pointsValue });
  const publicStates = await getPublicStates(providers.publicDataProvider, contractAddress);
  const publicLedger = ledger(publicStates.contractState);
  const path = publicLedger.approvedCommitments.findPathForLeaf(commitment);
  if (!path) throw new Error('This credential is not approved in the latest commitments tree.');
  await privateState.set(stateKey, { ...initialState, commitmentPaths: new Map([[toHex(commitment), path]]) });
  const deployed = await findDeployedContract(providers, {
    contractAddress,
    compiledContract: CompiledProofPerksContract,
    privateStateId: stateKey,
    initialPrivateState: await privateState.get(stateKey),
  });
  const recipientAddress = (await wallet.api.getUnshieldedAddress()).unshieldedAddress;
  return {
    commitment,
    recipientAddress,
    async claimReward() {
      const tx = await deployed.callTx.claim_reward(walletRecipient(recipientAddress));
      return { txHash: tx.public.txHash, deployed, recipientAddress };
    },
    async payoutReward(nullifier) {
      const tx = await deployed.callTx.payout_reward(nullifier);
      return { txHash: tx.public.txHash, deployed };
    },
  };
}

// Reads only public ledger state. The dashboard never needs a private-state
// lookup to render campaign aggregates, so contributor PII cannot be fetched
// from or written to browser storage by this helper.
export async function readCampaignDashboard({ wallet = null, contractAddress }) {
  validateDeploymentAddress(contractAddress);
  if (typeof window !== 'undefined') await assertBrowserArtifacts();
  const privateState = privateStateProvider();
  privateState.setContractAddress(contractAddress);
  const providers = await createProviders(wallet, privateState, { readOnly: true });
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
    reservedRewardBudget: publicLedger.reservedRewardBudget.toString(),
    pendingRewardCount: Number(publicLedger.pendingRewardRecipients.size()),
    paidRewardCount: Number(publicLedger.paidRewardNullifiers.size()),
    publicLedger,
  };
}

export async function readContributorClaimStatus({ contractAddress, contributorSecret, networkId, deploymentId, campaignId = 1n }) {
  validateDeploymentAddress(contractAddress);
  const secret = bytes32FromHex(contributorSecret, 'contributorSecret');
  const publicState = await readCampaignDashboard({ contractAddress });
  const nullifier = deriveClaimNullifier({
    credentialVersion: CREDENTIAL_VERSION,
    networkId: bytes32FromHex(networkId, 'networkId'),
    deploymentId: bytes32FromHex(deploymentId, 'deploymentId'),
    campaignId,
    secret,
  });
  const used = publicState.publicLedger.usedNullifiers.member(nullifier);
  const pending = publicState.publicLedger.pendingRewardRecipients.member(nullifier);
  const paid = publicState.publicLedger.paidRewardNullifiers.member(nullifier);
  return { claimed: used, pendingPayout: pending && !paid, paid, nullifier };
}
