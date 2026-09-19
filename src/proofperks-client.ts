// SPDX-License-Identifier: Apache-2.0

import {
  CREDENTIAL_VERSION,
  bytes32FromHex,
  deriveContributionCommitment,
} from '@proofperks/contract';

export const PROOFPERKS_CLIENT_VERSION = 'phase4-client-v1';

export const PREPROD_CLIENT_CONFIG = Object.freeze({
  networkId: 'preprod',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWs: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  proofServer: 'http://localhost:6300',
});

export type WalletConfiguration = {
  networkId: string;
  indexerUri: string;
  indexerWsUri: string;
  substrateNodeUri: string;
  proverServerUri?: string;
};

export type ClientStage =
  | 'idle'
  | 'connecting'
  | 'checking-wallet'
  | 'reading-chain'
  | 'preparing-proof'
  | 'awaiting-signature'
  | 'submitted'
  | 'confirmed'
  | 'failed';

export function validateWalletConfiguration(
  configuration: WalletConfiguration,
  expectedNetwork = PREPROD_CLIENT_CONFIG.networkId,
): void {
  if (!configuration || configuration.networkId !== expectedNetwork) {
    throw new Error(`Wrong network: wallet is on ${configuration?.networkId ?? 'unknown'}, expected ${expectedNetwork}.`);
  }
  if (!configuration.indexerUri || !configuration.indexerWsUri || !configuration.substrateNodeUri) {
    throw new Error('Wallet returned incomplete network configuration. Reconnect the wallet and try again.');
  }
}

export function validateDeploymentAddress(address: string): string {
  const value = address.trim();
  if (!value) throw new Error('A deployed ProofPerks contract address is required.');
  if (value.length < 20) throw new Error('The configured deployment address is too short to be a Midnight contract address.');
  return value;
}

export function validateArtifactManifest(manifest: unknown): void {
  const value = manifest as { schema?: number; circuits?: string[]; artifacts?: Array<{ path?: string }> } | null;
  const requiredCircuits = ['approve_contribution', 'claim_reward', 'fund_reward_pool', 'payout_reward', 'reissue_contribution', 'revoke_contribution'];
  if (!value || value.schema !== 1 || !Array.isArray(value.circuits) || !Array.isArray(value.artifacts)) {
    throw new Error('Generated artifact manifest is missing or incompatible with this client. Rebuild the contract artifacts.');
  }
  const missingCircuit = requiredCircuits.find((name) => !value.circuits?.includes(name));
  if (missingCircuit) throw new Error(`Generated artifact is missing the ${missingCircuit} circuit.`);
  const requiredKinds = ['contract/index.js', 'keys/claim_reward.prover', 'keys/claim_reward.verifier', 'zkir/claim_reward.zkir'];
  const missingArtifact = requiredKinds.find((suffix) => !value.artifacts?.some((artifact) => artifact.path?.endsWith(suffix)));
  if (missingArtifact) throw new Error(`Generated artifact manifest is missing ${missingArtifact}.`);
}

export function deriveCredentialCommitmentFromHex(input: {
  networkId: string;
  deploymentId: string;
  campaignId: bigint;
  anchor: string;
  secret: string;
  points: bigint;
}): Uint8Array {
  return deriveContributionCommitment({
    credentialVersion: CREDENTIAL_VERSION,
    networkId: bytes32FromHex(input.networkId, 'networkId'),
    deploymentId: bytes32FromHex(input.deploymentId, 'deploymentId'),
    campaignId: input.campaignId,
    anchor: bytes32FromHex(input.anchor, 'anchor'),
    secret: bytes32FromHex(input.secret, 'secret'),
    points: input.points,
  });
}

export function privateStateNamespace(input: {
  account: string;
  role: 'organizer' | 'contributor';
  network: string;
  contractAddress: string;
}): string {
  return ['proofperks', input.network, input.role, input.account, input.contractAddress].join(':');
}

export function explainClientError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  if (lower.includes('reject') || lower.includes('denied')) return 'Wallet rejected the request. No transaction was submitted.';
  if (lower.includes('disconnect') || lower.includes('not connected')) return 'Wallet disconnected. Reconnect before continuing.';
  if (lower.includes('prover') || lower.includes('zkconfig') || lower.includes('zkir')) return 'The prover is unavailable or its generated artifacts are incomplete.';
  if (lower.includes('network')) return message;
  return message;
}
