# Hosted E2E validation

Date: 2026-09-19

## Result

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
