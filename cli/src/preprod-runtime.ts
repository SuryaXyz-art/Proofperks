// SPDX-License-Identifier: Apache-2.0

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nativeToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { FluentWalletBuilder, syncWallet } from '@midnight-ntwrk/testkit-js';
import type { WalletSeeds } from '@midnight-ntwrk/testkit-js';
import type { WalletFacade } from '@midnight-ntwrk/wallet-sdk';
import type { UnshieldedKeystore } from '@midnight-ntwrk/wallet-sdk';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.ts';
import { validateWalletConfiguration } from '../../src/proofperks-client.ts';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const managedPath = path.join(root, 'contract', 'managed');
export const deploymentPath = path.join(root, 'deployments', 'preprod.json');
export const privateStateRoot = path.join(root, '.private-state');

export type DeploymentManifest = {
  source: { sha256: string };
  toolchain: Record<string, string>;
  circuits: string[];
  artifacts: Array<{ path: string; sha256: string; bytes: number }>;
};

export async function loadManifest(): Promise<DeploymentManifest> {
  const manifest = JSON.parse(await readFile(path.join(managedPath, 'manifest.json'), 'utf8')) as DeploymentManifest;
  if (!manifest.source?.sha256 || !manifest.artifacts?.length || !manifest.circuits?.includes('claim_reward')) {
    throw new Error('Generated manifest is incomplete; run npm run compile before deployment.');
  }
  return manifest;
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs} ms.`)), timeoutMs); }),
  ]).finally(() => { if (timer) clearTimeout(timer); });
}

export async function waitFor<T>(read: () => Promise<T>, predicate: (value: T) => boolean, timeoutMs: number, label: string): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let last: T | undefined;
  while (Date.now() < deadline) {
    last = await withTimeout(read(), 15_000, `${label} read`);
    if (predicate(last)) return last;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`${label} was not confirmed within ${timeoutMs} ms.`);
}

export async function startWallet(): Promise<{ wallet: WalletFacade; seeds: WalletSeeds; keystore: UnshieldedKeystore; walletAddress: string; nativeBalance: bigint; dustBalance: bigint; stop: () => Promise<void> }> {
  const walletSeed = requirePreprodEnv('PROOFPERKS_WALLET_SEED');
  const { wallet, seeds, keystore } = await FluentWalletBuilder.forEnvironment(PREPROD_CONFIG).withSeed(walletSeed).buildWithoutStarting();
  validateWalletConfiguration({ networkId: PREPROD_CONFIG.networkId, indexerUri: PREPROD_CONFIG.indexer, indexerWsUri: PREPROD_CONFIG.indexerWS, substrateNodeUri: PREPROD_CONFIG.node, proverServerUri: PREPROD_CONFIG.proofServer });
  const zswapSecretKeys = (await import('@midnight-ntwrk/midnight-js-protocol/ledger')).ZswapSecretKeys.fromSeed(seeds.shielded);
  const dustSecretKey = (await import('@midnight-ntwrk/midnight-js-protocol/ledger')).DustSecretKey.fromSeed(seeds.dust);
  await withTimeout(wallet.start(zswapSecretKeys, dustSecretKey), 60_000, 'wallet synchronization start');
  await withTimeout(syncWallet(wallet, 1_000, 60_000), 75_000, 'wallet synchronization');
  const state = await withTimeout(wallet.waitForSyncedState(), 60_000, 'wallet synced state');
  const walletAddress = (await wallet.unshielded.getAddress()).toString();
  const nativeBalance = state.unshielded.balances[nativeToken().raw] ?? 0n;
  const dustBalance = state.dust.balance(new Date());
  return { wallet, seeds, keystore, walletAddress, nativeBalance, dustBalance, stop: () => wallet.stop() };
}

export async function assertProofServer(): Promise<void> {
  const url = new URL('/health', PREPROD_CONFIG.proofServer).href;
  const response = await withTimeout(fetch(url), 10_000, 'proof server health check');
  if (!response.ok) throw new Error(`Proof server health check failed with HTTP ${response.status}.`);
  await response.body?.cancel();
}
