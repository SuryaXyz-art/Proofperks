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
- Contributor credential import, eligibility checking against the latest public commitment tree, recipient confirmation, separate Claim and Collect Reward actions, and encrypted backup/import that never persists secrets in browser storage.
- Typed client validation shared by browser and CLI paths for wallet network/capabilities, deployment address, generated artifacts, and private-state scoping.

Not implemented:

- A completed live Preprod deployment from this workspace.
- Custom reward-token minting or treasury management.
- Live wallet/prover/chain validation from this workspace; these browser flows still require a configured Preprod deployment and prover.
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
npm run test:generated
npm run test:integration
npm run test:release
npm run build:ui
```

`compact compile` successfully builds the Compact source and generated assets. `npm run test:generated` checks the canonical generated wrapper and protocol helpers. `npm run test:integration` requires Docker Desktop with `contract/compose.yml`, or a configured `MN_TEST_ENVIRONMENT`; it runs the real Compact/testkit scenarios and labels timings `REAL COMPACT/TESTKIT`. Unavailable infrastructure produces explicit skips and never invokes a mock. `npm run test:release` is the submission gate and fails when required integration tests are skipped or zero tests execute. The latest run here was unavailable, so no real proving-time numbers are claimed for this checkout.

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
$env:PROOFPERKS_ISSUER_SECRET="<32-byte-hex-issuer-secret>"
$env:PROOFPERKS_ISSUER_PUBLIC_KEY="<32-byte-hex-key>"
$env:PROOFPERKS_CREDENTIAL_NETWORK_ID="<32-byte-hex-network-scope>"
$env:PROOFPERKS_CREDENTIAL_DEPLOYMENT_ID="<32-byte-hex-deployment-scope>"
$env:PROOFPERKS_PRIVATE_STATE_PASSWORD="<strong-local-password>"
npm run deploy:preprod
```

Record the printed contract address for the UI.

The deployment writes `deployments/preprod.json` only after public-state confirmation and preserves the exact manifest-listed circuit bundle under `deployments/preprod-circuit-bundle/`. Then fund and verify without blind retries:

```powershell
$env:PROOFPERKS_FUND_REWARD_POOL="1000"
npm run fund:preprod
npm run verify:preprod
npm run smoke:preprod
```

`verify:preprod` reports actual native-token balance held by the contract separately from the campaign budget cap. `smoke:preprod` requires additional private contributor credentials in the local environment and performs one approval, claim, and payout smoke flow.

Set `PROOFPERKS_FUND_REWARD_POOL` to fund the deployed contract through the issuer-authenticated `fund_reward_pool` circuit. This actual native-token balance is separate from `PROOFPERKS_REWARD_BUDGET`, the public campaign cap. A successful `claim_reward(recipient)` reserves exactly 1,000 base units and binds the recipient; `payout_reward(nullifier)` discharges that reservation only after the transfer succeeds. A failed payout leaves the reservation retryable without another claim.

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

For live Preprod execution, first complete the deployment/funding flow so `deployments/preprod.json` exists, then set `PROOFPERKS_DEMO_MODE=live`, `PROOFPERKS_NETWORK=preprod`, and point `PROOFPERKS_DEMO_ADAPTER` to `cli/src/preprod-demo-adapter.ts`. The adapter connects the generated Compact contract to Midnight.js, the wallet, indexer, proof server, and current Merkle path. It requires private wallet/prover configuration and fresh scenario credentials; it measures complete transaction time, not isolated prover time, unless the provider supplies that separately.

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
