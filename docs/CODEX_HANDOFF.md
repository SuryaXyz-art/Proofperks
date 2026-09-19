<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks Codex handoff

## Phase 0 — verified baseline

Date: 2026-09-19

### Changes made

- Added [ENVIRONMENT.md](./ENVIRONMENT.md) with the official Preprod compatibility row, locally observed versions, WSL2 setup, and validation boundaries.
- Added [UPGRADE_PLAN.md](./UPGRADE_PLAN.md) with prioritized P1–P5 implementation phases.
- Added `npm run doctor`, a read-only diagnostic command in `scripts/doctor.mjs`.
- Added ten safety/unit tests in `scripts/doctor.test.mjs`; they verify no deployment import, no secret propagation, no arbitrary response/body logging, explicit network selection, artifact checks, and read-only service probes.
- Added `test:doctor` to the root workspace scripts. No Compact source, wallet provider, React UI, deployment behavior, or package version was changed in Phase 0.

### Repository and reference audit

Inspected the workspace tree, root and package scripts, lockfile, `.gitignore`, Compact source, witness callbacks, generated contract declarations, compiler/copy scripts, Preprod deployment, UI providers, React organizer dashboard, testkit integration tests, CLI demo/load/export scripts, walkthrough, pilot runbook/survey, and package type declarations.

