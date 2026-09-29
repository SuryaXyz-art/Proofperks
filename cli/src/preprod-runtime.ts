// SPDX-License-Identifier: Apache-2.0

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DustSecretKey, ZswapSecretKeys, nativeToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { DEFAULT_DUST_OPTIONS, FluentWalletBuilder, WalletFactory, WalletSeeds, syncWallet } from '@midnight-ntwrk/testkit-js';
import { DustWallet, InMemoryTransactionHistoryStorage, ShieldedWallet, UnshieldedWallet, WalletEntrySchema, createKeystore, mergeWalletEntries } from '@midnight-ntwrk/wallet-sdk';
import type { WalletFacade } from '@midnight-ntwrk/wallet-sdk';
import type { UnshieldedKeystore } from '@midnight-ntwrk/wallet-sdk';
import { PREPROD_CONFIG, requirePreprodEnv } from './preprod-config.ts';
import { validateWalletConfiguration } from '../../src/proofperks-client.ts';
import { ContractState as RuntimeContractState } from '@midnight-ntwrk/compact-runtime';
import { ledger } from '../../contract/dist/index.js';
import { getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import type { PublicDataProvider } from '@midnight-ntwrk/midnight-js-types';

// Indexer reads return a ledger-v8 ContractState, while the generated ledger() expects the
// compact-runtime WASM classes. Round-trip through bytes so the instanceof checks line up.
// The indexer's getUnshieldedBalances returns an empty list for contract addresses on Preprod,
// so read the native balance straight from the confirmed contract state.
export async function readContractNativeBalance(publicDataProvider: PublicDataProvider, address: string): Promise<bigint> {
  const { contractState } = await getPublicStates(publicDataProvider, address);
  for (const [tokenType, amount] of (contractState as any).balance as Map<{ tag: string; raw: string }, bigint>) {
    if (tokenType.tag === 'unshielded' && tokenType.raw === nativeToken().raw) return amount;
  }
  return 0n;
}

export function readLedger(contractState: { serialize(): Uint8Array }): ReturnType<typeof ledger> {
  return ledger(RuntimeContractState.deserialize(contractState.serialize()).data as any);
}

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

const syncTimeoutMs = Number(process.env.PROOFPERKS_WALLET_SYNC_TIMEOUT_MS ?? 600_000);

// Syncing a fresh wallet replays the whole Preprod DUST history (hours). Cache the serialized
// wallet state under .private-state/ (gitignored) so later runs resume from where the last one stopped.
// A zero computed fee leaves the DUST spend set empty and the node rejects contract calls with
// 1010 Custom error 117 (NotNormalized). A small positive overhead forces a real DUST fee.
const dustOptions = { ...DEFAULT_DUST_OPTIONS, additionalFeeOverhead: BigInt(process.env.PROOFPERKS_DUST_FEE_OVERHEAD ?? '300000000000000') };

const walletCachePath = path.join(privateStateRoot, 'wallet-cache.json');
type WalletCache = { seedTag: string; shielded: string; unshielded: string; dust: string };

async function readWalletCache(seedTag: string): Promise<WalletCache | undefined> {
  try {
    const cache = JSON.parse(await readFile(walletCachePath, 'utf8')) as WalletCache;
    return cache.seedTag === seedTag ? cache : undefined;
  } catch {
    return undefined;
  }
}

async function saveWalletCache(wallet: WalletFacade, seedTag: string): Promise<void> {
  const cache: WalletCache = { seedTag, shielded: await wallet.shielded.serializeState(), unshielded: await wallet.unshielded.serializeState(), dust: await wallet.dust.serializeState() };
  await mkdir(privateStateRoot, { recursive: true, mode: 0o700 });
  await writeFile(`${walletCachePath}.tmp`, JSON.stringify(cache), { mode: 0o600 });
  await rename(`${walletCachePath}.tmp`, walletCachePath);
}

export async function startWallet(): Promise<{ wallet: WalletFacade; seeds: WalletSeeds; keystore: UnshieldedKeystore; walletAddress: string; nativeBalance: bigint; dustBalance: bigint; stop: () => Promise<void> }> {
  const walletSeed = requirePreprodEnv('PROOFPERKS_WALLET_SEED');
  const config = (FluentWalletBuilder.forEnvironment(PREPROD_CONFIG) as unknown as { config: any }).config;
  const seeds = WalletSeeds.fromMasterSeed(walletSeed);
  const keystore = createKeystore(seeds.unshielded, PREPROD_CONFIG.walletNetworkId);
  const seedTag = keystore.getAddress();
  validateWalletConfiguration({ networkId: PREPROD_CONFIG.networkId, indexerUri: PREPROD_CONFIG.indexer, indexerWsUri: PREPROD_CONFIG.indexerWS, substrateNodeUri: PREPROD_CONFIG.node, proverServerUri: PREPROD_CONFIG.proofServer });

  const cache = await readWalletCache(seedTag);
  const wallet = cache
    ? await WalletFactory.createWalletFacade(
      config,
      ShieldedWallet(config).restore(cache.shielded),
      UnshieldedWallet({ ...config, txHistoryStorage: new InMemoryTransactionHistoryStorage(WalletEntrySchema, mergeWalletEntries) }).restore(cache.unshielded),
      DustWallet({ ...config, costParameters: { ledgerParams: dustOptions.ledgerParams, additionalFeeOverhead: dustOptions.additionalFeeOverhead, feeBlocksMargin: dustOptions.feeBlocksMargin } }).restore(cache.dust),
    )
    : await WalletFactory.createWalletFacade(
      config,
      WalletFactory.createShieldedWallet(config, seeds.shielded),
      WalletFactory.createUnshieldedWallet(config, keystore),
      WalletFactory.createDustWallet(config, seeds.dust, dustOptions),
    );
  console.error(cache ? 'Resuming wallet from local sync cache.' : 'No wallet sync cache; performing a full Preprod sync (this can take hours the first time).');

  await withTimeout(wallet.start(ZswapSecretKeys.fromSeed(seeds.shielded), DustSecretKey.fromSeed(seeds.dust)), 60_000, 'wallet synchronization start');
  const checkpoint = setInterval(() => {
    saveWalletCache(wallet, seedTag).catch(() => undefined);
  }, 60_000);
  let lastDustProgress: { appliedIndex: bigint; highestRelevantWalletIndex: bigint } | undefined;
  const progress = wallet.state().subscribe((state) => { lastDustProgress = state.dust.state.progress; });
  const report = setInterval(() => { if (lastDustProgress) console.error(`DUST sync ${lastDustProgress.appliedIndex}/${lastDustProgress.highestRelevantWalletIndex}`); }, 60_000);
  try {
    await withTimeout(syncWallet(wallet, 1_000, syncTimeoutMs), syncTimeoutMs + 15_000, 'wallet synchronization');
  } finally {
    clearInterval(checkpoint);
    clearInterval(report);
    progress.unsubscribe();
    await saveWalletCache(wallet, seedTag).catch(() => undefined);
  }
  const state = await withTimeout(wallet.waitForSyncedState(), syncTimeoutMs, 'wallet synced state');
  const walletAddress = keystore.getBech32Address().asString();
  const nativeBalance = state.unshielded.balances[nativeToken().raw] ?? 0n;
  const dustBalance = state.dust.balance(new Date());
  return { wallet, seeds, keystore, walletAddress, nativeBalance, dustBalance, stop: async () => { await saveWalletCache(wallet, seedTag).catch(() => undefined); await wallet.stop(); } };
}

export async function assertProofServer(): Promise<void> {
  const url = new URL('/health', PREPROD_CONFIG.proofServer).href;
  const response = await withTimeout(fetch(url), 10_000, 'proof server health check');
  if (!response.ok) throw new Error(`Proof server health check failed with HTTP ${response.status}.`);
  await response.body?.cancel();
}
