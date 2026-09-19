// SPDX-License-Identifier: Apache-2.0

import type { MerkleTreePath, WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { Ledger } from '../managed/contract/index.js';
import { Buffer } from 'buffer';

export const proofPerksPrivateStateKey = 'proofperksPrivateState' as const;

export type ProofPerksPrivateState = {
  readonly issuerSecret: Uint8Array;
  readonly approvedContributorSecret: Uint8Array;
  readonly approvedContributorAnchor: Uint8Array;
  readonly approvedPoints: bigint;
  readonly contributorAnchor: Uint8Array;
  readonly contributorSecret: Uint8Array;
  readonly contributorPoints: bigint;
  readonly revocationTargetSecret: Uint8Array;
  readonly oldContributorAnchor: Uint8Array;
  readonly oldContributorSecret: Uint8Array;
  readonly commitmentPaths: ReadonlyMap<string, MerkleTreePath<Uint8Array>>;
};

type Context = WitnessContext<Ledger, ProofPerksPrivateState>;

const lookupPath = (state: ProofPerksPrivateState, commitment: Uint8Array): MerkleTreePath<Uint8Array> => {
  const key = Buffer.from(commitment).toString('hex');
  const path = state.commitmentPaths.get(key);
  if (!path) {
    throw new Error(`No Merkle path is available for commitment ${key}`);
  }
  return path;
};

export const witnesses = {
  issuerSecret: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.issuerSecret],
  approvedContributorSecret: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.approvedContributorSecret],
  approvedContributorAnchor: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.approvedContributorAnchor],
  approvedPoints: ({ privateState }: Context): [ProofPerksPrivateState, bigint] => [privateState, privateState.approvedPoints],
  contributorAnchor: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.contributorAnchor],
  contributorSecret: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.contributorSecret],
  contributorPoints: ({ privateState }: Context): [ProofPerksPrivateState, bigint] => [privateState, privateState.contributorPoints],
  revocationTargetSecret: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.revocationTargetSecret],
  oldContributorAnchor: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.oldContributorAnchor],
  oldContributorSecret: ({ privateState }: Context): [ProofPerksPrivateState, Uint8Array] => [privateState, privateState.oldContributorSecret],
  findCommitmentPath: ({ privateState }: Context, commitment: Uint8Array): [ProofPerksPrivateState, MerkleTreePath<Uint8Array>] => [
    privateState,
    lookupPath(privateState, commitment),
  ],
};
