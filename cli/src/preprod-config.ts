// SPDX-License-Identifier: Apache-2.0

export const PREPROD_CONFIG = Object.freeze({
  walletNetworkId: 'preprod' as const,
  networkId: 'preprod' as const,
  node: 'https://rpc.preprod.midnight.network',
  nodeWS: 'wss://rpc.preprod.midnight.network',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  faucet: 'https://faucet.preprod.midnight.network',
  proofServer: process.env.PROOFPERKS_PROOF_SERVER ?? 'http://127.0.0.1:6300',
});

export function requirePreprodEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for Preprod deployment`);
  return value;
}