Compared relevant patterns from [Blank Statement](https://github.com/Pratiikpy/blank-statement): pinned compiler/build reporting, serving generated ZK artifacts to the browser, wallet provider balancing/submission and public-state refresh, real-chain assertion testing, and explicit distinction between app behavior and chain truth. No Blank Statement code was copied.

### Confirmed findings

1. **Runtime duplication — confirmed.** `npm ls` and the lockfile contain `onchain-runtime-v3@3.0.0` under `midnight-js-protocol` and `3.1.1` under `compact-runtime`. A cross-runtime probe rejected a value with `expected instance of StateValue`.
2. **Compiler validation issue — confirmed.** `contract/scripts/compile.mjs` searches for a constructor declaration ending after `issuerAddress_0`; the generated declaration includes `initialRewardBudget_0: bigint`, so the sentinel is stale and can reject valid output.
3. **Generated-artifact paths — resolved in Phase 1.** `contract/managed` is now the single generated circuit source. The contract package, integration tests, CLI, and UI consume or package that tree; the old `contract/src/managed/proofperks` and `contract/dist/managed` circuit trees are removed by the compiler wrapper.
4. **Secret-string truncation — confirmed.** `ui/src/midnight.js` uses `TextEncoder` and `slice(0, 32)`. Two synthetic values differing only after byte 32 produce identical bytes. This is unsuitable for credential material.
5. **Missing contributor operations — confirmed.** The React UI exposes organizer queue/approval/revocation/reissue and public metrics, but no contributor claim control or claim-path acquisition flow.
6. **Funding gap — confirmed.** Deployment docs require a funded wallet and contract reward pool, but no verified funding/readiness path exists. Wallet fee DUST, wallet tNIGHT, contract tNIGHT, and the public reward budget are distinct states.
7. **Weak negative assertions — confirmed.** The tampered test changes points but does not install a path for the changed commitment; its rejection predicate returns `true` for any error. The duplicate test also accepts any error. They check unchanged nullifier count, but do not prove the intended assertion fired.
8. **Testkit infrastructure gap — confirmed.** `@midnight-ntwrk/testkit-js@4.1.1` defaults to `compose.yml` in the current working directory for local execution. The repository contains no such Compose/service file, so Docker alone cannot make the current suite live.
9. **Browser provider gap — confirmed.** The installed `FetchZkConfigProvider` rejects the UI’s relative `/zkconfig` base URL with `ERR_INVALID_URL`; a browser-safe absolute URL or a provider-specific artifact base is required.

### Phase 1 compatibility decision

The root lock now pins `@midnight-ntwrk/onchain-runtime-v3@3.0.0` directly and overrides the transitive range so `compact-runtime@0.16.0` and `midnight-js-protocol@4.1.1` share one runtime. The project keeps `wallet-sdk@1.1.0` because `testkit-js@4.1.1` requires that version exactly; forcing the official matrix’s `1.2.0` into this testkit would be an invalid mixed dependency set.

### Commands and actual results

| Command | Result |
| --- | --- |
| `git status --short --branch` | Clean at start; Phase 0 changes are now uncommitted local changes. |
| `node --version` | `v22.23.2` on Windows. |
| `npm --version` | `10.9.8` on Windows. |
| WSL `compact --version` | `compact 0.5.2`. |
| WSL `compact compile --version` | `0.31.1`. |
| WSL `node --version` | Not available in the active Ubuntu shell. |
| WSL `docker info` | Docker command unavailable through this WSL distribution. |
| `npm ls ...` | Confirmed runtime duplication and Wallet SDK `1.1.0` transitive mismatch. |
| `npm run test:doctor` | 10 passed, 0 failed. |
| `npm run doctor -- --offline` | Read-only report: 7 failures and 3 warnings, including the exact blockers above; no service requests or deployment occurred. |
| `npm run doctor -- --network preprod` | Node RPC and indexer responded to read-only probes; the local proof-server probe failed because no local server is running. No wallet or transaction operation occurred. |
| `npm test` | 3 integration tests explicitly skipped because Docker/testkit infrastructure is unavailable; 0 passed, 0 failed, 3 skipped. This is not live validation. |
| `wsl -- /home/msi/.local/bin/compact compile /mnt/c/Users/msi/Desktop/ProofPerks/proofperks/contract/src/proofperks.compact /tmp/proofperks-phase0-compile` | Exit `0`; output began `Compiling 5 circuits:`. The temporary output was outside the repository. |

### Security boundaries respected

No wallet seed, issuer secret, contributor credential, evidence, private-state file, `.env` value, or Vite secret was read into the handoff or doctor output. Doctor filters child-process environment variables, never loads dotenv, never imports deployment code, suppresses endpoint response bodies/errors, and never submits a transaction.

### External blockers

- WSL2 Ubuntu needs Node.js `22.23.2` installed inside Linux; the current shell resolves npm to the Windows installation and cannot run Linux Node.
- Docker Desktop WSL integration is not available in the current Ubuntu distribution.
- A testkit Compose/service file or configured supported remote environment is absent from this checkout.
- The lockfile requires one coordinated Midnight dependency reconciliation before live proving or deployment should be attempted.

These blockers do not authorize a deployment claim. They are the next environment/setup tasks, followed by P1 in [UPGRADE_PLAN.md](./UPGRADE_PLAN.md).

## Phase 1 — reproducible build pipeline

Date: 2026-09-19

### Changes made

- Reconciled the Midnight runtime graph with a direct root dependency and override so `compact-runtime@0.16.0` and `midnight-js-protocol@4.1.1` resolve one `onchain-runtime-v3@3.0.0` copy.
- Kept `wallet-sdk@1.1.0` because the installed `testkit-js@4.1.1` requires that exact version. The official matrix's `1.2.0` remains a coordinated future upgrade target, not a forced mixed install.
- Replaced the compiler wrapper with an exit-code-aware, timeout-aware, WSL-aware command runner. It removes stale generated trees, requires the wrapper/types, proving keys, verifier keys, ZKIR files, and manifest, and fails on missing/empty artifacts.
- Removed the obsolete constructor-string check and replaced it with validation against the generated declaration and required circuit declaration.
- Established `contract/managed` as the single generated artifact source. The manifest records source digest, compiler/devtools/Node versions, circuit names, and SHA-256/byte metadata for generated artifacts.
- Updated the contract package, CLI, tests, UI ZK-config copy step, and browser provider to consume the canonical tree. The old second manual compilation path is gone.
- Added CLI typechecking and converted deployment/config imports to TypeScript type-safe imports. The legacy compile command delegates to the root compile; unsupported deploy/interact placeholders now exit with explicit guidance instead of pretending to work.
- Updated the read-only doctor to validate the canonical artifact set, package wrapper, manifest, and resolved dependency counts without loading secrets or deploying.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm install --package-lock-only --ignore-scripts --force` | Exit `0`; lockfile regenerated with the coordinated runtime override. |
| `npm ci --ignore-scripts` | Exit `0`; clean dependency installation, no reported vulnerabilities. |
| `npm run compile` | Exit `0`; Compact devtools `0.5.2`, compiler `0.31.1`; 5 circuits and 24 hashed artifacts generated under `contract/managed`. |
| `npm run typecheck` | Exit `0`; contract and deployment CLI TypeScript checks passed. |
| `npm run test:doctor` | Exit `0`; 10 passed, 0 failed. |
| `npm run build:ui` | Exit `0`; Vite transformed 1249 modules, copied 18 required ZK-config files, and emitted 2 browser WASM assets. Existing dependency warnings remain non-fatal. |
| `npm test` | Exit `0`; three real Compact/testkit tests were explicitly skipped because Docker/remote testkit infrastructure is unavailable. No proving-time claim is made. |
| `npm run doctor -- --offline` | Read-only report: 18/18 canonical artifact files, package wrappers, dependency locks, and compiler validation passed; expected failures remain WSL Node, Docker/Compose, and absent testkit service configuration. |
| `git diff --check` | No whitespace errors; line-ending warnings only. |

### Validation boundary

- Compilation: **verified**.
- Generated artifacts and manifest: **verified**.
- Contract package/typechecking: **verified**.
- Production browser bundle and required WASM handling: **verified**.
- Generated-circuit execution and real proving: **not verified in this environment**; testkit tests skipped.
- Transaction submission and confirmed chain state: **not attempted**.
- Preprod deployment or payout: **not claimed**.

### Remaining blockers and next phase

The current Windows checkout builds successfully, but the documented WSL2 Linux baseline still needs Node.js 22.23.2 and Docker Desktop WSL integration. The repository also lacks the Compose/service configuration required by the current local testkit suite. Vite reports existing browser-bundle warnings for `assert`, `WebSocket`, and large chunks; they do not fail the production build but should be reviewed before a user-facing release.

Next phase: install the reproducible Linux/testkit environment, run the actual generated circuits with real proving timings, then address the Phase 0 private-input, contributor-operation, funding, and negative-assertion gaps from [UPGRADE_PLAN.md](./UPGRADE_PLAN.md).

## Phase 2 — credential protocol and reward accounting

Date: 2026-09-19

### Changes made

- Replaced text-to-secret truncation with strict 32-byte hexadecimal parsing,
  cryptographically random 32-byte generation, and explicit `Uint<64>`/
  `Uint<128>` range helpers.
- Scoped commitment, nullifier, and revocation derivation with credential
  version, network ID, deployment ID, and campaign ID. Exported stable generated
  helpers for issuer-key, commitment, and claim-nullifier derivation.
- Added issuer-key verification in the deployer and browser client. The public
  issuer key is checked against the issuer secret and is never treated as a
  wallet address.
- Added duplicate-approval protection and an explicit depth-5/32-leaf capacity
  check.
- Added issuer-authenticated `fund_reward_pool`, which receives native test
  tokens without changing the public campaign budget cap.
- Added actual-balance-aware reward reservations, recipient-bound reservation
  state, retry-safe payout accounting, and duplicate-payout prevention. The
  pilot reward remains fixed at 1,000 base units.
- Added strict credential, generated-helper, manifest, and protocol-invariant
  checks. See [PROTOCOL_INVARIANTS.md](./PROTOCOL_INVARIANTS.md).
- Documented the issuer trust boundary and the fact that no live public
  transaction transcript was available for stronger Merkle-path privacy claims.

### Compiler fixes during this phase

1. Reservation arithmetic widened beyond `Uint<128>`; the assignment now uses
   an explicit `Uint<128>` cast after the compiler rejected the wider inferred
   range.
2. Compact rejected undisclosed funding input; `fund_reward_pool` now passes
   `disclose(amount)` to `receiveUnshielded`.
3. A repeated WSL build timed out after leaving an incomplete generated output
   directory. Restarting WSL and rerunning the documented compiler restored the
   complete artifact tree. The timeout was treated as failure throughout.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm run compile` | Passed after the fixes; 6 circuits and 28 hashed artifacts generated. |
| `npm run typecheck` | Passed for contract and deployment CLI. |
| `npm run build --workspace @proofperks/ui` | Passed; 1,250 modules transformed and required WASM/ZK assets emitted. Existing Vite dependency warnings remain. |
| `npm run test:doctor` | 10 passed. |
| `npm test` | 5 passed meaningful unit/invariant tests; 3 generated-circuit tests explicitly skipped because Docker/testkit is unavailable. |
| Manifest hash verification | 0 mismatches after the successful compile. |

### Validation boundary

- Compact compilation and generated artifacts: **verified**.
- Credential encoding, range checks, helper derivation, and static protocol invariants: **verified**.
- Real funding transaction, generated proof execution, payout retry, concurrency,
  and confirmed chain state: **not verified** in this environment.
- Public Merkle-path transcript privacy: **not claimed**; live transcript
  inspection remains required.

### Next phase

Install the supported WSL2 Node/Docker/testkit environment and run the expanded
generated-circuit suite against actual ledger state. Specifically validate
funding, reservation races, payout retry, revocation/recovery edge cases, and
the public transcript before changing the privacy documentation.

The earlier Phase 0/Phase 1 follow-up text is superseded by the Phase 2
validation boundary above. No live deployment or payout is implied by these
local results.

## Phase 3 — testing and integration gates

Date: 2026-09-19

### Changes made

- Split the contract test surface into generated-artifact/helper tests and real Compact/testkit integration tests. The integration file uses `contract/managed` through `CompiledContract.withCompiledFileAssets`; it contains no JavaScript state-transition mock.
- Repaired the tampered-points case to reuse the original approved credential's valid Merkle path, so the test reaches the intended commitment mismatch instead of failing because a path is missing.
- Added a valid-path approved-below-threshold case and explicit rejection matching for invalid paths, duplicate claims, issuer authorization, revocation, recovery, insufficient funds, and exhausted campaign budget. Unexpected infrastructure/runtime errors no longer count as a security-test pass.
- Added live-state assertions for reward reservation, recipient binding, payout, duplicate payout, nullifier stability, and budget accounting. The pilot reward remains fixed at 1,000 base units.
- Added the pinned project-scoped `contract/compose.yml` harness and `npm run test:release`. The release command compiles first, requires non-skipped integration tests, rejects zero-test output, and writes sanitized output to `docs/evidence/phase3-release-latest.txt`.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm run test:generated` | Passed: 5 generated-artifact/helper and protocol-invariant tests, 0 skipped. |
| `npm run test:integration` | Exit 0 in ordinary developer mode, but all 9 real integration tests were explicitly skipped because Docker/testkit infrastructure and `MN_TEST_ENVIRONMENT` are unavailable. No proof, transaction, or confirmed chain state was produced. |
| `npm run test:release` | Expected non-zero release-gate result because required integration infrastructure is unavailable; the gate rejects the skips instead of accepting them. Sanitized evidence is written to `docs/evidence/phase3-release-latest.txt`. |
| Refresh attempt after the final recovery assertion | One Compact invocation hung before producing artifacts; it was stopped, and a clean `npm run compile` rerun then passed with 6 circuits and 28 artifacts. The timeout/hang is treated as a failed attempt, not as test evidence. |
| `docker info` | Unavailable in the active Windows/WSL environment; the pinned Compose harness was not started. |
| `git diff --check` | Passed; only existing line-ending conversion warnings appear in `git status`, with no whitespace errors. |

### Validation boundary

- Generated circuit execution/helper checks: **verified** by the 5 passing tests.
- Real proving, transaction submission, confirmed ledger state, payout, funding, reservation races, and transcript inspection: **unavailable** because the required testkit services were not reachable.
- Integration assertions are now meaningful when run: a broad or unrelated error cannot satisfy a negative test, and the release command fails on skipped or zero integration tests.

### Blocker and next phase

The remaining blocker is external testkit infrastructure: install Node.js inside WSL2, enable Docker Desktop WSL integration, start `contract/compose.yml` or configure a supported remote `MN_TEST_ENVIRONMENT`, then rerun `npm run test:release`. Until that run completes with non-skipped tests, there is no verified real proving time or chain-state result to report.

Next phase: execute the pinned environment, inspect failures one at a time, save sanitized non-secret evidence, and measure concurrent-claim/nullifier race behavior before making any live deployment or payout claim.

## Phase 4 — application flow and typed wallet client

Date: 2026-09-19

### Changes made

- Added the typed shared client core in `src/proofperks-client.ts`. It validates wallet network/configuration, required wallet capabilities, deployment addresses, generated-artifact manifests, user-safe errors, credential derivation inputs, and private-state namespaces scoped by account, role, network, and contract.
- Refactored the browser Midnight integration to use that core and added artifact compatibility checks before wallet actions. Public campaign reads now use the Preprod indexer without requiring a wallet.
- Added explicit wallet handling for missing wallet, wrong network, missing prover capability, rejected requests, disconnect, and invalid recipient address.
- Added contributor controls: encrypted credential backup/import, session-only credential import, eligibility read, latest commitment-tree lookup immediately before proving, recipient confirmation, separate `Claim` and `Collect Reward` actions, and public readback of claim/payout status after reload.
- Kept organizer approval, revocation, recovery, and funding controls wallet-gated, with scoped private state and stage/status messages.
- Added focused client tests in `test/client.test.mjs` and the `npm run test:client` command.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed for contract and CLI, including the shared typed client import. |
| `npm run test:client` | Passed: 3 wallet/client validation tests, 0 skipped. |
| `npm run build --workspace @proofperks/ui` | Passed: 1,251 modules transformed; WASM and generated ZK configuration copied into the production bundle. Existing `WebSocket`/large-chunk Vite warnings remain. |
| `npm run test:integration` | Still unavailable: all 9 real testkit scenarios remain skipped because Docker/remote testkit infrastructure is not configured. |
| Live wallet/prover/chain flow | Not run. No wallet secrets were requested or read, and no transaction/deployment/payout is claimed. |

### Validation boundary

- Typed client, wallet/configuration validation, artifact checks, session-only credential handling, and production build: **verified locally**.
- Real Lace/DApp Connector behavior, proof generation, latest-root path retrieval against a live deployment, transaction submission, chain confirmation, and payout collection: **not verified** in this environment.
- Encrypted backup/import is implemented with browser AES-GCM/PBKDF2 and does not persist secrets, but recovery still requires the backup file, password, matching deployment scope, and a compatible connected wallet.

### Remaining blocker and next phase

Phase 4 application code is present and build-verified. Live browser acceptance remains blocked by the same external Preprod/testkit prerequisites recorded in Phase 3. Next phase should run a wallet-backed acceptance pass, verify confirmed ledger readback for approval/claim/payout/revocation/recovery, and then update the submission documentation with observed network evidence only.

## Phase 5 — Preprod deployment path

Date: 2026-09-19

### Changes made

- Reworked the headless deployment CLI around the installed Midnight SDK types. It validates the issuer public key against the issuer secret, compiled manifest/source digest, Preprod wallet configuration, proof-server health, synchronized wallet state, native-token reserve, and positive DUST balance before submission.
- Added bounded waits for wallet sync, deployment, public-state confirmation, and funding confirmation. Wallet shutdown is in `finally`; uncertain transactions are not retried automatically.
- Uses the public unshielded wallet address as the private-state `accountId`, never the wallet seed. Local private-state storage remains password-protected and separate from the deployment record.
- Added a blind-redeployment guard: an existing `deployments/preprod.json` must be manually reviewed before `PROOFPERKS_ALLOW_NEW_DEPLOYMENT=1` can permit another deploy.
- Added `fund:preprod` and `verify:preprod`. Funding reports before/after actual contract native-token balance from the indexer separately from the campaign budget cap. Verification checks deployment digest, campaign, issuer, reward, budget, artifacts, and actual contract balance.
- On a successful deployment, writes `deployments/preprod.json` and preserves the exact manifest-listed circuit bundle under `deployments/preprod-circuit-bundle/`.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed for contract and deployment CLI. |
| `npm run test:client` | Passed: 3 focused client tests. |
| `npm run test:doctor` | Passed: 10 read-only doctor tests. |
| `npm run deploy:preprod --workspace @proofperks/cli` | Refused before wallet access because `PROOFPERKS_ISSUER_SECRET` is not configured in this local environment. No deployment transaction was submitted. |
| `npm run verify:preprod` | Refused because `deployments/preprod.json` does not exist. No chain state was claimed. |
| `npm run fund:preprod` | Not run because there is no confirmed deployment record; the command also requires issuer credentials, wallet funding, DUST, and prover health. |
| Real approval/claim/payout smoke test | Not run; no configured account, deployment, or confirmed funded pool is available. |

### Validation boundary

- Deployment/funding/verification implementation and type checks: **verified locally**.
- Confirmed Preprod address, transaction identifiers, actual funding, proof generation, approval, claim, payout, and sanitized chain evidence: **not available** in this workspace.
- No `deployments/preprod.json` or circuit bundle was created because doing so without a confirmed transaction would be misleading.

### Exact remaining local action

In a private local shell, configure the required values from `cli/.env.example` without sharing them in chat: wallet seed, issuer secret/public key pair, credential network/deployment IDs, private-state password, and a proof-server URL reachable at `/health`. Fund the wallet with native Preprod tokens and DUST, run `npm run compile`, then run `npm run deploy:preprod`. After it writes the confirmed deployment record, run `PROOFPERKS_FUND_REWARD_POOL=1000 npm run fund:preprod`, then `npm run verify:preprod`, and finally run the configured approval/claim/payout smoke adapter. The CLI will stop rather than submit if any prerequisite is missing.

## Phase 6 — guarded Vercel Preview workflow

Date: 2026-09-19

### Changes made

- Added root `vercel.json` for the existing npm workspace: `npm ci`, `npm run build:vercel`, Vite, root directory, and `ui/dist` output.
- Added `scripts/build-vercel.mjs`, which fails closed unless a confirmed `deployments/preprod.json` and its preserved `deployments/preprod-circuit-bundle/` exist. It checks the Preprod network, confirmed address/transaction id, source digest, artifact paths, byte counts, hashes, public issuer key, and public credential scope before building.
- The Vercel build copies only the exact recorded public circuit bundle into `ui/public/zkconfig`, then verifies the built manifest and all hashes again. Private seeds, issuer secrets, private state, and proof-server configuration are rejected as Vercel `VITE_*` inputs.
- Added `VITE_PROOFPERKS_NETWORK=preprod` to the public UI example and recorded credential scope in future deployment manifests.
- Kept the normal `npm run build --workspace @proofperks/ui` path available for local development. The Vercel SPA rewrite excludes circuit/static asset paths so missing assets cannot be disguised as HTML.
- Linked the authenticated Vercel account to project `proofperks` and set project settings to Node 22.x, root directory, `npm ci`, `npm run build:vercel`, `ui/dist`, and Vite. No private environment variables were added.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm ci` | Passed at repository root; 398 packages added, 0 vulnerabilities. Existing deprecation warnings remain. |
| `node --check scripts/build-vercel.mjs` | Passed. |
| `npm run build --workspace @proofperks/ui` | Passed: 1,251 modules transformed; browser WASM assets were emitted. Existing SDK `WebSocket` and large-chunk warnings remain. |
| `npm run build:vercel` | Correctly refused: `deployments/preprod.json` is missing. This is expected because Phase 5 has no confirmed Preprod deployment. |
| `vercel pull --yes --environment=preview` | Passed; linked project and wrote ignored `.vercel` metadata. |
| `vercel project update proofperks ...` | Passed; verified settings and changed Vercel Node runtime from 24.x to 22.x. |
| `vercel build` on Windows | Could not run the build sandbox: Vercel returned `spawn cmd.exe ENOENT` after its install step. |
| `wsl.exe -d Ubuntu ...` | Ubuntu-24.04 is stopped; the available shell reports Node 18.19.1, npm 9.2.0, and no `vercel` command. The requested WSL/Linux prebuilt workflow therefore remains unavailable in this workspace. |
| `vercel deploy --prebuilt` | Not run: no verified prebuilt output exists, and deploying without the exact Preprod manifest would be unsafe. |

### Validation boundary

- Repository configuration, fail-closed artifact validation, local React/Vite production build, WASM emission, Vercel project settings, and secret-safety checks: **verified locally**.
- Exact Preprod circuit bundle, public contract configuration, `vercel build`, `vercel deploy --prebuilt`, Preview URL, HTTPS browser access, public campaign reads, and local-prover access over HTTPS: **not verified**.
- No deployment, payout, or live chain state is claimed. The Vercel project exists, but no Preview deployment was created.

### Blocker and next phase

Phase 6 implementation is complete, but a real Preview URL is blocked by the missing confirmed Preprod deployment manifest/bundle and the unavailable prepared WSL/Linux Vercel toolchain. The exact local action is: start/configure Ubuntu WSL2 with Node 22 and Vercel CLI, complete the private Phase 5 deployment/funding/smoke flow so it writes `deployments/preprod.json` and `deployments/preprod-circuit-bundle/`, provide only the matching public `VITE_PROOFPERKS_*` values in Vercel Preview, then run `vercel pull --yes --environment=preview`, `npm ci`, `npm run build:vercel`, `vercel build`, and `vercel deploy --prebuilt`. Next phase should verify the returned HTTPS URL, route behavior, exact circuit bytes, browser/WASM imports, and public readback without exposing private inputs.

## Phase 7 — hosted E2E and Production publication

Date: 2026-09-19

### Changes made

- Added [`docs/HOSTED_E2E.md`](./HOSTED_E2E.md) with a sanitized hosted-validation matrix, timing-label requirements, request/storage inspection checklist, and explicit evidence boundaries.
- Inspected the linked Vercel project, Preview and Production environment-variable lists, and deployment list. No deployments or environment variables were present.
- Confirmed that no `deployments/preprod.json`, matching public circuit bundle, dedicated organizer account, dedicated contributor account, or configured live prover is available locally.

### Commands and actual results

| Command | Result |
| --- | --- |
| `vercel project inspect proofperks` | Project settings verified: Vite, Node 22.x, root directory, `npm ci`, `npm run build:vercel`, `ui/dist`. |
| `vercel ls proofperks --limit 10` | No deployments found. |
| `vercel env ls preview` / `vercel env ls production` | No environment variables configured. |
| `npm test` | 5 passed, 9 skipped because the Midnight testkit is unavailable. Skipped tests are not hosted evidence. |
| `npm run typecheck` | Passed for contract and CLI. |

### Validation boundary

- Hosted organizer approval, contributor import, fresh Merkle path, claim, separate payout, exact recipient/reward readback, reload, failure-state matrix, browser request/storage inspection, prover-location inspection, and Production alias verification: **not run**.
- No website URL, Preprod address, transaction receipt, payout, or chain state is claimed.
- The exact blocker and required private local action are recorded in `docs/HOSTED_E2E.md`.

### Next phase

Complete Phase 5 with separate funded test accounts and a live compatible prover, then run the Phase 6 prebuilt Preview flow. Only after the hosted evidence matrix passes should `vercel --prod --prebuilt` be executed and its public alias recorded.

## Phase 8 — reproducible release tooling and evidence readiness

Date: 2026-09-19

### Changes made

- Added `.github/workflows/ci.yml` for Node 22.23.2, Compact 0.31.1 installation, pinned `npm ci`, compilation, generated-artifact validation, typechecking, generated-contract tests, client/doctor tests, and the UI production build. A separate CI job visibly reports that required live integration remains incomplete rather than treating skipped tests as proof.
- Added `.github/workflows/vercel-prebuilt-release.yml`, restricted to manual or version-tag runs with GitHub environment protection. It requires an immutable deployment manifest/bundle, uses only repository-read permissions, and keeps Vercel credentials out of pull-request workflows. It never redeploys the contract.
- Added `scripts/validate-artifacts.mjs` and `npm run validate:artifacts` to verify every generated artifact byte count and SHA-256 hash against `contract/managed/manifest.json`.
- Added `cli/src/preprod-demo-adapter.ts` for the generated Compact contract, Midnight.js providers, wallet, indexer, proof server, current Merkle path, approval, claim, payout, and confirmed public-state adapter boundary. It measures complete transaction duration; isolated proving duration remains unavailable unless independently provided by the proof infrastructure.
- Updated the CLI demo and pilot exporter to separate simulation, complete transaction, and independent proving timings. Timing fields require fixed measurement provenance, and failure categories use a fixed enum.
- Updated README, pilot runbook, and the submission checklist with actual repository/Vercel project identifiers, setup requirements, verified local results, and explicit blocked/pending live evidence. No pilot outcomes or live deployment claims were added.

### Commands and actual results

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed for contract and CLI, including the live adapter. |
| `npm run validate:artifacts` | Passed: 28 generated artifacts matched manifest hashes and byte counts. |
| `npm run test:generated` | Passed: 5 tests, 0 skipped. |
| `node cli/export-pilot-metrics.mjs --input docs/pilot-events.example.jsonl ...` | Passed; simulation metrics were reported separately, while transaction/proving metrics were `n/a`. |
| `PROOFPERKS_DEMO_MODE=reference npm run demo --workspace @proofperks/cli` | Passed 3/3 reference scenarios; output labels them `reference_simulation`, not Compact proving. |
| Required real integration | Still blocked; testkit services, confirmed Preprod deployment, dedicated accounts, prover, and pilot participants are unavailable. |

### Validation boundary

- Reproducible CI/release definitions, artifact integrity, typechecking, generated tests, metrics provenance, and reference demo behavior: **verified**.
- Real CLI adapter execution, Preprod approval/claim/payout, independently measured proving, hosted Vercel release, and supervised 3–5-person pilot: **blocked/pending**; no fabricated evidence was added.

### Next phase

Run the protected release workflow only after Phase 5 supplies `deployments/preprod.json` and its exact public circuit bundle, then execute the pilot runbook with separate accounts and publish aggregate metrics only from sanitized event logs.
