import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  issuerSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  approvedContributorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  approvedContributorAnchor(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  approvedPoints(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  contributorAnchor(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  contributorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  contributorPoints(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  revocationTargetSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  oldContributorAnchor(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  oldContributorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  findCommitmentPath(context: __compactRuntime.WitnessContext<Ledger, PS>,
                     commitment_0: Uint8Array): [PS, { leaf: Uint8Array,
                                                       path: { sibling: { field: bigint
                                                                        },
                                                               goes_left: boolean
                                                             }[]
                                                     }];
}

export type ImpureCircuits<PS> = {
  approve_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  claim_reward(context: __compactRuntime.CircuitContext<PS>,
               recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  reissue_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  revoke_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  payout_reward(context: __compactRuntime.CircuitContext<PS>,
                nullifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  fund_reward_pool(context: __compactRuntime.CircuitContext<PS>,
                   amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  approve_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  claim_reward(context: __compactRuntime.CircuitContext<PS>,
               recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  reissue_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  revoke_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  payout_reward(context: __compactRuntime.CircuitContext<PS>,
                nullifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  fund_reward_pool(context: __compactRuntime.CircuitContext<PS>,
                   amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  issuerPublicKey(secret_0: Uint8Array): Uint8Array;
  contributionCommitment(credentialVersion_0: bigint,
                         networkId_0: Uint8Array,
                         deploymentId_0: Uint8Array,
                         campaignId_0: bigint,
                         anchor_0: Uint8Array,
                         secret_0: Uint8Array,
                         points_0: bigint): Uint8Array;
  claimNullifier(credentialVersion_0: bigint,
                 networkId_0: Uint8Array,
                 deploymentId_0: Uint8Array,
                 campaignId_0: bigint,
                 secret_0: Uint8Array): Uint8Array;
  revocationNullifier(credentialVersion_0: bigint,
                      networkId_0: Uint8Array,
                      deploymentId_0: Uint8Array,
                      campaignId_0: bigint,
                      secret_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  issuerPublicKey(context: __compactRuntime.CircuitContext<PS>,
                  secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  contributionCommitment(context: __compactRuntime.CircuitContext<PS>,
                         credentialVersion_0: bigint,
                         networkId_0: Uint8Array,
                         deploymentId_0: Uint8Array,
                         campaignId_0: bigint,
                         anchor_0: Uint8Array,
                         secret_0: Uint8Array,
                         points_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  claimNullifier(context: __compactRuntime.CircuitContext<PS>,
                 credentialVersion_0: bigint,
                 networkId_0: Uint8Array,
                 deploymentId_0: Uint8Array,
                 campaignId_0: bigint,
                 secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revocationNullifier(context: __compactRuntime.CircuitContext<PS>,
                      credentialVersion_0: bigint,
                      networkId_0: Uint8Array,
                      deploymentId_0: Uint8Array,
                      campaignId_0: bigint,
                      secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  approve_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  claim_reward(context: __compactRuntime.CircuitContext<PS>,
               recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  reissue_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  revoke_contribution(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  payout_reward(context: __compactRuntime.CircuitContext<PS>,
                nullifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  fund_reward_pool(context: __compactRuntime.CircuitContext<PS>,
                   amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly campaign: { id: bigint, thresholdPoints: bigint, active: boolean };
  readonly credentialVersion: bigint;
  readonly networkId: Uint8Array;
  readonly deploymentId: Uint8Array;
  readonly issuer: Uint8Array;
  approvedCommitments: {
    isFull(): boolean;
    checkRoot(rt_0: { field: bigint }): boolean;
    root(): __compactRuntime.MerkleTreeDigest;
    firstFree(): bigint;
    pathForLeaf(index_0: bigint, leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array>;
    findPathForLeaf(leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array> | undefined
  };
  approvedCommitmentSet: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedContributorNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  revokedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly rewardBudget: bigint;
  readonly reservedRewardBudget: bigint;
  readonly rewardAmount: bigint;
  pendingRewardRecipients: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { bytes: Uint8Array };
    [Symbol.iterator](): Iterator<[Uint8Array, { bytes: Uint8Array }]>
  };
  rewardReservations: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  paidRewardNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               campaignId_0: bigint,
               thresholdPoints_0: bigint,
               active_0: boolean,
               issuerAddress_0: Uint8Array,
               initialRewardBudget_0: bigint,
               configuredNetworkId_0: Uint8Array,
               configuredDeploymentId_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
