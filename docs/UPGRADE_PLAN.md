<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks upgrade plan

This is the prioritized implementation plan produced by Phase 0. It preserves the current Compact contract design, Midnight.js, npm workspaces, React/Vite, and ProofPerks branding. Each phase must update [CODEX_HANDOFF.md](./CODEX_HANDOFF.md) with commands and actual results before the next phase starts.

## P0 — baseline completed

- Audited the tree, workspace scripts, lockfile, contract, witnesses, deployment script, UI providers, tests, and docs.
- Added [ENVIRONMENT.md](./ENVIRONMENT.md), this plan, and a read-only `npm run doctor` command with safety tests.
- Confirmed the official target row: Compact toolchain `0.31.1`, compact-runtime `0.16.0`, compact-js `2.5.1`, ledger-v8 `8.1.0`, Midnight.js/testkit `4.1.1`, DApp Connector API `4.0.1`, Wallet SDK `1.2.0`, and Preprod proof server `8.1.0`.
- Confirmed this checkout is not yet a reproducible live-validation environment: WSL has Compact but no Linux Node executable and no Docker integration.

## P1 — reconcile runtime and artifact provenance — completed

Priority: blocking.

1. Pinned the compatible runtime set as one coordinated dependency change. The installed testkit-compatible Wallet SDK `1.1.0` is documented as an exception to the matrix's `1.2.0` row until a compatible testkit release is available.
2. Regenerated `package-lock.json`; `npm ls` now verifies one `onchain-runtime-v3` identity across packages.
3. Replaced the stale declaration sentinel with exit-code, timeout, declaration, artifact, and manifest validation.
4. Made `contract/managed` the single generated source and package/UI consumer input, with a source digest and artifact hashes in `manifest.json`.
5. The compiler wrapper prints the Compact toolchain/compiler versions and circuit/artifact counts; Linux setup remains documented and awaits the missing WSL Node/Docker prerequisites.

Acceptance evidence: clean `npm ci`, one runtime version in the graph, compile exit 0, generated source hash recorded, and a testkit load that uses the exact generated tree.

## P2 — correct private-input handling and API boundaries — completed

Priority: high.

- Replaced truncating text conversion with strict 32-byte hex validation and cryptographically random local secret/anchor helpers.
- Remove issuer secrets and contributor credentials from `VITE_*` configuration and any browser-facing deployment configuration. Keep only public contract address, public issuer key, and network endpoints in Vite variables.
- Make private-state storage account-scoped, encrypted, and explicitly disposable. Never use wallet seeds as storage passwords or identifiers when a public wallet address is available.
- Validated the installed provider boundary and retained an absolute HTTP(S) artifact base URL.
- Add user-safe error mapping and redaction tests. Do not return secrets, full witnesses, serialized private state, or arbitrary provider response bodies.

Acceptance evidence: tests prove 32-byte input validation, no secret in built JS or Vite configuration, provider construction succeeds, and a wallet connection reads public state without private-state persistence.

## P3 — contributor operations and funding — partially completed

Priority: high.

- Add contributor claim controls and a private Merkle-path acquisition flow. The current UI is organizer-only; it cannot complete a contributor claim.
- Recompute or retrieve a fresh path against the current root at claim time. A path captured before another approval is stale.
- Separate and label: proof generation, transaction submission, and confirmed ledger state. Read back public state after confirmation instead of trusting a call return shape.
- Added issuer-authenticated native-token funding through `fund_reward_pool`, separate from the public budget cap, plus reservation/discharge accounting and retry-safe payout state. Live funding and confirmed-state readiness checks remain pending.
- Keep payout as a separate transaction and verify amount, recipient, paid-nullifier set, and budget after confirmed state.
- Phase 4 now provides the browser contributor flow, latest-tree path preparation, separate Claim/Collect Reward controls, encrypted backup/import, and public status restoration. Live wallet/prover confirmation remains pending.

Acceptance evidence: a contributor can approve, claim, and observe confirmed public state on a configured local or Preprod environment; payout is verified by ledger delta and token balance, not a submitted transaction ID alone.

## P4 — real testkit coverage and concurrency — partially completed

Priority: high.

- Added the pinned project-scoped `contract/compose.yml`; it still needs to be started in an environment with Docker/WSL integration or replaced by a configured remote environment.
- Replaced broad negative assertions with expected failure messages plus unchanged-state checks.
- Test tampered points with the original approved commitment's valid membership path, and test an approved-below-threshold credential with its valid path.
- Added generated integration coverage for issuer authorization, invalid paths, duplicate claims, revocation-before-claim, recovery, payout-success, reservation, recipient binding, duplicate payout, insufficient funds, and exhausted budget. Payout-failure retry and revocation-after-claim remain to be exercised against live testkit state.
- Added `npm run test:release`, which fails on skipped or zero integration tests, and saves sanitized output under `docs/evidence/`.
- Add a real concurrent-claim test with confirmed state. The current load runner is a synchronous reference simulation and cannot measure proof-server contention or on-chain races.

Acceptance evidence still outstanding: no skipped tests in the live-validation report; each rejection names the intended assertion; proving, submission, and confirmation timings are reported separately; concurrency results include failure rate and race diagnosis.

## P5 — deployment and pilot

Priority: after P1–P4.

- Run the Preprod deployment only with a funded wallet and local proof server, and record public contract/transaction identifiers only.
- Verify UI wallet connection, organizer approval, contributor claim, revocation, recovery, and separate payout on the selected network.
- Run the 3–5 contributor pilot using the existing runbook and export only the allowed aggregate fields.
- Update README and walkthrough with actual deployment and test evidence; never promote a simulation or skipped test to live evidence.

## Explicitly out of scope for this plan

No secret rotation policy, custom token economy, multi-campaign redesign, production audit, or mainnet deployment is implied by Phase 0. Those require separate product and security decisions.
