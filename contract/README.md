<!-- SPDX-License-Identifier: Apache-2.0 -->

# Compact contract

This directory contains the ProofPerks Compact source and generated artifacts.

The initial data-model skeleton is [src/proofperks.compact](./src/proofperks.compact).
It models one campaign, issuer-approved commitment leaves, Merkle membership
proofs, and one-use claim nullifiers. The package compiles with Compact 0.31.x,
the toolchain used by the Preprod deployment flow.

Compile and build the generated wrapper with:

```powershell
npm run compile --workspace @proofperks/contract
npm run build --workspace @proofperks/contract
```

On Windows, run the Compact command from WSL. Native Windows is not supported
by Compact.

Tests are in [test/proofperks.test.mjs](./test/proofperks.test.mjs) and use
Node's built-in `node:test` runner. They import the generated wrapper and ZK
assets from `contract/managed`, deploy through Midnight testkit, and exercise
the three submission scenarios with real Compact proof calls. Start Docker
Desktop (or configure `MN_TEST_ENVIRONMENT`) before running them. If testkit
infrastructure is unavailable, the tests skip explicitly; they never fall
back to a JavaScript mock.
