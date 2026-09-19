// SPDX-License-Identifier: Apache-2.0

/**
 * Export aggregate, anonymized pilot metrics from a safe JSONL event log.
 *
 * Accepted event shape:
 *   {"type":"approval","status":"success"}
 *   {"type":"claim","status":"success","transactionTimeMs":842.4,"measurementProvenance":"live_midnight_transaction"}
 *   {"type":"claim","status":"failure","failureCategory":"duplicate_claim","simulationTimeMs":91.2,"measurementProvenance":"reference_simulation"}
 *
 * Only these fields are accepted. Rejecting extra fields prevents accidental
 * export of participant IDs, secrets, wallet addresses, commitments, or other
 * identifying data.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const allowedFields = new Set(['type', 'status', 'simulationTimeMs', 'transactionTimeMs', 'provingTimeMs', 'measurementProvenance', 'failureCategory']);
const eventTypes = new Set(['approval', 'claim']);
const successStatuses = new Set(['success', 'accepted', 'succeeded']);
const failureStatuses = new Set(['failure', 'failed', 'rejected', 'error']);
const provenances = new Set(['reference_simulation', 'compact_testkit', 'live_midnight_transaction', 'pilot_observation', 'unavailable']);
const failureCategories = new Set(['duplicate_claim', 'payout_duplicate', 'invalid_credential', 'invalid_merkle_path', 'threshold_not_met', 'revoked_credential', 'wallet_rejected', 'wrong_network', 'prover_unavailable', 'insufficient_rewards', 'insufficient_budget', 'issuer_unauthorized', 'transaction_failed', 'unknown_failure']);

function usage() {
  console.log(`Usage: node cli/export-pilot-metrics.mjs [options]

Options:
  --input <file>   Safe JSONL event log (default: pilot-events.jsonl)
  --output <file>  Aggregate JSON report (default: pilot-metrics.json)
  --help           Show this help

Each input line must contain only type, status, timing fields, measurementProvenance,
and an optional failureCategory. Do not put secrets, wallet addresses, commitments, nullifiers,
names, or participant IDs in the event log.`);
}

function parseArgs(argv) {
  const options = { input: 'pilot-events.jsonl', output: 'pilot-metrics.json' };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help') {
      usage();
      process.exit(0);
    }
    if (argument === '--input' || argument === '--output') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a file path`);
      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${argument}`);
  }
  return options;
}

function normalizeFailureCategory(value) {
  const category = String(value ?? 'unknown_failure').trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, '_');
  if (category.includes('payout')) return 'payout_duplicate';
  if (category.includes('duplicate') || category.includes('nullifier')) return 'duplicate_claim';
  if (category.includes('threshold') || category.includes('under')) return 'threshold_not_met';
  if (category.includes('commitment') || category.includes('membership') || category.includes('credential')) return 'invalid_credential';
  if (category.includes('wallet') || category.includes('reject')) return 'wallet_rejected';
  if (category.includes('network')) return 'wrong_network';
  if (category.includes('prover')) return 'prover_unavailable';
  if (category.includes('fund') || category.includes('reward')) return 'insufficient_rewards';
  if (category.includes('budget')) return 'insufficient_budget';
  if (category.includes('issuer') || category.includes('authorization')) return 'issuer_unauthorized';
  if (category.includes('transaction')) return 'transaction_failed';
  return failureCategories.has(category) ? category : 'unknown_failure';
}

function isSuccess(status) {
  return successStatuses.has(String(status).trim().toLowerCase());
}

function isFailure(status) {
  return failureStatuses.has(String(status).trim().toLowerCase());
}

function readEvents(text) {
  return text.split(/\r?\n/).flatMap((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return [];
    let event;
    try {
      event = JSON.parse(trimmed);
    } catch {
      throw new Error(`Line ${index + 1} is not valid JSON`);
    }
    if (!event || typeof event !== 'object' || Array.isArray(event)) {
      throw new Error(`Line ${index + 1} must be a JSON object`);
    }
    const unexpected = Object.keys(event).filter((field) => !allowedFields.has(field));
    if (unexpected.length > 0) {
      throw new Error(`Line ${index + 1} contains unsupported field(s): ${unexpected.join(', ')}. Remove identifying data before exporting.`);
    }
    if (!eventTypes.has(event.type)) throw new Error(`Line ${index + 1} has unsupported type: ${event.type}`);
    if (!isSuccess(event.status) && !isFailure(event.status)) throw new Error(`Line ${index + 1} has unsupported status: ${event.status}`);
    const timingFields = ['simulationTimeMs', 'transactionTimeMs', 'provingTimeMs'];
    for (const field of timingFields) {
      if (event[field] !== undefined && (!Number.isFinite(event[field]) || event[field] < 0)) throw new Error(`Line ${index + 1} has invalid ${field}`);
    }
    if (timingFields.some((field) => event[field] !== undefined)) {
      if (!provenances.has(event.measurementProvenance)) throw new Error(`Line ${index + 1} requires a fixed measurementProvenance when timing is present`);
      if (event.provingTimeMs !== undefined && !['compact_testkit', 'live_midnight_transaction', 'pilot_observation'].includes(event.measurementProvenance)) {
        throw new Error(`Line ${index + 1} provingTimeMs cannot use ${event.measurementProvenance}`);
      }
    }
    if (event.failureCategory !== undefined && !failureCategories.has(normalizeFailureCategory(event.failureCategory))) throw new Error(`Line ${index + 1} has unsupported failureCategory`);
    return [event];
  });
}

function summarize(events) {
  const approvals = { attempted: 0, successful: 0, failed: 0 };
  const claims = {
    attempted: 0,
    successful: 0,
    failed: 0,
    failureRatePercent: 0,
    timedAttempts: 0,
    simulationTimeMs: { timedAttempts: 0, averageMs: null, p95Ms: null },
    transactionTimeMs: { timedAttempts: 0, averageMs: null, p95Ms: null },
    provingTimeMs: { timedAttempts: 0, averageMs: null, p95Ms: null },
  };
  const failures = new Map();
  const timings = { simulationTimeMs: [], transactionTimeMs: [], provingTimeMs: [] };

  for (const event of events) {
    const result = isSuccess(event.status) ? 'successful' : 'failed';
    const bucket = event.type === 'approval' ? approvals : claims;
    bucket.attempted += 1;
    bucket[result] += 1;
    if (event.type === 'claim') for (const field of Object.keys(timings)) if (event[field] !== undefined) timings[field].push(event[field]);
    if (result === 'failed') {
      const category = normalizeFailureCategory(event.failureCategory);
      failures.set(category, (failures.get(category) ?? 0) + 1);
    }
  }

  for (const [field, values] of Object.entries(timings)) {
    claims.timedAttempts = Math.max(claims.timedAttempts, values.length);
    if (values.length > 0) {
      const sorted = [...values].sort((left, right) => left - right);
      const p95Index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
      claims[field] = { timedAttempts: values.length, averageMs: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3)), p95Ms: Number(sorted[p95Index].toFixed(3)) };
    }
  }
  claims.failureRatePercent = claims.attempted === 0
    ? 0
    : Number(((claims.failed / claims.attempted) * 100).toFixed(3));

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    eventsRead: events.length,
    approvals,
    claims,
    failures: [...failures.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([category, count]) => ({ category, count })),
    privacyNote: 'Aggregate report only. No participant identifiers or credential data are included.',
  };
}

const options = parseArgs(process.argv.slice(2));
const inputPath = path.resolve(process.cwd(), options.input);
const outputPath = path.resolve(process.cwd(), options.output);

try {
  const events = readEvents(await readFile(inputPath, 'utf8'));
  const report = summarize(events);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Read ${report.eventsRead} safe pilot events.`);
  console.log(`Wrote anonymized metrics to ${outputPath}`);
  console.log(`Approvals: ${report.approvals.successful} successful / ${report.approvals.attempted} attempted`);
  console.log(`Claims: ${report.claims.successful} successful / ${report.claims.attempted} attempted`);
  console.log(`Claim failure rate: ${report.claims.failureRatePercent}%`);
console.log(`Average simulation time: ${report.claims.simulationTimeMs.averageMs === null ? 'n/a' : `${report.claims.simulationTimeMs.averageMs} ms`}`);
console.log(`Average transaction time: ${report.claims.transactionTimeMs.averageMs === null ? 'n/a' : `${report.claims.transactionTimeMs.averageMs} ms`}`);
console.log(`Average proving time: ${report.claims.provingTimeMs.averageMs === null ? 'n/a' : `${report.claims.provingTimeMs.averageMs} ms`}`);
console.log(`p95 proving time: ${report.claims.provingTimeMs.p95Ms === null ? 'n/a' : `${report.claims.provingTimeMs.p95Ms} ms`}`);
  console.log(`Failures: ${report.failures.reduce((total, item) => total + item.count, 0)}`);
} catch (error) {
  console.error(`Pilot metrics export failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
