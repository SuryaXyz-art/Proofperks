# Wave progress

## Wave 2 — ProofPerks is live on Midnight Preprod

**Live app:** https://proofperks.vercel.app
**Contract (Preprod):** `ad1bac915c3099af6dc015f67b30d9cbdf62e76c827fd95dddc68aa8d63547d5`
**Evidence:** [`deployments/preprod.json`](../deployments/preprod.json) · [`docs/evidence/preprod-smoke-2026-09-29.json`](./evidence/preprod-smoke-2026-09-29.json)

### What shipped this wave

- **Deployed and funded on Preprod.** The ProofPerks Compact contract is deployed (tx `31998e1f…77357c`), and its reward pool is funded with 10,000 base units through the issuer-authenticated `fund_reward_pool` circuit.
- **Full private claim flow executed on-chain, twice.** Issuer approval → zero-knowledge eligibility claim → payout. Each run paid exactly 1,000 units to the bound recipient and recorded a one-time nullifier. Latest run: approval `149f13ad…884e26`, claim `3df720de…211a5e`, payout `b626e75d…beba22`.
- **Hosted organizer console.** The React console is live on Vercel against this deployment. The build refuses to publish unless all 28 circuit artifacts match the deployment record by hash. In a real browser with no wallet, it renders live public campaign state: approved commitments, claims, remaining budget and reward per claim.
- **Hosted browser E2E, 10/10 on production.** `npm run e2e:hosted` drives the live console in headless Chrome as a real user through a DApp-connector wallet: connect → organizer approves → eligibility check → altered points rejected → ZK claim → collect → double claim blocked. [Evidence](./evidence/hosted-e2e-2026-09-29.json).
- **Headless wallet tooling.** `npm run wallet:preprod` (address / status / register-dust) takes a fresh wallet from faucet to DUST-funded. Wallet sync is checkpointed, so the multi-hour first Preprod sync resumes in seconds on later runs.

### Integration issues found and fixed

Going from a compiling contract to a live deployment surfaced issues that only appear on a real network:

- Contract calls were rejected as `NotNormalized` (1010 / custom error 117) because the wallet computed a zero fee. Fixed with a configurable DUST fee overhead.
- The generated `ledger()` could not read indexer state (compact-runtime vs ledger-v8 class mismatch). Fixed with a serialization bridge in the CLI and the browser.
- The indexer's balance query returned nothing for contracts. The pool balance is now read from confirmed contract state.
- Wallet and recipient addresses were serialized as `[object Object]`. Fixed.
- The deployment bundle was missing its manifest, which blocked the gated Vercel build. Fixed.
- Browser claims failed because the wallet's bech32 address was passed where hex is required. Fixed and covered by the hosted E2E.
- "Check eligibility" now checks approval, revocation and threshold, and errors are shown to contributors, not only in the organizer sidebar. Contributor mode no longer shows the organizer workspace.
- Secret inputs in the console now opt out of browser autofill and password managers, consistent with the session-only privacy boundary.

### Next wave

- Record a session with the Lace extension itself, and extend the hosted E2E to revocation, recovery, wrong-network and prover-unavailable cases.
- Run the supervised 3–5 contributor pilot from [`pilot-runbook.md`](./pilot-runbook.md) and publish aggregate metrics.
- Replace the session-only approval queue with a durable intake for pilot operations.
