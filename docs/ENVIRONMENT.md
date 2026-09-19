<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks environment baseline

This document pins the Phase 0 target for Midnight Preprod and records what was actually observed in this checkout on 2026-09-19. It separates the official network row from locally installed versions. Do not treat a compiled artifact, a reachable HTTP endpoint, a skipped test, or a reference simulation as proof of a deployed or paid transaction.

## Compatibility row

The source of truth is Midnight's [official compatibility matrix](https://docs.midnight.network/relnotes/support-matrix). The target row for this repository is:

| Layer | Component | Preprod target | Local observation | Status |
| --- | --- | --- | --- | --- |
| Network | Midnight node | `1.0.2` | Not queried | Target only |
| Ledger | ledger-v8 | `8.1.0` | `8.1.0` through installed protocol packages | Aligned |
| Compiler tool | Compact devtools (`compact`) | `0.5.1` | `0.5.2` in WSL2 | Warning: tool wrapper differs from matrix |
| Compiler | `compact compile` toolchain | `0.31.1` | `0.31.1` | Aligned |
| Language | Compact language | `0.23.0` / `pragma language_version 0.23` | Contract uses `0.23` | Aligned |
| Contract runtime | `@midnight-ntwrk/compact-runtime` | `0.16.0` | `0.16.0` | Aligned |
| Compiled JS | `@midnight-ntwrk/compact-js` | `2.5.1` | `2.5.1` | Aligned |
| Platform | `@midnight-ntwrk/platform-js` | `2.2.4` | `2.2.4` | Aligned |
| On-chain runtime | `@midnight-ntwrk/onchain-runtime-v3` | `3.0.0` | `3.0.0` after Phase 1 override | Aligned |
| Midnight.js | `@midnight-ntwrk/midnight-js-*` | `4.1.1` | `4.1.1` | Aligned |
| Testkit | `@midnight-ntwrk/testkit-js` | `4.1.1` | `4.1.1` | Aligned |
| Wallet connector | `@midnight-ntwrk/dapp-connector-api` | `4.0.1` | `4.0.1` | Aligned |
| Wallet SDK | `@midnight-ntwrk/wallet-sdk` family | `1.2.0` current matrix row | `1.1.0` required exactly by installed `testkit-js@4.1.1` | Coordinated exception |
| Indexer | Midnight indexer | `4.3.3-hotfix` | Endpoint is configured; server version not queried | Target only |
| Proof server | `midnightntwrk/proof-server` | `8.1.0` for Preprod/public network | Deployment script requests `8.1.0`; service not running | Target only |
| Node.js | JavaScript runtime | Node.js `>=22`; reproducible baseline `22.23.2` | Windows `22.23.2`; WSL Linux Node missing | Windows only |
| npm | Package manager | npm `10.x` | Windows `10.9.8`; WSL uses Windows npm shim | WSL setup required |

The official matrix gives the Midnight **network node** version, not the JavaScript Node.js version. ProofPerks therefore uses the repository engine requirement (`>=22`) and records Node.js `22.23.2` as the reproducible local baseline. The JavaScript runtime and the Midnight node are different components.

## Dependency findings

`npm ls` and `package-lock.json` show two runtime copies:

```text
@midnight-ntwrk/midnight-js-protocol -> @midnight-ntwrk/onchain-runtime-v3 3.0.0
@midnight-ntwrk/compact-runtime        -> @midnight-ntwrk/onchain-runtime-v3 3.1.1
```

This is not cosmetic. A cross-package runtime probe rejected a value with `expected instance of StateValue`. The dependency graph must be reconciled in one compatible change; do not update individual Midnight packages independently.

The installed `@midnight-ntwrk/testkit-js@4.1.1` itself depends on `@midnight-ntwrk/wallet-sdk@1.1.0` exactly, while the current official matrix lists Wallet SDK `1.2.0`. ProofPerks pins the testkit-compatible `1.1.0` in this phase rather than forcing an invalid mixed install. Moving to the matrix's `1.2.0` requires a compatible testkit release and must be one coordinated upgrade.

## Reproducible WSL2 Ubuntu setup

Run these commands inside Ubuntu, not in a Windows terminal. Keep the repository in the Linux filesystem when possible; `/mnt/c` works but is slower for npm and file watching.

```bash
sudo apt-get update
sudo apt-get install -y curl ca-certificates build-essential jq

# Install Node.js 22.23.2 with nvm, if nvm is not already installed.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 22.23.2
nvm alias default 22.23.2
nvm use 22.23.2

node --version       # v22.23.2
npm --version        # npm 10.x

curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source ~/.bashrc
compact update 0.31.1
compact --version
compact compile --version
```

Install Docker Desktop on Windows, enable WSL2 integration for this Ubuntu distribution, then verify from the same Ubuntu shell:

```bash
docker info
docker compose version
```

From the Linux checkout:

```bash
npm ci
npm run doctor -- --offline
npm run compile
npm run test:doctor
npm test
```

`npm run compile` writes the one canonical generated artifact tree under `contract/managed`, including the wrapper, proving/verifier keys, ZKIR files, and manifest. The contract package, integration test, CLI, and UI consume or package this tree; there is no second manual compilation. The full integration run uses the pinned project-scoped service configuration in [`contract/compose.yml`](../contract/compose.yml), or a configured remote test environment. The Compose file is a reproducible local harness; it is not evidence that services are available or that a chain transaction has been confirmed.

Start the pinned local harness from the repository root when Docker Desktop and WSL2 integration are available:

```bash
docker compose -f contract/compose.yml up -d
npm run test:integration
docker compose -f contract/compose.yml down
```

The normal integration command reports skipped tests when neither Docker nor `MN_TEST_ENVIRONMENT` is available. The release gate treats those skips as a failure.

## Read-only doctor

```bash
npm run doctor -- --offline
npm run doctor -- --network preprod
npm run doctor -- --network local --json
```

Doctor reports versions, duplicate lockfile packages, generated artifact presence, network selection, and read-only endpoint readiness. It never imports deployment code, reads `.env` or private state, prints environment values, requests funds, submits transactions, or claims that a proof was generated. `PASS` on a health endpoint means only that the endpoint responded with the expected shape; it does not prove compatibility or confirmed chain state.

## References

- [Midnight compatibility matrix](https://docs.midnight.network/relnotes/support-matrix)
- [Midnight installation guide](https://docs.midnight.network/getting-started/installation)
- [Blank Statement artifact build pattern](https://github.com/Pratiikpy/blank-statement/blob/main/scripts/build-contracts.sh)
- [Blank Statement wallet/provider pattern](https://github.com/Pratiikpy/blank-statement/blob/main/app/src/chain.js)
- [Blank Statement real-chain assertion pattern](https://github.com/Pratiikpy/blank-statement/blob/main/tests/circuit-asserts.mjs)
