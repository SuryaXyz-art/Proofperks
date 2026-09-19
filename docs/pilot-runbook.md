<!-- SPDX-License-Identifier: Apache-2.0 -->

# ProofPerks Wave 2 pilot runbook

## Pilot goal

Run a small, supervised pilot with 3–5 real community contributors to learn whether an approved private reward claim feels understandable, trustworthy, and fast enough to use. This is a product-learning exercise, not a production rewards program.

Important current-scope note: the repository has organizer and contributor controls, but their live wallet/prover/chain lifecycle has not been verified here. Use a configured live deployment adapter or hosted wallet session for the supervised run; do not describe a local build or reference harness as live evidence.

## Before inviting contributors

The facilitator should complete this checklist:

- [ ] Use a fresh single-campaign Preprod deployment or a clearly reset pilot campaign.
- [ ] Confirm the campaign threshold, fixed reward amount, and public reward budget.
- [ ] Fund the contract reward pool and confirm the proof server is reachable.
- [ ] Run the organizer dashboard locally and verify wallet connection, public metrics, and one test approval.
- [ ] Verify the live adapter can call `approveContribution`, `claimReward`, and, if used, `payoutReward`.
- [ ] Prepare a private 1:1 channel for sharing the temporary contributor secret. Never request it in a public chat.
- [ ] Prepare a safe JSONL event log using only the schema below.
- [ ] Explain that Preprod tokens have no monetary value and that the issuer still decides whether work merits approval.

Suggested participant mix: 3–5 contributors with different levels of Web3 and wallet experience. Include at least one first-time Midnight wallet user if possible. Use facilitator labels such as `P01`–`P05` in your private notes only; do not put those labels or any other participant identifier in the metrics event log.

## Contributor onboarding (repeat for each person)

1. **Invite and consent.** Explain the purpose, expected time (10–15 minutes), testnet-only reward, what will be measured, and that participation is optional. Ask permission to record anonymous feedback. Do not collect names, email addresses, social handles, screenshots containing wallet addresses, or contribution evidence in the metrics file.

2. **Wallet readiness.** Ask the contributor to install and unlock the supported Midnight wallet, switch to Preprod, and confirm they understand that the public recipient address is needed for payout. The facilitator should never ask for a seed phrase or private key.

3. **Create a temporary secret.** Have the contributor generate or receive a random 32-byte secret in the private session. They must keep it available for the claim and delete it after the pilot. Never paste it into a shared document, public chat, survey, analytics tool, or event log.

4. **Collect contribution evidence privately.** The issuer reviews the contributor’s work through the normal community process. The circuit does not verify real-world completion; the issuer is the approval authority.

5. **Approve.** In the organizer dashboard, enter the contributor secret and approved points into the session-only queue. Confirm the points meet the campaign threshold, then select **Approve on-chain**. Record only a safe approval event after the transaction succeeds:

   ```json
   {"type":"approval","status":"success"}
   ```

6. **Claim.** Until the contributor UI exists, the facilitator runs the configured live CLI adapter in a private terminal. The contributor supplies the same secret locally and the wallet recipient address. Measure the wall-clock proving duration returned by the adapter or by the CLI timer. Record only one safe claim event:

   ```json
   {"type":"claim","status":"success","simulationTimeMs":842.4,"measurementProvenance":"reference_simulation"}
   ```

   A rejected attempt is recorded without the secret, commitment, nullifier, or wallet address:

   ```json
   {"type":"claim","status":"failure","failureCategory":"duplicate_claim","transactionTimeMs":91.2,"measurementProvenance":"live_midnight_transaction"}
   ```

7. **Payout and confirmation.** If the pilot includes payout, run the separate payout step after the successful claim. Tell the contributor the fixed test-token amount and wait for wallet/indexer confirmation. Do not count a payout retry as a second claim.

8. **Close the session.** Ask the contributor to confirm the experience is complete, clear the secret from clipboard/history and temporary notes, and complete the survey immediately while the interaction is fresh.

## Safe pilot event schema

The exporter accepts JSONL, one event per line. These are the only allowed fields:

| Field | Allowed values | Meaning |
| --- | --- | --- |
| `type` | `approval` or `claim` | Operation category |
| `status` | `success` / `accepted` or `failure` / `rejected` | Outcome |
| `simulationTimeMs`, `transactionTimeMs`, `provingTimeMs` | non-negative number, claims only | Keep simulation, complete transaction, and independently measured proving durations separate. |
| `measurementProvenance` | fixed enum | Required with any timing: `reference_simulation`, `compact_testkit`, `live_midnight_transaction`, `pilot_observation`, or `unavailable`. |
| `failureCategory` | fixed enum | Use `invalid_credential`, `threshold_not_met`, `duplicate_claim`, `payout_duplicate`, `invalid_merkle_path`, `revoked_credential`, `wallet_rejected`, `wrong_network`, `prover_unavailable`, `insufficient_rewards`, `insufficient_budget`, `issuer_unauthorized`, `transaction_failed`, or `unknown_failure`. |

Do not add `participantId`, names, wallet addresses, secrets, raw points, commitments, nullifiers, transaction hashes, or free-form error messages. The exporter rejects unsupported fields as a safety check.

## Export the Wave 2 report metric

From the repository root:

```powershell
npm run pilot:export -- --input .\pilot-events.jsonl --output .\pilot-metrics.json
```

The output contains aggregate approval/claim attempts, successful counts, failed counts, average proving time across timed claim attempts, and failure-category counts. It contains no participant-level rows. Keep the raw event log and generated report out of version control; the repository `.gitignore` already excludes the default filenames.

## Facilitator debrief

After the last participant, compare the report with survey responses. Look for: whether wallet setup blocked anyone, whether privacy language was understood, whether proving time felt acceptable, which failure messages caused confusion, and whether participants would use the flow again. Report the number of participants separately from the exporter only if it cannot identify them.

## Stop conditions

Pause the pilot immediately if a seed phrase is requested, a secret appears in a public channel or event log, a transaction is sent to the wrong address, the contract state is not the intended campaign, or a contributor cannot distinguish Preprod tokens from real value. Record the incident category only; do not copy sensitive contents into the report.

## Known limitations

- The pending approval queue is session-only and not a durable intake system.
- The contributor claim path is operator-assisted until the contributor UI is implemented.
- The measurements are pilot observations, not a security audit or production SLA.
- Issuer approval remains trusted; ProofPerks proves an approved credential meets the rules but does not verify real-world task completion.
