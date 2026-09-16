<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks Wave 1 walkthrough

Repository: [https://github.com/SuryaXyz-art/Proofperks](https://github.com/SuryaXyz-art/Proofperks)

## Overview

ProofPerks demonstrates private reward claims for Web3 community campaigns. An issuer approves a contribution by committing to a contributor secret, point total, and campaign ID; the contributor later proves that approved credential meets the campaign rule without revealing the secret or raw points on the public ledger.

## Status (Wave 1)

Implemented:

- Single-campaign Compact contract source in `contract/src/proofperks.compact`.
- Private eligibility circuit with commitment membership and threshold checks.
- Public nullifier set that prevents the same contributor secret from claiming twice for one campaign.
- Issuer-controlled credential revocation using opaque, domain-separated revocation nullifiers.
- Issuer-mediated recovery that retires the old secret marker before issuing a replacement under the same private contributor anchor.
- Separate `payout_reward` circuit that sends exactly 1,000 base units of native Preprod test token (tNIGHT) after a successful claim.
- CLI demo in `cli/demo.ts` covering the three judged scenarios.
- Midnight testkit-backed `node:test` integration tests in `contract/test/proofperks.test.mjs`, using the generated artifact in `contract/managed` and no JS mock fallback.
- Preprod configuration and a headless `deploy:preprod` command using Midnight.js.
- Minimal React organizer dashboard with Midnight DApp Connector wallet connection, session-only approval queue, on-chain issuer approval, public claim count, commitment root, and remaining-budget metrics.
- Organizer revoke control for issuer-signed future-claim revocations; target secrets remain session-only.

Not implemented:

- A completed live Preprod deployment from this workspace.
- Contributor claim controls in the UI.
- Custom reward-token minting or treasury management.
- UI Merkle-path indexing for contributor claims.
- A captured real-testkit timing report from this workspace; the latest run was explicitly skipped because Docker/testkit infrastructure is unavailable here.

## Privacy model

| Visibility | Data | Where it is used |
| --- | --- | --- |
| Private | Contribution evidence | Held by the issuer or local application; not stored raw by the contract. |
| Private | Contributor secret | Witness input used to recompute the commitment and nullifier. |
| Private | Stable contributor anchor | A private recovery binding used to enforce one claim across secret rotation. |
| Private | Raw points | Witness input used to recompute the commitment and compare against the threshold. |
| Public | Campaign rules | Campaign ID, required threshold, and active flag live in public ledger state. |
| Public | Commitment tree/root | The ledger stores approved commitment hashes and exposes the tree root. |
| Public | Nullifiers and revocation markers | Used nullifiers and opaque, domain-separated revocation markers are recorded for single-use claims and future revocation checks. |
| Public | Claim count | Can be derived from the size of the nullifier set. |
| Shared by choice | Audit evidence | Optional evidence can be shared with reviewers without making it contract state. |

## Trust boundary

The issuer still judges whether a contribution deserves approval. The circuit proves only that the supplied private credential matches an issuer-approved commitment, meets the public threshold, and has not already been used. It does not independently verify task completion, social activity, or any other real-world evidence.

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

`compact compile` successfully builds the Compact source and generated assets. `npm test` requires Docker Desktop for the local testkit environment, or a configured `MN_TEST_ENVIRONMENT`. With that infrastructure, it runs the three real Compact scenarios and labels timings `REAL COMPACT/TESTKIT`; unavailable infrastructure produces explicit skips and never invokes a mock. The latest run here was skipped, so no real proving-time numbers are claimed for this checkout.

The compile command runs Compact and builds the generated TypeScript contract wrapper. On Windows, the repository invokes Compact inside WSL automatically; native Windows is not supported by Compact.

If Compact is missing, use the [Midnight installation guide](https://docs.midnight.network/getting-started/installation) and run this in WSL:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update 0.31.1
```

To deploy to Preprod, start the proof server, provide a funded headless wallet seed and issuer public key, then run:

```powershell
docker run -p 6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v
$env:PROOFPERKS_WALLET_SEED="<32-byte-hex-seed>"
$env:PROOFPERKS_ISSUER_PUBLIC_KEY="<32-byte-hex-key>"
$env:PROOFPERKS_PRIVATE_STATE_PASSWORD="<strong-local-password>"
npm run deploy:preprod
```

Record the printed contract address for the UI.

Fund the deployed contract with native Preprod test token (tNIGHT) before processing claims. The deployment’s `PROOFPERKS_REWARD_BUDGET` value is the public remaining-budget cap shown in the dashboard. A successful `claim_reward(recipient)` records the recipient and nullifier; the separate `payout_reward(nullifier)` circuit then sends exactly 1,000 base units to that recorded address and decrements the cap. The payout transaction cannot create, alter, or bypass the privacy proof state.

For the Wave 1 narration, run the explicit local reference mode:

```powershell
$env:PROOFPERKS_DEMO_MODE="reference"
$env:PROOFPERKS_NETWORK="local"
npm run demo --workspace @proofperks/cli
```

To run the UI against Preprod:

```powershell
$env:VITE_PROOFPERKS_CONTRACT_ADDRESS="<deployed-contract-address>"
$env:VITE_PROOFPERKS_ISSUER_PUBLIC_KEY="<same-issuer-public-key>"
npm run dev --workspace @proofperks/ui
```

Install and unlock Midnight Lace in Chrome, select Preprod, and click **Connect wallet**. Enter the contract address, issuer public key, and issuer secret, add a credential to the private pending queue, and click **Approve on-chain**. The approval call is balanced and submitted through the connected wallet API. The queue is React memory only: it is cleared when the tab session ends and is never persisted client-side.

The output is ordered as follows:

1. Demo title, mode, and network.
2. Scenario header and plain-language explanation.
3. Private inputs, always redacted and labeled as local-prover-only.
4. Public campaign data and commitment/nullifier state.
5. Commitment root before and after approval.
6. Nullifier set before and after each claim attempt.
7. Proof generation timing and rejection reason, where applicable.
8. Final PASS/FAIL for the scenario and an overall summary.

For a repeatable Wave 2 reference-load run, simulate up to 32 concurrent claims and export the anonymized aggregate report:

```powershell
$env:PROOFPERKS_LOAD_N="32"
npm run pilot:load
npm run pilot:export -- --input .\pilot-events.jsonl --output .\pilot-metrics.json
```

The runner keeps the valid participant batch metrics separate from its intentional duplicate-nullifier race probe. These are local reference timings, not live proof-server timings.

For live local/testnet execution, set `PROOFPERKS_DEMO_MODE=live` and point `PROOFPERKS_DEMO_ADAPTER` to a module exporting `createProofPerksDeployment`. The adapter must connect the generated Compact contract to Midnight.js, the wallet, the indexer, the proof server, and the selected network. `cli/demo.ts` documents the required adapter methods.

## Known limitations

- Reference mode is not a live Compact deployment; its timings are not ZK proof-server timings. Its payout assertions model the same two-step state transition.
- A completed live Preprod deployment is not included; it requires the operator's funded wallet, DUST, and reward-pool funding.
- The organizer dashboard queue is intentionally session-only and has no durable intake backend or indexer integration.
- The campaign is single-campaign only.
- Approval is issuer-trusted; the circuit does not judge real-world contribution evidence.
- Revocation before claim blocks eligibility, but revocation after a claim is recorded is not retroactive: it does not remove the used nullifier or reverse an already-issued payout. This is a known limitation.
- Recovery requires the stable private contributor anchor to be retained or securely reissued; losing that anchor requires an out-of-band identity recovery process.
- Recovery is issuer-mediated: it checks the old secret marker and stable-anchor binding, but does not independently prove old commitment membership; the issuer must supply the correct old secret.
- Organizer audit history and full contributor claim UX are future work.
- The issuer credential remains a private witness that must match the public issuer key configured at deployment; production deployments should add a reviewed wallet/account authorization binding if the application requires that stronger identity guarantee.

## AKINDO/Midnight submission checklist

These are intentionally unchecked for manual close-out:

- [x] Public GitHub repository: [https://github.com/SuryaXyz-art/Proofperks](https://github.com/SuryaXyz-art/Proofperks)
- [ ] This README
- [ ] Pitch deck
- [ ] Demo video
- [ ] Wave progress description
- [ ] `midnightntwrk` repository topic/label
- [ ] Apache-2.0 license applied to the Midnight code
