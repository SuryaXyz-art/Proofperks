// SPDX-License-Identifier: Apache-2.0

/**
 * Reference-mode Wave 2 pilot/load runner.
 *
 * This intentionally models the Compact contract's claim transition:
 * membership and threshold checks happen before one synchronous, atomic
 * nullifier-set update. It does not measure a real Midnight proof server.
 * Set PROOFPERKS_LOAD_N to 1..32; depth-5 commitments support 32 leaves.
 */

import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const N = Number(process.env.PROOFPERKS_LOAD_N ?? 32);
const EVENT_OUTPUT = process.env.PROOFPERKS_LOAD_EVENTS ?? 'pilot-events.jsonl';
const CAMPAIGN_ID = 'campaign-1';
const THRESHOLD = 100;
const APPROVED_POINTS = 125;

if (!Number.isInteger(N) || N < 1 || N > 32) {
  throw new Error('PROOFPERKS_LOAD_N must be an integer from 1 through 32 (depth-5 tree capacity).');
}

function digest(...parts) {
  const hash = createHash('sha256');
  for (const part of parts) {
    const value = String(part);
    hash.update(`${value.length}:${value};`);
  }
  // The Compact contract uses persistentHash; SHA-256 keeps this reference
  // harness deterministic and cryptographic without requiring generated code.
  return hash.digest('hex');
}

function commitment({ anchor, secret, points }) {
  return digest('proofperks:contribution', CAMPAIGN_ID, anchor, secret, points);
}

function claimNullifier(secret) {
  return digest('proofperks:nullifier', CAMPAIGN_ID, secret);
}

function contributorNullifier(anchor) {
  return digest('proofperks:contributor', CAMPAIGN_ID, anchor);
}

function nextTurn() {
  return new Promise((resolve) => setImmediate(resolve));
}

class AtomicReferenceLedger {
  #approved = new Set();
  #usedNullifiers = new Set();
  #usedContributorNullifiers = new Set();

  async approve(input) {
    await nextTurn();
    this.#approved.add(commitment(input));
  }

  async claim(input) {
    const started = performance.now();
    const leaf = commitment(input);

    // Simulate concurrent proof generation / network scheduling before the
    // state transition. The actual Compact circuit performs its checks and
    // inserts in one ledger transaction.
    await nextTurn();
    if (!this.#approved.has(leaf)) throw new Error('proof verification failed: commitment is not approved');
    if (input.points < THRESHOLD) throw new Error('proof verification failed: threshold not met');

    const nullifier = claimNullifier(input.secret);
    const contributorMarker = contributorNullifier(input.anchor);

    // Critical section: no await between check and insert. This mirrors the
    // ledger's atomic state transition and prevents a check-then-insert race.
    if (this.#usedNullifiers.has(nullifier)) throw new Error('proof verification failed: nullifier already exists');
    if (this.#usedContributorNullifiers.has(contributorMarker)) throw new Error('proof verification failed: contributor already claimed');
    this.#usedNullifiers.add(nullifier);
    this.#usedContributorNullifiers.add(contributorMarker);

    return { proofGenerationMs: performance.now() - started, nullifier };
  }

  nullifierCount() {
    return this.#usedNullifiers.size;
  }
}

function percentile(values, percentileRank) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentileRank * sorted.length) - 1));
  return Number(sorted[index].toFixed(3));
}

function summarizeClaimAttempts(attempts) {
  const successful = attempts.filter((attempt) => attempt.ok);
  const provingTimes = successful.map((attempt) => attempt.proofGenerationMs);
  const failed = attempts.length - successful.length;
  return {
    attempted: attempts.length,
    successful: successful.length,
    failed,
    failureRatePercent: Number(((failed / attempts.length) * 100).toFixed(3)),
    averageProvingTimeMs: provingTimes.length === 0
      ? null
      : Number((provingTimes.reduce((sum, value) => sum + value, 0) / provingTimes.length).toFixed(3)),
    p95ProvingTimeMs: percentile(provingTimes, 0.95),
  };
}

