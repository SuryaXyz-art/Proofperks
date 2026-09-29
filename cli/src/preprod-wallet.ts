// SPDX-License-Identifier: Apache-2.0

// Dedicated Preprod wallet helper: print the funding address, request faucet tokens,
// report balances, and register NIGHT UTXOs for DUST generation. Reads the seed from
// PROOFPERKS_WALLET_SEED only; never prints or persists it.

import pino from 'pino';
import { FaucetClient } from '@midnight-ntwrk/testkit-js';
import { PREPROD_CONFIG } from './preprod-config.ts';
import { assertProofServer, startWallet, waitFor, withTimeout } from './preprod-runtime.ts';

const command = process.argv[2];
const commands = ['address', 'faucet', 'status', 'register-dust'];
if (!commands.includes(command)) throw new Error(`Use one of: ${commands.join(', ')}`);

const runtime = await startWallet();
try {
  const address = runtime.keystore.getBech32Address().asString();
  const report = async () => {
    const state = await runtime.wallet.waitForSyncedState();
    return {
      unshieldedAddress: address,
      nativeBalance: runtime.nativeBalance.toString(),
      nightUtxos: state.unshielded.availableCoins.length,
      registeredForDust: state.unshielded.availableCoins.filter((coin) => coin.meta.registeredForDustGeneration).length,
      dustBalance: state.dust.balance(new Date()).toString(),
    };
  };

  if (command === 'address' || command === 'status') {
    console.log(JSON.stringify(await report(), null, 2));
  } else if (command === 'faucet') {
    await new FaucetClient(PREPROD_CONFIG.faucet, pino({ level: 'info' })).requestTokens(address);
    console.log(`Faucet request sent for ${address}. Run the status command after a few blocks.`);
  } else {
    await assertProofServer();
    const state = await runtime.wallet.waitForSyncedState();
    const unregistered = state.unshielded.availableCoins.filter((coin) => !coin.meta.registeredForDustGeneration);
    if (unregistered.length === 0) throw new Error('No unregistered NIGHT UTXOs. Fund the wallet first, or DUST is already registered.');
    const recipe = await runtime.wallet.registerNightUtxosForDustGeneration(unregistered, runtime.keystore.getPublicKey(), (payload) => runtime.keystore.signData(payload));
    const finalized = await withTimeout(runtime.wallet.finalizeRecipe(recipe), 5 * 60_000, 'DUST registration proving');
    const txId = await withTimeout(runtime.wallet.submitTransaction(finalized), 2 * 60_000, 'DUST registration submission');
    console.log(`DUST registration submitted: ${txId}`);
    await waitFor(async () => (await runtime.wallet.waitForSyncedState()).dust.balance(new Date()), (balance) => balance > 0n, 10 * 60_000, 'DUST generation');
    console.log(JSON.stringify(await report(), null, 2));
  }
} finally {
  await runtime.stop().catch(() => undefined);
}
process.exit(0);
