<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks protocol invariants

These are the security and accounting properties Phase 2 preserves. They are
contract properties, not claims about a live deployment; the generated-circuit
tests remain skipped until a supported Midnight testkit environment is
available.

## Credential format

- Secrets and contributor anchors are exactly 32 bytes. Human-readable text is
  rejected; it is never UTF-8 encoded and truncated.
- New secrets and anchors come from a cryptographically secure random source.
- Every commitment, claim nullifier, and revocation marker includes credential
  version 1, the configured 32-byte network scope, deployment scope, and
  campaign ID.
- The issuer key is a hash-derived Compact key, not a wallet address. Runtime
  clients verify that the configured public issuer key matches the issuer
  secret before submitting issuer operations.
- Points use `Uint<64>` validation. Campaign reward budgets and funding amounts
  use `Uint<128>` validation. The fixed pilot reward is exactly 1,000 native
  Preprod test-token base units.

## Approval and claim invariants

- Only a witness that derives the configured issuer key can approve, revoke,
  reissue, or fund the reward pool. This is issuer authentication, not proof
  that the real-world contribution happened; the issuer remains trusted to
  judge evidence.
- Approved commitments are unique and the depth-5 tree rejects the 33rd leaf.
  The tree therefore supports at most 32 initial or replacement approvals.
- A claim must prove the derived commitment's membership, threshold, current
  revocation status, claim nullifier absence, and contributor-marker absence.
- The contributor marker means a reissued secret under the same anchor cannot
  create a second claim after the old credential has claimed.

## Funding, reservation, and payout invariants

- `rewardBudget` is a public campaign cap, not a balance assertion.
- `fund_reward_pool` receives native test tokens into the contract without
  increasing the campaign cap.
- Claim acceptance requires actual unreserved native balance for the reward and
  available cap. It creates one recipient-bound reservation and increments
  `reservedRewardBudget`.
- Payout consumes only the existing reservation, sends exactly the reserved
  amount to the bound recipient, marks the nullifier paid, discharges the
  reservation, and decrements the campaign cap.
- If payout fails, the transaction reverts before those state changes. The
  claim nullifier remains recorded and the same payout can be retried; another
  claim cannot be created.
- A paid nullifier cannot be paid twice, and payout cannot create or alter
  membership, threshold, revocation, or claim nullifier state.

## Revocation and transcript boundary

- Revocation is future-facing. Revoking after a claim does not undo the claim
  or reverse a completed payout.
- The source currently passes `disclose(path)` to the Merkle root check. This
  means this repository does not claim that the membership path is hidden from
  public transaction data.
- No live public transaction transcript was available during Phase 2 because
  the Midnight testkit/Docker environment is not configured. A future live
  validation phase must inspect the actual transaction/proof transcript before
  making stronger Merkle-path privacy claims.
