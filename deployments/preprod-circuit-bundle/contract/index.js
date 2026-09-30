import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_2 = __compactRuntime.CompactTypeField;

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_4 = __compactRuntime.CompactTypeBoolean;

class _Campaign_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment()));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_2.fromValue(value_0),
      thresholdPoints: _descriptor_3.fromValue(value_0),
      active: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.id).concat(_descriptor_3.toValue(value_0.thresholdPoints).concat(_descriptor_4.toValue(value_0.active)));
  }
}

const _descriptor_5 = new _Campaign_0();

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _UserAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_7 = new _UserAddress_0();

class _MerkleTreeDigest_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      field: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.field);
  }
}

const _descriptor_8 = new _MerkleTreeDigest_0();

class _MerkleTreePathEntry_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_4.alignment());
  }
  fromValue(value_0) {
    return {
      sibling: _descriptor_8.fromValue(value_0),
      goes_left: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0.sibling).concat(_descriptor_4.toValue(value_0.goes_left));
  }
}

const _descriptor_9 = new _MerkleTreePathEntry_0();

const _descriptor_10 = new __compactRuntime.CompactTypeVector(5, _descriptor_9);

class _MerkleTreePath_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_10.alignment());
  }
  fromValue(value_0) {
    return {
      leaf: _descriptor_0.fromValue(value_0),
      path: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.leaf).concat(_descriptor_10.toValue(value_0.path));
  }
}

const _descriptor_11 = new _MerkleTreePath_0();

class _ContributorNullifierPreimage_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_0.fromValue(value_0),
      campaignId: _descriptor_2.fromValue(value_0),
      contributorAnchor: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domain).concat(_descriptor_2.toValue(value_0.campaignId).concat(_descriptor_0.toValue(value_0.contributorAnchor)));
  }
}

const _descriptor_12 = new _ContributorNullifierPreimage_0();

const _descriptor_13 = new __compactRuntime.CompactTypeBytes(6);

class _LeafPreimage_0 {
  alignment() {
    return _descriptor_13.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_13.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_13.toValue(value_0.domain_sep).concat(_descriptor_0.toValue(value_0.data));
  }
}

const _descriptor_14 = new _LeafPreimage_0();

class _NullifierPreimage_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())))));
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_0.fromValue(value_0),
      credentialVersion: _descriptor_6.fromValue(value_0),
      networkId: _descriptor_0.fromValue(value_0),
      deploymentId: _descriptor_0.fromValue(value_0),
      campaignId: _descriptor_2.fromValue(value_0),
      contributorSecret: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domain).concat(_descriptor_6.toValue(value_0.credentialVersion).concat(_descriptor_0.toValue(value_0.networkId).concat(_descriptor_0.toValue(value_0.deploymentId).concat(_descriptor_2.toValue(value_0.campaignId).concat(_descriptor_0.toValue(value_0.contributorSecret))))));
  }
}

const _descriptor_15 = new _NullifierPreimage_0();

class _RevocationPreimage_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())))));
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_0.fromValue(value_0),
      credentialVersion: _descriptor_6.fromValue(value_0),
      networkId: _descriptor_0.fromValue(value_0),
      deploymentId: _descriptor_0.fromValue(value_0),
      campaignId: _descriptor_2.fromValue(value_0),
      contributorSecret: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domain).concat(_descriptor_6.toValue(value_0.credentialVersion).concat(_descriptor_0.toValue(value_0.networkId).concat(_descriptor_0.toValue(value_0.deploymentId).concat(_descriptor_2.toValue(value_0.campaignId).concat(_descriptor_0.toValue(value_0.contributorSecret))))));
  }
}

const _descriptor_16 = new _RevocationPreimage_0();

const _descriptor_17 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _ContributionPreimage_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment())))))));
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_0.fromValue(value_0),
      credentialVersion: _descriptor_6.fromValue(value_0),
      networkId: _descriptor_0.fromValue(value_0),
      deploymentId: _descriptor_0.fromValue(value_0),
      campaignId: _descriptor_2.fromValue(value_0),
      contributorAnchor: _descriptor_0.fromValue(value_0),
      contributorSecret: _descriptor_0.fromValue(value_0),
      points: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domain).concat(_descriptor_6.toValue(value_0.credentialVersion).concat(_descriptor_0.toValue(value_0.networkId).concat(_descriptor_0.toValue(value_0.deploymentId).concat(_descriptor_2.toValue(value_0.campaignId).concat(_descriptor_0.toValue(value_0.contributorAnchor).concat(_descriptor_0.toValue(value_0.contributorSecret).concat(_descriptor_3.toValue(value_0.points))))))));
  }
}

const _descriptor_18 = new _ContributionPreimage_0();

const _descriptor_19 = new __compactRuntime.CompactTypeVector(2, _descriptor_2);

class _Either_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_4.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_20 = new _Either_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_21 = new _ContractAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_21.alignment().concat(_descriptor_7.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_4.fromValue(value_0),
      left: _descriptor_21.fromValue(value_0),
      right: _descriptor_7.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.is_left).concat(_descriptor_21.toValue(value_0.left).concat(_descriptor_7.toValue(value_0.right)));
  }
}

const _descriptor_22 = new _Either_1();