async function run() {
  const ledger = new AtomicReferenceLedger();
  const participants = Array.from({ length: N }, (_, index) => ({
    anchor: `pilot-anchor-${index}`,
    secret: `pilot-secret-${index}`,
    points: APPROVED_POINTS,
  }));

  await Promise.all(participants.map((participant) => ledger.approve(participant)));
  const events = participants.map(() => JSON.stringify({ type: 'approval', status: 'success' }));

  const validAttempts = await Promise.all(participants.map(async (participant) => {
    const started = performance.now();
    try {
      const result = await ledger.claim(participant);
      return { ok: true, proofGenerationMs: result.proofGenerationMs ?? performance.now() - started };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }));
  const validSummary = summarizeClaimAttempts(validAttempts);
  for (const attempt of validAttempts) {
    events.push(JSON.stringify(attempt.ok
      ? { type: 'claim', status: 'success', provingTimeMs: attempt.proofGenerationMs }
      : { type: 'claim', status: 'failure', failureCategory: 'unknown_failure' }));
  }

  // Race probe: all contenders use the same old/new identity binding. Exactly
  // one claim should commit; every other rejection is expected duplicate
  // protection, not a load-test failure.
  const raceLedger = new AtomicReferenceLedger();
  const raceParticipant = { anchor: 'race-anchor', secret: 'race-secret', points: APPROVED_POINTS };
  await raceLedger.approve(raceParticipant);
  const raceAttempts = await Promise.all(Array.from({ length: N }, async () => {
    const started = performance.now();
    try {
      const result = await raceLedger.claim(raceParticipant);
      return { ok: true, proofGenerationMs: result.proofGenerationMs ?? performance.now() - started };
    } catch (error) {
      return { ok: false, proofGenerationMs: performance.now() - started, error: error instanceof Error ? error.message : String(error) };
    }
  }));
  const raceSummary = summarizeClaimAttempts(raceAttempts);
  const acceptedRaceClaims = raceAttempts.filter((attempt) => attempt.ok).length;
  const raceConditionFound = acceptedRaceClaims !== 1 || raceLedger.nullifierCount() !== 1;
  await writeFile(EVENT_OUTPUT, `${events.join('\n')}\n`, 'utf8');
  console.log('PROOFPERKS WAVE 2 PILOT LOAD');
  console.log(`Mode: reference model (N=${N}, max 32 commitments)`);
  console.log(`Safe pilot event log (valid batch only): ${EVENT_OUTPUT}`);
  console.log('The intentional race-probe rejections are reported separately and are not counted as pilot failures.');
  console.log('\nVALID PILOT CLAIM BATCH');
  console.log(`  attempts: ${validSummary.attempted}`);
  console.log(`  successes: ${validSummary.successful}`);
  console.log(`  failures: ${validSummary.failed}`);
  console.log(`  failure rate: ${validSummary.failureRatePercent}%`);
  console.log(`  average proving time: ${validSummary.averageProvingTimeMs} ms`);
  console.log(`  p95 proving time: ${validSummary.p95ProvingTimeMs} ms`);
  console.log('\nNULLIFIER RACE PROBE');
  console.log(`  concurrent contenders: ${N}`);
  console.log(`  accepted claims: ${acceptedRaceClaims}`);
  console.log(`  final nullifier count: ${raceLedger.nullifierCount()}`);
  console.log(`  expected duplicate rejections: ${raceSummary.failed}`);
  console.log(`  race condition: ${raceConditionFound ? 'FOUND' : 'NONE FOUND'}`);
  if (raceConditionFound) process.exitCode = 1;
  console.log('\nNext: npm run pilot:export -- --input pilot-events.jsonl --output pilot-metrics.json');
}

run().catch((error) => {
  console.error(`Load test failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
