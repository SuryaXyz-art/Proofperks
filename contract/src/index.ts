// SPDX-License-Identifier: Apache-2.0

import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as ManagedProofPerks from '../managed/contract/index.js';
import { witnesses } from './witnesses.js';

export * from '../managed/contract/index.js';
export * from './witnesses.js';
export * from './credentials.js';

export const deriveIssuerPublicKey = (secret: Uint8Array): Uint8Array =>
  ManagedProofPerks.pureCircuits.issuerPublicKey(secret);

export const deriveContributionCommitment = ({
  credentialVersion,
  networkId,
  deploymentId,
  campaignId,
  anchor,
  secret,
  points,
}: {
  credentialVersion: bigint;
  networkId: Uint8Array;
  deploymentId: Uint8Array;
  campaignId: bigint;
  anchor: Uint8Array;
  secret: Uint8Array;
  points: bigint;
}): Uint8Array => ManagedProofPerks.pureCircuits.contributionCommitment(
  credentialVersion,
  networkId,
  deploymentId,
  campaignId,
  anchor,
  secret,
  points,
);

export const deriveClaimNullifier = ({
  credentialVersion,
  networkId,
  deploymentId,
  campaignId,
  secret,
}: {
  credentialVersion: bigint;
  networkId: Uint8Array;
  deploymentId: Uint8Array;
  campaignId: bigint;
  secret: Uint8Array;
}): Uint8Array => ManagedProofPerks.pureCircuits.claimNullifier(
  credentialVersion,
  networkId,
  deploymentId,
  campaignId,
  secret,
);

export const CompiledProofPerksContract = CompiledContract.make(
  'ProofPerks',
  ManagedProofPerks.Contract,
).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets('../managed'),
);