const _descriptor_23 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.issuerSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named issuerSecret');
    }
    if (typeof(witnesses_0.approvedContributorSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named approvedContributorSecret');
    }
    if (typeof(witnesses_0.approvedContributorAnchor) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named approvedContributorAnchor');
    }
    if (typeof(witnesses_0.approvedPoints) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named approvedPoints');
    }
    if (typeof(witnesses_0.contributorAnchor) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named contributorAnchor');
    }
    if (typeof(witnesses_0.contributorSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named contributorSecret');
    }
    if (typeof(witnesses_0.contributorPoints) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named contributorPoints');
    }
    if (typeof(witnesses_0.revocationTargetSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named revocationTargetSecret');
    }
    if (typeof(witnesses_0.oldContributorAnchor) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named oldContributorAnchor');
    }
    if (typeof(witnesses_0.oldContributorSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named oldContributorSecret');
    }
    if (typeof(witnesses_0.findCommitmentPath) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named findCommitmentPath');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      issuerPublicKey(context, ...args_1) {
        return { result: pureCircuits.issuerPublicKey(...args_1), context };
      },
      contributionCommitment(context, ...args_1) {
        return { result: pureCircuits.contributionCommitment(...args_1), context };
      },
      claimNullifier(context, ...args_1) {
        return { result: pureCircuits.claimNullifier(...args_1), context };
      },
      revocationNullifier(context, ...args_1) {
        return { result: pureCircuits.revocationNullifier(...args_1), context };
      },
      approve_contribution: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`approve_contribution: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('approve_contribution',
                                     'argument 1 (as invoked from Typescript)',
                                     'proofperks.compact line 233 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._approve_contribution_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      claim_reward: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`claim_reward: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const recipient_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claim_reward',
                                     'argument 1 (as invoked from Typescript)',
                                     'proofperks.compact line 259 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(recipient_0) === 'object' && recipient_0.bytes.buffer instanceof ArrayBuffer && recipient_0.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.bytes.length === 32)) {
          __compactRuntime.typeError('claim_reward',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'proofperks.compact line 259 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     recipient_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_7.toValue(recipient_0),
            alignment: _descriptor_7.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._claim_reward_0(context,
                                              partialProofData,
                                              recipient_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      reissue_contribution: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`reissue_contribution: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('reissue_contribution',
                                     'argument 1 (as invoked from Typescript)',
                                     'proofperks.compact line 336 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._reissue_contribution_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revoke_contribution: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`revoke_contribution: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revoke_contribution',
                                     'argument 1 (as invoked from Typescript)',
                                     'proofperks.compact line 403 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revoke_contribution_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      payout_reward: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`payout_reward: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const nullifier_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('payout_reward',
                                     'argument 1 (as invoked from Typescript)',
                                     'proofperks.compact line 423 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(nullifier_0.buffer instanceof ArrayBuffer && nullifier_0.BYTES_PER_ELEMENT === 1 && nullifier_0.length === 32)) {
          __compactRuntime.typeError('payout_reward',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'proofperks.compact line 423 char 1',
                                     'Bytes<32>',
                                     nullifier_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(nullifier_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._payout_reward_0(context,
                                               partialProofData,
                                               nullifier_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      fund_reward_pool: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`fund_reward_pool: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const amount_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('fund_reward_pool',
                                     'argument 1 (as invoked from Typescript)',
                                     'proofperks.compact line 446 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('fund_reward_pool',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'proofperks.compact line 446 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(amount_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._fund_reward_pool_0(context,
                                                  partialProofData,
                                                  amount_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      approve_contribution: this.circuits.approve_contribution,
      claim_reward: this.circuits.claim_reward,
      reissue_contribution: this.circuits.reissue_contribution,
      revoke_contribution: this.circuits.revoke_contribution,
      payout_reward: this.circuits.payout_reward,
      fund_reward_pool: this.circuits.fund_reward_pool
    };
    this.provableCircuits = {
      approve_contribution: this.circuits.approve_contribution,
      claim_reward: this.circuits.claim_reward,
      reissue_contribution: this.circuits.reissue_contribution,
      revoke_contribution: this.circuits.revoke_contribution,
      payout_reward: this.circuits.payout_reward,
      fund_reward_pool: this.circuits.fund_reward_pool
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 8) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 8 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const campaignId_0 = args_0[1];
    const thresholdPoints_0 = args_0[2];
    const active_0 = args_0[3];
    const issuerAddress_0 = args_0[4];
    const initialRewardBudget_0 = args_0[5];
    const configuredNetworkId_0 = args_0[6];
    const configuredDeploymentId_0 = args_0[7];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(typeof(campaignId_0) === 'bigint' && campaignId_0 >= 0 && campaignId_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Field',
                                 campaignId_0)
    }
    if (!(typeof(thresholdPoints_0) === 'bigint' && thresholdPoints_0 >= 0n && thresholdPoints_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Uint<0..18446744073709551616>',
                                 thresholdPoints_0)
    }
    if (!(typeof(active_0) === 'boolean')) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Boolean',
                                 active_0)
    }
    if (!(issuerAddress_0.buffer instanceof ArrayBuffer && issuerAddress_0.BYTES_PER_ELEMENT === 1 && issuerAddress_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 4 (argument 5 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Bytes<32>',
                                 issuerAddress_0)
    }
    if (!(typeof(initialRewardBudget_0) === 'bigint' && initialRewardBudget_0 >= 0n && initialRewardBudget_0 <= 340282366920938463463374607431768211455n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 5 (argument 6 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Uint<0..340282366920938463463374607431768211456>',
                                 initialRewardBudget_0)
    }
    if (!(configuredNetworkId_0.buffer instanceof ArrayBuffer && configuredNetworkId_0.BYTES_PER_ELEMENT === 1 && configuredNetworkId_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 6 (argument 7 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Bytes<32>',
                                 configuredNetworkId_0)
    }
    if (!(configuredDeploymentId_0.buffer instanceof ArrayBuffer && configuredDeploymentId_0.BYTES_PER_ELEMENT === 1 && configuredDeploymentId_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 7 (argument 8 as invoked from Typescript)',
                                 'proofperks.compact line 130 char 1',
                                 'Bytes<32>',
                                 configuredDeploymentId_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    let stateValue_2 = __compactRuntime.StateValue.newArray();
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_2);
    let stateValue_1 = __compactRuntime.StateValue.newArray();
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_1);
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('approve_contribution', new __compactRuntime.ContractOperation());
    state_0.setOperation('claim_reward', new __compactRuntime.ContractOperation());
    state_0.setOperation('reissue_contribution', new __compactRuntime.ContractOperation());
    state_0.setOperation('revoke_contribution', new __compactRuntime.ContractOperation());
    state_0.setOperation('payout_reward', new __compactRuntime.ContractOperation());
    state_0.setOperation('fund_reward_pool', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(0n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(0n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue({ id: 0n, thresholdPoints: 0n, active: false }),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(0n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(1n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(2n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(3n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(4n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newBoundedMerkleTree(
                                                                       new __compactRuntime.StateBoundedMerkleTree(5)
                                                                     )).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                        alignment: _descriptor_3.alignment() }))
                                                          .encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(5n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(6n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(7n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(8n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(9n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(10n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(11n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(12n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(13n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(14n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.assert(thresholdPoints_0 > 0n, 'threshold must be positive');
    __compactRuntime.assert(initialRewardBudget_0 >= 1000n,
                            'budget must cover one pilot reward');
    const tmp_0 = { id: campaignId_0,
                    thresholdPoints: thresholdPoints_0,
                    active: active_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(0n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(0n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(3n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(issuerAddress_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(0n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_1),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(1n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(configuredNetworkId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(2n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(configuredDeploymentId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = 1000n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(11n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_2),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(9n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(initialRewardBudget_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(10n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_3),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _merkleTreePathRoot_0(path_0) {
    return { field:
               this._folder_0((...args_0) =>
                                this._merkleTreePathEntryRoot_0(...args_0),
                              this._degradeToTransient_0(this._persistentHash_5({ domain_sep:
                                                                                    new Uint8Array([109, 100, 110, 58, 108, 104]),
                                                                                  data:
                                                                                    path_0.leaf })),
                              path_0.path) };
  }
  _merkleTreePathEntryRoot_0(recursiveDigest_0, entry_0) {
    const left_0 = entry_0.goes_left ? recursiveDigest_0 : entry_0.sibling.field;
    const right_0 = entry_0.goes_left ?
                    entry_0.sibling.field :
                    recursiveDigest_0;
    return this._transientHash_0([left_0, right_0]);
  }
  _nativeToken_0() {
    return new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  _sendUnshielded_0(context, partialProofData, color_0, amount_0, recipient_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(7n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(tmp_0),
                                                                                              alignment: _descriptor_20.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(amount_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const tmp_1 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(8n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_20.toValue(tmp_1),
                                                                                                alignment: _descriptor_20.alignment() },
                                                                                              { value: _descriptor_22.toValue(recipient_0),
                                                                                                alignment: _descriptor_22.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(amount_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_0(recipient_0.left.bytes,
                      _descriptor_21.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_23.toValue(0n),
                                                                                                             alignment: _descriptor_23.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_23.toValue(6n),
                                                                    alignment: _descriptor_23.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(tmp_2),
                                                                                                alignment: _descriptor_20.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(amount_0),
                                                                                                alignment: _descriptor_1.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return [];
  }
  _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(6n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(tmp_0),
                                                                                              alignment: _descriptor_20.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(amount_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _unshieldedBalanceLt_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_23.toValue(5n),
                                                                                                 alignment: _descriptor_23.alignment() } }] } },
                                                                      { dup: { n: 0 } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(tmp_0),
                                                                                                                             alignment: _descriptor_20.alignment() }).encode() } },
                                                                      'member',
                                                                      { branch: { skip: 3 } },
                                                                      'pop',
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                      { jmp: { skip: 1 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_20.toValue(tmp_0),
                                                                                                 alignment: _descriptor_20.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(amount_0),
                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _unshieldedBalanceGte_0(context, partialProofData, color_0, amount_0) {
    return !this._unshieldedBalanceLt_0(context,
                                        partialProofData,
                                        color_0,
                                        amount_0);
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_19, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_17, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_18, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_15, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_16, value_0);
    return result_0;
  }
  _persistentHash_4(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_12, value_0);
    return result_0;
  }
  _persistentHash_5(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_14, value_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
    return result_0;
  }
  _issuerSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.issuerSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('issuerSecret',
                                 'return value',
                                 'proofperks.compact line 68 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _approvedContributorSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.approvedContributorSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('approvedContributorSecret',
                                 'return value',
                                 'proofperks.compact line 69 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _approvedContributorAnchor_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.approvedContributorAnchor(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('approvedContributorAnchor',
                                 'return value',
                                 'proofperks.compact line 70 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _approvedPoints_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.approvedPoints(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('approvedPoints',
                                 'return value',
                                 'proofperks.compact line 71 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _contributorAnchor_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.contributorAnchor(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('contributorAnchor',
                                 'return value',
                                 'proofperks.compact line 72 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _contributorSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.contributorSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('contributorSecret',
                                 'return value',
                                 'proofperks.compact line 73 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _contributorPoints_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.contributorPoints(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('contributorPoints',
                                 'return value',
                                 'proofperks.compact line 74 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _revocationTargetSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.revocationTargetSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('revocationTargetSecret',
                                 'return value',
                                 'proofperks.compact line 75 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _oldContributorAnchor_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.oldContributorAnchor(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('oldContributorAnchor',
                                 'return value',
                                 'proofperks.compact line 76 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _oldContributorSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.oldContributorSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('oldContributorSecret',
                                 'return value',
                                 'proofperks.compact line 77 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _findCommitmentPath_0(context, partialProofData, commitment_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.findCommitmentPath(witnessContext_0,
                                                                             commitment_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.leaf.buffer instanceof ArrayBuffer && result_0.leaf.BYTES_PER_ELEMENT === 1 && result_0.leaf.length === 32 && Array.isArray(result_0.path) && result_0.path.length === 5 && result_0.path.every((t) => typeof(t) === 'object' && typeof(t.sibling) === 'object' && typeof(t.sibling.field) === 'bigint' && t.sibling.field >= 0 && t.sibling.field <= __compactRuntime.MAX_FIELD && typeof(t.goes_left) === 'boolean'))) {
      __compactRuntime.typeError('findCommitmentPath',
                                 'return value',
                                 'proofperks.compact line 82 char 1',
                                 'struct MerkleTreePath<leaf: Bytes<32>, path: Vector<5, struct MerkleTreePathEntry<sibling: struct MerkleTreeDigest<field: Field>, goes_left: Boolean>>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_11.toValue(result_0),
      alignment: _descriptor_11.alignment()
    });
    return result_0;
  }
  _issuerPublicKey_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([112, 114, 111, 111, 102, 112, 101, 114, 107, 115, 58, 105, 115, 115, 117, 101, 114, 45, 107, 101, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   secret_0]);
  }
  _contributionCommitment_0(credentialVersion_0,
                            networkId_0,
                            deploymentId_0,
                            campaignId_0,
                            anchor_0,
                            secret_0,
                            points_0)
  {
    return this._persistentHash_1({ domain:
                                      new Uint8Array([112, 114, 111, 111, 102, 112, 101, 114, 107, 115, 58, 99, 111, 110, 116, 114, 105, 98, 117, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    credentialVersion: credentialVersion_0,
                                    networkId: networkId_0,
                                    deploymentId: deploymentId_0,
                                    campaignId: campaignId_0,
                                    contributorAnchor: anchor_0,
                                    contributorSecret: secret_0,
                                    points: points_0 });
  }
  _claimNullifier_0(credentialVersion_0,
                    networkId_0,
                    deploymentId_0,
                    campaignId_0,
                    secret_0)
  {
    return this._persistentHash_2({ domain:
                                      new Uint8Array([112, 114, 111, 111, 102, 112, 101, 114, 107, 115, 58, 110, 117, 108, 108, 105, 102, 105, 101, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    credentialVersion: credentialVersion_0,
                                    networkId: networkId_0,
                                    deploymentId: deploymentId_0,
                                    campaignId: campaignId_0,
                                    contributorSecret: secret_0 });
  }
  _contributorNullifier_0(campaignId_0, anchor_0) {
    return this._persistentHash_4({ domain:
                                      new Uint8Array([112, 114, 111, 111, 102, 112, 101, 114, 107, 115, 58, 99, 111, 110, 116, 114, 105, 98, 117, 116, 111, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    campaignId: campaignId_0,
                                    contributorAnchor: anchor_0 });
  }
  _revocationNullifier_0(credentialVersion_0,
                         networkId_0,
                         deploymentId_0,
                         campaignId_0,
                         secret_0)
  {
    return this._persistentHash_3({ domain:
                                      new Uint8Array([112, 114, 111, 111, 102, 112, 101, 114, 107, 115, 58, 114, 101, 118, 111, 99, 97, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    credentialVersion: credentialVersion_0,
                                    networkId: networkId_0,
                                    deploymentId: deploymentId_0,
                                    campaignId: campaignId_0,
                                    contributorSecret: secret_0 });
  }
  _approve_contribution_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_1(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(1n),
                                                                                                                                alignment: _descriptor_23.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(3n),
                                                                                                                                alignment: _descriptor_23.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._issuerPublicKey_0(this._issuerSecret_0(context,
                                                                                       partialProofData))),
                            'caller is not the issuer');
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value).active,
                            'campaign is inactive');
    const commitment_0 = this._contributionCommitment_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(0n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value),
                                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value),
                                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(2n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value),
                                                        _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(0n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(0n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value).id,
                                                        this._approvedContributorAnchor_0(context,
                                                                                          partialProofData),
                                                        this._approvedContributorSecret_0(context,
                                                                                          partialProofData),
                                                        this._approvedPoints_0(context,
                                                                               partialProofData));
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(5n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitment_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'contribution already approved');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(4n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(32n),
                                                                                                                                               alignment: _descriptor_3.alignment() }).encode() } },
                                                                                        'lt',
                                                                                        'neg',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'commitment tree is full (32 approvals maximum)');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(5n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(4n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(0n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.leafHash(
                                                                                              { value: _descriptor_0.toValue(commitment_0),
                                                                                                alignment: _descriptor_0.alignment() }
                                                                                            )).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { addi: { immediate: 1 } },
                                       { ins: { cached: true, n: 3 } }]);
    return [];
  }
  _claim_reward_0(context, partialProofData, recipient_0) {
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value).active,
                            'campaign is inactive');
    const secret_0 = this._contributorSecret_0(context, partialProofData);
    const anchor_0 = this._contributorAnchor_0(context, partialProofData);
    const points_0 = this._contributorPoints_0(context, partialProofData);
    const commitment_0 = this._contributionCommitment_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(0n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value),
                                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value),
                                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(2n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value),
                                                        _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(0n),
                                                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_23.toValue(0n),
                                                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value).id,
                                                        anchor_0,
                                                        secret_0,
                                                        points_0);
    const path_0 = this._findCommitmentPath_0(context,
                                              partialProofData,
                                              commitment_0);
    __compactRuntime.assert(this._equal_2(path_0.leaf, commitment_0),
                            'path is not for this commitment');
    let tmp_0;
    __compactRuntime.assert((tmp_0 = this._merkleTreePathRoot_0(path_0),
                             _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(4n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(0n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        'root',
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                                                                               alignment: _descriptor_8.alignment() }).encode() } },
                                                                                        'eq',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value)),
                            'contribution commitment is not approved');
    __compactRuntime.assert(points_0
                            >=
                            _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value).thresholdPoints,
                            'threshold not met');
    const nullifier_0 = this._claimNullifier_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                         partialProofData,
                                                                                                         [
                                                                                                          { dup: { n: 0 } },
                                                                                                          { idx: { cached: false,
                                                                                                                   pushPath: false,
                                                                                                                   path: [
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(0n),
                                                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                                                          { popeq: { cached: false,
                                                                                                                     result: undefined } }]).value),
                                               _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                         partialProofData,
                                                                                                         [
                                                                                                          { dup: { n: 0 } },
                                                                                                          { idx: { cached: false,
                                                                                                                   pushPath: false,
                                                                                                                   path: [
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                                                          { popeq: { cached: false,
                                                                                                                     result: undefined } }]).value),
                                               _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                         partialProofData,
                                                                                                         [
                                                                                                          { dup: { n: 0 } },
                                                                                                          { idx: { cached: false,
                                                                                                                   pushPath: false,
                                                                                                                   path: [
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(2n),
                                                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                                                          { popeq: { cached: false,
                                                                                                                     result: undefined } }]).value),
                                               _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                         partialProofData,
                                                                                                         [
                                                                                                          { dup: { n: 0 } },
                                                                                                          { idx: { cached: false,
                                                                                                                   pushPath: false,
                                                                                                                   path: [
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(0n),
                                                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                                                          { tag: 'value',
                                                                                                                            value: { value: _descriptor_23.toValue(0n),
                                                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                                                          { popeq: { cached: false,
                                                                                                                     result: undefined } }]).value).id,
                                               secret_0);
    const contributorMarker_0 = this._contributorNullifier_0(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                       partialProofData,
                                                                                                                       [
                                                                                                                        { dup: { n: 0 } },
                                                                                                                        { idx: { cached: false,
                                                                                                                                 pushPath: false,
                                                                                                                                 path: [
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                                                        { popeq: { cached: false,
                                                                                                                                   result: undefined } }]).value).id,
                                                             anchor_0);
    let tmp_1;
    __compactRuntime.assert(!(tmp_1 = this._revocationNullifier_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(2n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value).id,
                                                                  secret_0),
                              _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_23.toValue(8n),
                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value)),
                            'credential revoked');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(6n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'reward already claimed');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(7n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(contributorMarker_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'contributor already claimed');
    __compactRuntime.assert(this._unshieldedBalanceGte_0(context,
                                                         partialProofData,
                                                         this._nativeToken_0(),
                                                         ((t1) => {
                                                           if (t1 > 340282366920938463463374607431768211455n) {
                                                             throw new __compactRuntime.CompactError('proofperks.compact line 315 char 41: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                                                           }
                                                           return t1;
                                                         })(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                      partialProofData,
                                                                                                                      [
                                                                                                                       { dup: { n: 0 } },
                                                                                                                       { idx: { cached: false,
                                                                                                                                pushPath: false,
                                                                                                                                path: [
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_23.toValue(10n),
                                                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                                                       { popeq: { cached: false,
                                                                                                                                  result: undefined } }]).value)
                                                            +
                                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                      partialProofData,
                                                                                                                      [
                                                                                                                       { dup: { n: 0 } },
                                                                                                                       { idx: { cached: false,
                                                                                                                                pushPath: false,
                                                                                                                                path: [
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_23.toValue(11n),
                                                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                                                       { popeq: { cached: false,
                                                                                                                                  result: undefined } }]).value))),
                            'insufficient unreserved reward balance');
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_23.toValue(1n),
                                                                                                                         alignment: _descriptor_23.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_23.toValue(9n),
                                                                                                                         alignment: _descriptor_23.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0
                             >=
                             _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(10n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value)
                             +
                             _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(11n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value)),
                            'reward budget exhausted');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(6n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(7n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(contributorMarker_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(12n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(recipient_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_2 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_23.toValue(11n),
                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(13n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_2),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_3 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('proofperks.compact line 327 char 26: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_23.toValue(1n),
                                                                                                           alignment: _descriptor_23.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_23.toValue(10n),
                                                                                                           alignment: _descriptor_23.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     +
                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_23.toValue(1n),
                                                                                                           alignment: _descriptor_23.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_23.toValue(11n),
                                                                                                           alignment: _descriptor_23.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(10n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_3),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return nullifier_0;
  }
  _reissue_contribution_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_3(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(1n),
                                                                                                                                alignment: _descriptor_23.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(3n),
                                                                                                                                alignment: _descriptor_23.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._issuerPublicKey_0(this._issuerSecret_0(context,
                                                                                       partialProofData))),
                            'caller is not the issuer');
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(0n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value).active,
                            'campaign is inactive');
    const oldAnchor_0 = this._oldContributorAnchor_0(context, partialProofData);
    const oldSecret_0 = this._oldContributorSecret_0(context, partialProofData);
    const newAnchor_0 = this._contributorAnchor_0(context, partialProofData);
    const newSecret_0 = this._contributorSecret_0(context, partialProofData);
    const newPoints_0 = this._contributorPoints_0(context, partialProofData);
    __compactRuntime.assert(this._equal_4(oldAnchor_0, newAnchor_0),
                            'reissue anchor mismatch');
    let tmp_0;
    __compactRuntime.assert(!(tmp_0 = this._revocationNullifier_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(2n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                        alignment: _descriptor_23.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value).id,
                                                                  oldSecret_0),
                              _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_23.toValue(8n),
                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value)),
                            'old credential already revoked');
    const tmp_1 = this._revocationNullifier_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 0 } },
                                                                                                         { idx: { cached: false,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(0n),
                                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                                         { popeq: { cached: false,
                                                                                                                    result: undefined } }]).value),
                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 0 } },
                                                                                                         { idx: { cached: false,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                                         { popeq: { cached: false,
                                                                                                                    result: undefined } }]).value),
                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 0 } },
                                                                                                         { idx: { cached: false,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(2n),
                                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                                         { popeq: { cached: false,
                                                                                                                    result: undefined } }]).value),
                                              _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 0 } },
                                                                                                         { idx: { cached: false,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(0n),
                                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_23.toValue(0n),
                                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                                         { popeq: { cached: false,
                                                                                                                    result: undefined } }]).value).id,
                                              oldSecret_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(8n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    let tmp_2;
    __compactRuntime.assert(!(tmp_2 = this._contributionCommitment_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                               partialProofData,
                                                                                                                               [
                                                                                                                                { dup: { n: 0 } },
                                                                                                                                { idx: { cached: false,
                                                                                                                                         pushPath: false,
                                                                                                                                         path: [
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } },
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } }] } },
                                                                                                                                { popeq: { cached: false,
                                                                                                                                           result: undefined } }]).value),
                                                                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                               partialProofData,
                                                                                                                               [
                                                                                                                                { dup: { n: 0 } },
                                                                                                                                { idx: { cached: false,
                                                                                                                                         pushPath: false,
                                                                                                                                         path: [
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } },
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } }] } },
                                                                                                                                { popeq: { cached: false,
                                                                                                                                           result: undefined } }]).value),
                                                                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                               partialProofData,
                                                                                                                               [
                                                                                                                                { dup: { n: 0 } },
                                                                                                                                { idx: { cached: false,
                                                                                                                                         pushPath: false,
                                                                                                                                         path: [
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(1n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } },
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(2n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } }] } },
                                                                                                                                { popeq: { cached: false,
                                                                                                                                           result: undefined } }]).value),
                                                                     _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                               partialProofData,
                                                                                                                               [
                                                                                                                                { dup: { n: 0 } },
                                                                                                                                { idx: { cached: false,
                                                                                                                                         pushPath: false,
                                                                                                                                         path: [
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } },
                                                                                                                                                { tag: 'value',
                                                                                                                                                  value: { value: _descriptor_23.toValue(0n),
                                                                                                                                                           alignment: _descriptor_23.alignment() } }] } },
                                                                                                                                { popeq: { cached: false,
                                                                                                                                           result: undefined } }]).value).id,
                                                                     newAnchor_0,
                                                                     newSecret_0,
                                                                     newPoints_0),
                              _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_23.toValue(1n),
                                                                                                                    alignment: _descriptor_23.alignment() } },
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_23.toValue(5n),
                                                                                                                    alignment: _descriptor_23.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value)),
                            'replacement contribution already approved');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(4n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(32n),
                                                                                                                                               alignment: _descriptor_3.alignment() }).encode() } },
                                                                                        'lt',
                                                                                        'neg',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'commitment tree is full (32 approvals maximum)');
    const tmp_3 = this._contributionCommitment_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(2n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value).id,
                                                 newAnchor_0,
                                                 newSecret_0,
                                                 newPoints_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(5n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_4 = this._contributionCommitment_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(2n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value).id,
                                                 newAnchor_0,
                                                 newSecret_0,
                                                 newPoints_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(4n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(0n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.leafHash(
                                                                                              { value: _descriptor_0.toValue(tmp_4),
                                                                                                alignment: _descriptor_0.alignment() }
                                                                                            )).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { addi: { immediate: 1 } },
                                       { ins: { cached: true, n: 3 } }]);
    return [];
  }
  _revoke_contribution_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_5(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(1n),
                                                                                                                                alignment: _descriptor_23.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(3n),
                                                                                                                                alignment: _descriptor_23.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._issuerPublicKey_0(this._issuerSecret_0(context,
                                                                                       partialProofData))),
                            'caller is not the issuer');
    const marker_0 = this._revocationNullifier_0(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(1n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(2n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_23.toValue(0n),
                                                                                                                                       alignment: _descriptor_23.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value).id,
                                                 this._revocationTargetSecret_0(context,
                                                                                partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(8n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(marker_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _payout_reward_0(context, partialProofData, nullifier_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(1n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(6n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'claim not verified');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(14n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'reward already paid');
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(1n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(12n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'claim recipient missing');
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(1n),
                                                                                                                  alignment: _descriptor_23.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_23.toValue(13n),
                                                                                                                  alignment: _descriptor_23.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'reward reservation missing');
    const recipient_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_23.toValue(1n),
                                                                                                              alignment: _descriptor_23.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_23.toValue(12n),
                                                                                                              alignment: _descriptor_23.alignment() } }] } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_0.toValue(nullifier_0),
                                                                                                              alignment: _descriptor_0.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value);
    const reservedAmount_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_23.toValue(13n),
                                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_0.toValue(nullifier_0),
                                                                                                                   alignment: _descriptor_0.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value);
    this._sendUnshielded_0(context,
                           partialProofData,
                           this._nativeToken_0(),
                           reservedAmount_0,
                           this._right_0(recipient_0));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(14n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(12n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(13n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    let t_0;
    const tmp_0 = (t_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_23.toValue(1n),
                                                                                                               alignment: _descriptor_23.alignment() } },
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_23.toValue(10n),
                                                                                                               alignment: _descriptor_23.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                   (__compactRuntime.assert(t_0 >= reservedAmount_0,
                                            'result of subtraction would be negative'),
                    t_0 - reservedAmount_0));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(10n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_1;
    const tmp_1 = (t_1 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_23.toValue(1n),
                                                                                                               alignment: _descriptor_23.alignment() } },
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_23.toValue(9n),
                                                                                                               alignment: _descriptor_23.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                   (__compactRuntime.assert(t_1 >= reservedAmount_0,
                                            'result of subtraction would be negative'),
                    t_1 - reservedAmount_0));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_23.toValue(1n),
                                                                  alignment: _descriptor_23.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(9n),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _fund_reward_pool_0(context, partialProofData, amount_0) {
    __compactRuntime.assert(this._equal_6(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(1n),
                                                                                                                                alignment: _descriptor_23.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_23.toValue(3n),
                                                                                                                                alignment: _descriptor_23.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._issuerPublicKey_0(this._issuerSecret_0(context,
                                                                                       partialProofData))),
                            'caller is not the issuer');
    __compactRuntime.assert(amount_0 > 0n, 'funding amount must be positive');
    this._receiveUnshielded_0(context,
                              partialProofData,
                              this._nativeToken_0(),
                              amount_0);
    return [];
  }
  _folder_0(f, x, a0) {
    for (let i = 0; i < 5; i++) { x = f(x, a0[i]); }
    return x;
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get campaign() {
      return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(0n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(0n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get credentialVersion() {
      return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(0n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get networkId() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get deploymentId() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(2n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get issuer() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(3n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    approvedCommitments: {
      isFull(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isFull: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(4n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(32n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'lt',
                                                                          'neg',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      checkRoot(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`checkRoot: expected 1 argument, received ${args_0.length}`);
        }
        const rt_0 = args_0[0];
        if (!(typeof(rt_0) === 'object' && typeof(rt_0.field) === 'bigint' && rt_0.field >= 0 && rt_0.field <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('checkRoot',
                                     'argument 1',
                                     'proofperks.compact line 101 char 1',
                                     'struct MerkleTreeDigest<field: Field>',
                                     rt_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(4n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(0n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'root',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(rt_0),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      root(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`root: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return ((result) => result             ? __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(result)             : undefined)(self_0.asArray()[0].asBoundedMerkleTree().rehash().root()?.value);
      },
      firstFree(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`first_free: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return __compactRuntime.CompactTypeField.fromValue(self_0.asArray()[1].asCell().value);
      },
      pathForLeaf(...args_0) {
        if (args_0.length !== 2) {
          throw new __compactRuntime.CompactError(`path_for_leaf: expected 2 arguments, received ${args_0.length}`);
        }
        const index_0 = args_0[0];
        const leaf_0 = args_0[1];
        if (!(typeof(index_0) === 'bigint' && index_0 >= 0 && index_0 <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 1',
                                     'proofperks.compact line 101 char 1',
                                     'Field',
                                     index_0)
        }
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 2',
                                     'proofperks.compact line 101 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(5, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().pathForLeaf(    index_0,    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      findPathForLeaf(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`find_path_for_leaf: expected 1 argument, received ${args_0.length}`);
        }
        const leaf_0 = args_0[0];
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('find_path_for_leaf',
                                     'argument 1',
                                     'proofperks.compact line 101 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(5, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().findPathForLeaf(    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      }
    },
    approvedCommitmentSet: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(5n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(5n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 102 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(5n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[5];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    usedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(6n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(6n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 103 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(6n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[6];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    usedContributorNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(7n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(7n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 106 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(7n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[7];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    revokedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(8n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(8n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 110 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(8n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[8];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get rewardBudget() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(9n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get reservedRewardBudget() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(10n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get rewardAmount() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(1n),
                                                                                                   alignment: _descriptor_23.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_23.toValue(11n),
                                                                                                   alignment: _descriptor_23.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    pendingRewardRecipients: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(12n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(12n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 125 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(12n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'proofperks.compact line 125 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(12n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[12];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_7.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    rewardReservations: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(13n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(13n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 126 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(13n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'proofperks.compact line 126 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(13n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[13];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    paidRewardNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(14n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(14n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'proofperks.compact line 128 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(1n),
                                                                                                     alignment: _descriptor_23.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_23.toValue(14n),
                                                                                                     alignment: _descriptor_23.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[14];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  issuerSecret: (...args) => undefined,
  approvedContributorSecret: (...args) => undefined,
  approvedContributorAnchor: (...args) => undefined,
  approvedPoints: (...args) => undefined,
  contributorAnchor: (...args) => undefined,
  contributorSecret: (...args) => undefined,
  contributorPoints: (...args) => undefined,
  revocationTargetSecret: (...args) => undefined,
  oldContributorAnchor: (...args) => undefined,
  oldContributorSecret: (...args) => undefined,
  findCommitmentPath: (...args) => undefined
});
export const pureCircuits = {
  issuerPublicKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`issuerPublicKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('issuerPublicKey',
                                 'argument 1',
                                 'proofperks.compact line 158 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._issuerPublicKey_0(secret_0);
  },
  contributionCommitment: (...args_0) => {
    if (args_0.length !== 7) {
      throw new __compactRuntime.CompactError(`contributionCommitment: expected 7 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const credentialVersion_0 = args_0[0];
    const networkId_0 = args_0[1];
    const deploymentId_0 = args_0[2];
    const campaignId_0 = args_0[3];
    const anchor_0 = args_0[4];
    const secret_0 = args_0[5];
    const points_0 = args_0[6];
    if (!(typeof(credentialVersion_0) === 'bigint' && credentialVersion_0 >= 0n && credentialVersion_0 <= 65535n)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 1',
                                 'proofperks.compact line 165 char 1',
                                 'Uint<0..65536>',
                                 credentialVersion_0)
    }
    if (!(networkId_0.buffer instanceof ArrayBuffer && networkId_0.BYTES_PER_ELEMENT === 1 && networkId_0.length === 32)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 2',
                                 'proofperks.compact line 165 char 1',
                                 'Bytes<32>',
                                 networkId_0)
    }
    if (!(deploymentId_0.buffer instanceof ArrayBuffer && deploymentId_0.BYTES_PER_ELEMENT === 1 && deploymentId_0.length === 32)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 3',
                                 'proofperks.compact line 165 char 1',
                                 'Bytes<32>',
                                 deploymentId_0)
    }
    if (!(typeof(campaignId_0) === 'bigint' && campaignId_0 >= 0 && campaignId_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 4',
                                 'proofperks.compact line 165 char 1',
                                 'Field',
                                 campaignId_0)
    }
    if (!(anchor_0.buffer instanceof ArrayBuffer && anchor_0.BYTES_PER_ELEMENT === 1 && anchor_0.length === 32)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 5',
                                 'proofperks.compact line 165 char 1',
                                 'Bytes<32>',
                                 anchor_0)
    }
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 6',
                                 'proofperks.compact line 165 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    if (!(typeof(points_0) === 'bigint' && points_0 >= 0n && points_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('contributionCommitment',
                                 'argument 7',
                                 'proofperks.compact line 165 char 1',
                                 'Uint<0..18446744073709551616>',
                                 points_0)
    }
    return _dummyContract._contributionCommitment_0(credentialVersion_0,
                                                    networkId_0,
                                                    deploymentId_0,
                                                    campaignId_0,
                                                    anchor_0,
                                                    secret_0,
                                                    points_0);
  },
  claimNullifier: (...args_0) => {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`claimNullifier: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const credentialVersion_0 = args_0[0];
    const networkId_0 = args_0[1];
    const deploymentId_0 = args_0[2];
    const campaignId_0 = args_0[3];
    const secret_0 = args_0[4];
    if (!(typeof(credentialVersion_0) === 'bigint' && credentialVersion_0 >= 0n && credentialVersion_0 <= 65535n)) {
      __compactRuntime.typeError('claimNullifier',
                                 'argument 1',
                                 'proofperks.compact line 186 char 1',
                                 'Uint<0..65536>',
                                 credentialVersion_0)
    }
    if (!(networkId_0.buffer instanceof ArrayBuffer && networkId_0.BYTES_PER_ELEMENT === 1 && networkId_0.length === 32)) {
      __compactRuntime.typeError('claimNullifier',
                                 'argument 2',
                                 'proofperks.compact line 186 char 1',
                                 'Bytes<32>',
                                 networkId_0)
    }
    if (!(deploymentId_0.buffer instanceof ArrayBuffer && deploymentId_0.BYTES_PER_ELEMENT === 1 && deploymentId_0.length === 32)) {
      __compactRuntime.typeError('claimNullifier',
                                 'argument 3',
                                 'proofperks.compact line 186 char 1',
                                 'Bytes<32>',
                                 deploymentId_0)
    }
    if (!(typeof(campaignId_0) === 'bigint' && campaignId_0 >= 0 && campaignId_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('claimNullifier',
                                 'argument 4',
                                 'proofperks.compact line 186 char 1',
                                 'Field',
                                 campaignId_0)
    }
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('claimNullifier',
                                 'argument 5',
                                 'proofperks.compact line 186 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._claimNullifier_0(credentialVersion_0,
                                            networkId_0,
                                            deploymentId_0,
                                            campaignId_0,
                                            secret_0);
  },
  revocationNullifier: (...args_0) => {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`revocationNullifier: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const credentialVersion_0 = args_0[0];
    const networkId_0 = args_0[1];
    const deploymentId_0 = args_0[2];
    const campaignId_0 = args_0[3];
    const secret_0 = args_0[4];
    if (!(typeof(credentialVersion_0) === 'bigint' && credentialVersion_0 >= 0n && credentialVersion_0 <= 65535n)) {
      __compactRuntime.typeError('revocationNullifier',
                                 'argument 1',
                                 'proofperks.compact line 214 char 1',
                                 'Uint<0..65536>',
                                 credentialVersion_0)
    }
    if (!(networkId_0.buffer instanceof ArrayBuffer && networkId_0.BYTES_PER_ELEMENT === 1 && networkId_0.length === 32)) {
      __compactRuntime.typeError('revocationNullifier',
                                 'argument 2',
                                 'proofperks.compact line 214 char 1',
                                 'Bytes<32>',
                                 networkId_0)
    }
    if (!(deploymentId_0.buffer instanceof ArrayBuffer && deploymentId_0.BYTES_PER_ELEMENT === 1 && deploymentId_0.length === 32)) {
      __compactRuntime.typeError('revocationNullifier',
                                 'argument 3',
                                 'proofperks.compact line 214 char 1',
                                 'Bytes<32>',
                                 deploymentId_0)
    }
    if (!(typeof(campaignId_0) === 'bigint' && campaignId_0 >= 0 && campaignId_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('revocationNullifier',
                                 'argument 4',
                                 'proofperks.compact line 214 char 1',
                                 'Field',
                                 campaignId_0)
    }
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('revocationNullifier',
                                 'argument 5',
                                 'proofperks.compact line 214 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._revocationNullifier_0(credentialVersion_0,
                                                 networkId_0,
                                                 deploymentId_0,
                                                 campaignId_0,
                                                 secret_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
