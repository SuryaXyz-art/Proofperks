// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import test from 'node:test';

const client = await import('../src/proofperks-client.ts');

test('typed client rejects wrong wallet network and incomplete configuration', () => {
  assert.throws(
    () => client.validateWalletConfiguration({ networkId: 'mainnet', indexerUri: 'x', indexerWsUri: 'x', substrateNodeUri: 'x' }),
    /Wrong network/,
  );
  assert.throws(
    () => client.validateWalletConfiguration({ networkId: 'preprod', indexerUri: '', indexerWsUri: 'x', substrateNodeUri: 'x' }),
    /incomplete network configuration/,
  );
});

test('typed client validates deployment artifacts and private-state namespaces', () => {
  assert.throws(() => client.validateDeploymentAddress('short'), /too short/);
  assert.throws(() => client.validateArtifactManifest({ schema: 1, circuits: [], artifacts: [] }), /missing the approve_contribution/);
  assert.equal(
    client.privateStateNamespace({ account: 'mn_addr1', role: 'contributor', network: 'preprod', contractAddress: 'mn_contract1' }),
    'proofperks:preprod:contributor:mn_addr1:mn_contract1',
  );
});

test('typed client maps wallet rejection and prover failures to user-safe messages', () => {
  assert.match(client.explainClientError(new Error('User rejected request')), /rejected/);
  assert.match(client.explainClientError(new Error('prover server unavailable')), /prover is unavailable/);
});
