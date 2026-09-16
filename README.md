<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks

[![GitHub Repository](https://img.shields.io/badge/GitHub-SuryaXyz--art%2FProofperks-blue?logo=github)](https://github.com/SuryaXyz-art/Proofperks)

Repository: [https://github.com/SuryaXyz-art/Proofperks](https://github.com/SuryaXyz-art/Proofperks)

## Overview

ProofPerks is a privacy-preserving reward-claim system for Web3 community campaigns: an issuer can approve a contributor's evidence and points without putting the contributor's secret or raw points on the public ledger, while the contributor can later prove eligibility and claim once.

## Status (Wave 1)

Implemented in this repository:

- A single-campaign Compact contract with campaign rules, approved commitment storage, and a nullifier set.
- A private eligibility circuit that checks commitment membership and the campaign threshold.
- Nullifier-based double-claim prevention for each campaign and contributor secret pair.
- Issuer-controlled credential revocation using a domain-separated public revocation-nullifier set that does not expose the approved commitment being revoked.
- Issuer-mediated credential recovery that retires the old secret marker and issues a replacement under the same private contributor anchor.
- A separate fixed payout circuit that sends 1,000 base units of native Preprod test token (tNIGHT) to the recipient bound by a successful claim.
- A Node/TypeScript CLI demo with narratable happy-path, tampered-credential, and double-claim scenarios.
- A Midnight testkit-backed `node:test` integration suite for the same three scenarios; it imports the generated contract from `contract/managed`, never falls back to a JS mock, and labels real Compact/testkit timings when infrastructure is available.
- Preprod network configuration and a headless `deploy:preprod` command using Midnight.js.
- A minimal React organizer dashboard with wallet connection, session-only pending approvals, on-chain approval, public claim count, commitment root, and remaining-budget metrics.
- An organizer revoke control that submits issuer-signed future-claim revocations while keeping the target secret in session memory.

Not implemented yet:

- A completed live Preprod deployment from this workspace.
- A captured real-testkit proving-time report from this workspace; the latest run was explicitly skipped because Docker/testkit infrastructure is unavailable here.
- Contributor claim controls in the UI.
- Custom reward-token minting or treasury management beyond the fixed native-token payout.
- A generated claim-path indexer/private-state flow for the UI.

The Compact source compiles with `compact compile`, including full ZK assets when run without `--skip-zk`. The integration tests exercise the generated artifact through Midnight testkit when its node, indexer, wallet, and proof-server infrastructure is available. The explicit `reference` mode remains the runnable Wave 1 CLI fallback; its timings are not Compact proving times.

## Privacy model

| Visibility | Data | What it means |
| --- | --- | --- |
| Private | Contribution evidence | The issuer's source evidence is not stored raw by the contract. |
| Private | Contributor secret | Used locally to derive the approved commitment and claim nullifier. |
| Private | Stable contributor anchor | Rotates independently from the secret and prevents an old/new recovery pair from claiming twice. |
| Private | Raw points | Used as a witness to recompute the commitment and check the threshold. |
| Public | Campaign rules | Campaign ID, threshold, and active flag are public ledger configuration. |
| Public | Commitment tree and root | Only approved commitment hashes and the resulting Merkle root are public. |
| Public | Nullifiers and revocation markers | Used claim nullifiers and opaque revocation markers are public for replay and future-claim checks; revocation markers are domain-separated from commitment hashes and do not reveal the revoked commitment by themselves. |
| Public | Claim count | Derived from the public nullifier set size. |
| Shared by choice | Audit evidence | An issuer or contributor may share supporting evidence voluntarily; the contract does not require it to be public. |

## Trust boundary

The issuer still decides whether a contribution deserves approval. The circuit only proves that an issuer-approved credential is in the commitment tree, meets the campaign threshold, and has not been claimed before. It does not verify that the contributor really completed a real-world task.

## How to run

Clone the repository and run from the repository root:

```powershell
git clone https://github.com/SuryaXyz-art/Proofperks.git
cd proofperks
npm install
npm run compile
npm test
npm run build:ui
```

The compile script invokes Compact and then builds the generated TypeScript wrapper. On Windows it automatically invokes Compact through WSL, because the Compact compiler is not natively supported there. The tests use Node's built-in runner and Midnight testkit. Start Docker Desktop for a local undeployed environment, or set `MN_TEST_ENVIRONMENT` for a configured remote environment:

```powershell
npm test
```

If testkit infrastructure is unavailable, the three integration tests are explicitly marked `SKIP`; they never fall back to a JavaScript mock. In a real testkit run, claim lines are labeled `REAL COMPACT/TESTKIT` and measure proof generation plus transaction finalization. This checkout's latest run produced no such timings because Docker was unavailable.

If Compact is not installed, follow the [Midnight installation guide](https://docs.midnight.network/getting-started/installation) from WSL:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update 0.31.1
```

The Preprod deployment requires a funded headless issuer wallet and local proof server:

```powershell
docker run -p 6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v
$env:PROOFPERKS_WALLET_SEED="<32-byte-hex-seed>"
$env:PROOFPERKS_ISSUER_PUBLIC_KEY="<32-byte-hex-key>"
$env:PROOFPERKS_PRIVATE_STATE_PASSWORD="<strong-local-password>"
npm run deploy:preprod
```

The wallet must have Preprod tNIGHT and DUST available. The command prints the deployed contract address; keep it for the UI configuration.

The deployment account or another treasury must also fund the contract with native Preprod test token (tNIGHT). `PROOFPERKS_REWARD_BUDGET` sets the public campaign budget cap at deployment; each successful claim can then call `payout_reward` to send exactly 1,000 base units to the recipient address bound during `claim_reward`. Payout is intentionally a second transaction so its failure cannot roll back or bypass the privacy checks.

For the runnable, local reference demo fallback:

```powershell
$env:PROOFPERKS_DEMO_MODE="reference"
$env:PROOFPERKS_NETWORK="local"
npm run demo --workspace @proofperks/cli
```

To run the Preprod UI against that contract:

```powershell
$env:VITE_PROOFPERKS_CONTRACT_ADDRESS="<deployed-contract-address>"
$env:VITE_PROOFPERKS_ISSUER_PUBLIC_KEY="<same-issuer-public-key>"
npm run dev --workspace @proofperks/ui
```

Open the Vite URL in Chrome with Midnight Lace installed, set to Preprod, and click **Connect wallet**. Enter the contract address, issuer public key, and issuer secret; add a pending credential, then click **Approve on-chain**. The approval transaction is balanced and submitted through the connected wallet API. The dashboard reads only public ledger aggregates, while issuer/contributor secrets and raw points stay in React memory for the current session and are never written to `localStorage`, `sessionStorage`, IndexedDB, or the ledger.

For a custom live CLI scenario runner, provide a deployment adapter that exports `createProofPerksDeployment`:

```powershell
$env:PROOFPERKS_DEMO_MODE="live"
$env:PROOFPERKS_NETWORK="local" # or testnet
$env:PROOFPERKS_DEMO_ADAPTER="C:\path\to\deployment-adapter.mjs"
npm run demo --workspace @proofperks/cli
```

The live adapter is responsible for the generated Compact contract, wallet, providers, proof server, deployment, and ledger snapshots. See [cli/demo.ts](./cli/demo.ts) for its required interface and output contract.

## Wave 2 pilot materials

Use [docs/pilot-runbook.md](./docs/pilot-runbook.md) to onboard 3–5 contributors, run the supervised claim flow, and capture only safe aggregate events. The short feedback form is in [docs/pilot-survey.md](./docs/pilot-survey.md). Export the Wave 2 report metrics with:

```powershell
npm run pilot:export -- --input .\pilot-events.jsonl --output .\pilot-metrics.json
```

Run the deterministic reference load simulation with up to 32 concurrent claims (the current depth-5 tree capacity):

```powershell
$env:PROOFPERKS_LOAD_N="32"
npm run pilot:load
npm run pilot:export -- --input .\pilot-events.jsonl --output .\pilot-metrics.json
```

The load runner reports valid-batch failure rate and proving-time average/p95 separately from an intentional same-nullifier race probe. It is not a live proof-server benchmark.

The exporter accepts only `type`, `status`, `provingTimeMs`, and `failureCategory`; it rejects extra fields to help prevent accidental export of participant data.

## Known limitations

- Native Windows is not supported by Compact; use WSL for the compiler and Docker Desktop for the proof server.
- A live Preprod deployment needs a funded wallet, DUST, Lace or headless wallet configuration, the local proof server, and a separately funded reward pool.
- The organizer dashboard’s pending queue is intentionally session-only and has no backend/indexer integration; it is not a durable workflow for receiving approval requests.
- The runnable reference demo is an in-process harness, not a blockchain transaction and not a measurement of real ZK proof-server time.
- A live custom CLI demo still needs a deployment adapter and configured local/testnet infrastructure.
- Only one campaign is modeled.
- Issuer approval is trusted and centralized; real-world contribution completion is outside the circuit's trust model.
- Revocation is future-facing only: revoking before a claim blocks the claim, but revoking after a nullifier is recorded does not undo that claim or reverse a payout. This is a known limitation.
- Recovery depends on the issuer and contributor retaining or securely exchanging the stable private contributor anchor; losing that anchor requires a new identity/credential process outside this contract.
- Recovery is intentionally issuer-mediated: the recovery circuit checks the old secret marker and anchor binding, but does not independently prove old commitment membership; the issuer must supply the correct old secret.
- Organizer audit history and full wallet-connected claim UX remain out of scope for this Wave 1 implementation.
- The contract and demo need security review before production use.

## License

Apache-2.0. See [LICENSE](./LICENSE).

## AKINDO/Midnight submission checklist

Leave these items unchecked until they are manually confirmed:

- [x] Public GitHub repository: [https://github.com/SuryaXyz-art/Proofperks](https://github.com/SuryaXyz-art/Proofperks)
- [ ] This README
- [ ] Pitch deck
- [ ] Demo video
- [ ] Wave progress description
- [ ] `midnightntwrk` repository topic/label
- [ ] Apache-2.0 license applied to the Midnight code
