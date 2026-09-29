# Hosted E2E validation

## Update — 2026-09-29

The blockers recorded below have been cleared, and the chain flow has been proven:

- Confirmed Preprod deployment: [`deployments/preprod.json`](../deployments/preprod.json), contract `ad1bac915c3099af6dc015f67b30d9cbdf62e76c827fd95dddc68aa8d63547d5`.
- Headless approve → ZK claim → payout executed twice on Preprod: [`evidence/preprod-smoke-2026-09-29.json`](./evidence/preprod-smoke-2026-09-29.json).
- Vercel Production: [proofperks.vercel.app](https://proofperks.vercel.app). The remote `build:vercel` hash-checked all 28 circuit artifacts against the deployment record.
- Headless Chrome load of the production page, with no wallet connected, rendered live public state that matches the chain: 4 approved commitments, 2 claims, 98,000 remaining budget, 1,000 reward per claim. No console errors. The `.env.preprod` path returns 404, so local secrets were not uploaded.

### Wallet-driven browser run — 10/10 on production

`npm run e2e:hosted -- https://proofperks.vercel.app/` ([evidence](./evidence/hosted-e2e-2026-09-29.json)) drove the hosted console in headless Chrome with a DApp-connector v4 wallet bridged to the funded headless Preprod wallet. Every step passed: public dashboard without a wallet, connect, queue a credential, on-chain approval (`c793c348…9b987a`), eligibility, altered points rejected as not approved, ZK claim confirmed, reward collected and marked paid, claim count incremented, and a second claim blocked.

The first run against the previous build found the bugs fixed in this release:

- The claim sent the wallet's bech32 address to `encodeUserAddress`, which needs hex, so every browser claim failed.
- Status and error messages rendered only in the organizer sidebar, so a contributor saw "Stage: failed" with no reason.
- "Check eligibility" never checked approval, revocation or threshold.
- The organizer workspace, including the issuer-secret field, was shown in contributor mode.
- "Refresh public state" required a wallet although public reads do not.

Failure-state matrix, updated: duplicate claim (UI blocks it; the contract rejects it in the reference demo) and tampered points (reported as not approved) are now covered in the hosted run. Revocation, recovery, wallet rejection, wrong network, unavailable prover and insufficient rewards are still not run in a browser.

Still open: a recorded session with the Lace extension itself. The E2E wallet speaks the same connector API but is not Lace.

## Original result (2026-09-19)

Hosted E2E validation was not completed. There is no actual Vercel Preview deployment, no confirmed Preprod deployment manifest, and no configured dedicated organizer/contributor account pair in this workspace. No website URL, approval receipt, claim receipt, payout receipt, recipient, or reward transfer is claimed.

## Observed Vercel state

- Project: `proofperks`
- Project ID: `prj_5kEUtT2RwN575ZNAfauby2HzI4o2`
- Root directory: repository root
- Install command: `npm ci`
- Build command: `npm run build:vercel`
- Output directory: `ui/dist`
- Framework: Vite
- Vercel Node runtime: `22.x`
- Preview deployments: none
- Production deployments: none
- Preview environment variables: none
- Production environment variables: none

Project settings were verified, but settings alone are not a hosted deployment.

## Required hosted flow

The following was not run because the required confirmed Preprod deployment and private test accounts are unavailable:

1. Organizer connects the dedicated organizer wallet and approves a contribution.
2. Contributor imports a credential into the current session only.
3. Contributor fetches the latest approved tree and prepares a fresh Merkle path.
4. Contributor confirms the recipient, proves eligibility, and submits Claim.
5. Contributor separately submits Collect Reward.
6. Public readback confirms the same recipient and exactly 1,000 base units.
7. Reload confirms paid status without another claim.

No private wallet seed, issuer secret, contributor secret, credential evidence, or private-state file was requested or written.

## Failure-state matrix

| Check | Hosted result | Evidence boundary |
| --- | --- | --- |
| Duplicate claim | Not run against Preprod | Requires a confirmed deployment and contributor account. |
| Duplicate payout | Not run against Preprod | Requires a confirmed funded reward pool and payout receipt. |
| Tampered credential/points | Not run in hosted UI | Existing generated/reference tests are not hosted chain evidence. |
| Revocation | Not run against Preprod | Requires a live organizer transaction and readback. |
| Recovery/reissue | Not run against Preprod | Requires a live issuer-mediated recovery flow. |
| Wallet rejection/disconnect | Not run in a browser session | Requires the wallet extension and hosted page. |
| Wrong network | Not run in a browser session | Requires a connected wallet on the wrong network. |
| Unavailable prover | Not run against the hosted page | Requires a real prover configuration and browser request trace. |
| Insufficient rewards | Not run against Preprod | Requires a funded deployment with an intentionally insufficient pool. |

## Browser, storage, and request inspection

Not completed because no hosted URL exists. The production build path rejects private `VITE_*` variables and does not configure seeds, issuer secrets, private-state databases, or a prover URL for Vercel. This is a source/build invariant, not proof from a browser network trace.

The remaining inspection must use synthetic credentials only and must record:

- requests sent to Vercel, indexer, proof server, wallet connector, and any analytics endpoint;
- browser storage keys and values after reload;
- actual prover location and whether any secret or raw credential leaves the local session;
- public linkage remaining in the contract, commitment tree, nullifier set, recipient, and claim/payout records.

## Timing labels

No hosted proving or transaction timing was measured. Future evidence must label each number as browser preparation time, real Compact/Midnight proving time, transaction submission time, or confirmed chain-readback time. Local compilation and generated-circuit tests must not be reported as hosted proving times.

## Exact blocker and next action

Phase 5 must first produce a confirmed `deployments/preprod.json` and matching `deployments/preprod-circuit-bundle/`. Then configure separate dedicated organizer and contributor test accounts privately, start the compatible local prover, and run the Phase 6 WSL/Linux prebuilt workflow:

```bash
vercel pull --yes --environment=preview
npm ci
npm run build:vercel
vercel build
vercel deploy --prebuilt
```

Only after the returned Preview URL passes the hosted matrix should the same verified manifest be used for `vercel --prod --prebuilt` and public-alias verification.
