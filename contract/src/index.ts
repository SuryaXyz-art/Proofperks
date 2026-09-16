// SPDX-License-Identifier: Apache-2.0

import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as ManagedProofPerks from './managed/proofperks/contract/index.js';
import { witnesses } from './witnesses.js';

export * from './managed/proofperks/contract/index.js';
export * from './witnesses.js';

export const CompiledProofPerksContract = CompiledContract.make(
  'ProofPerks',
  ManagedProofPerks.Contract,
).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets('./managed/proofperks'),
);
