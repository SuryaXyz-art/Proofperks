// SPDX-License-Identifier: Apache-2.0

/**
 * Canonical ProofPerks credential inputs.
 *
 * Human-readable strings are deliberately not accepted as credential
 * material. Secrets and anchors must be generated randomly or supplied as
 * exactly 32-byte hexadecimal values.
 */

export const CREDENTIAL_VERSION = 1n;
export const UINT64_MAX = (1n << 64n) - 1n;
export const UINT128_MAX = (1n << 128n) - 1n;

export function bytes32FromHex(value: string, label = 'value'): Uint8Array {
  if (typeof value !== 'string' || !/^(?:0x)?[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(`${label} must be exactly 32 bytes encoded as 64 hexadecimal characters.`);
  }
  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  const bytes = new Uint8Array(32);
  for (let index = 0; index < 32; index += 1) {
    bytes[index] = Number.parseInt(normalized.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export function bytes32ToHex(value: Uint8Array, label = 'value'): string {
  if (!(value instanceof Uint8Array) || value.length !== 32) {
    throw new Error(`${label} must contain exactly 32 bytes.`);
  }
  return `0x${Array.from(value, byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function randomBytes32(): Uint8Array {
  const bytes = new Uint8Array(32);
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('A cryptographically secure random source is required for credential generation.');
  }
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

export function uint64(value: bigint | number | string, label = 'value'): bigint {
  const parsed = typeof value === 'bigint' ? value : BigInt(value);
  if (parsed < 0n || parsed > UINT64_MAX) throw new Error(`${label} is outside Uint<64>.`);
  return parsed;
}

export function uint128(value: bigint | number | string, label = 'value'): bigint {
  const parsed = typeof value === 'bigint' ? value : BigInt(value);
  if (parsed < 0n || parsed > UINT128_MAX) throw new Error(`${label} is outside Uint<128>.`);
  return parsed;
}

export type CredentialScope = {
  networkId: Uint8Array;
  deploymentId: Uint8Array;
  campaignId: bigint;
};

export function validateCredentialScope(scope: CredentialScope): CredentialScope {
  bytes32ToHex(scope.networkId, 'networkId');
  bytes32ToHex(scope.deploymentId, 'deploymentId');
  if (scope.campaignId < 0n) throw new Error('campaignId must be non-negative.');
  return { ...scope, campaignId: scope.campaignId };
}
