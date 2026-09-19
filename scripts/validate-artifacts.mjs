// SPDX-License-Identifier: Apache-2.0

import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const managed = path.join(root, 'contract', 'managed');

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function validateArtifactManifest(base = managed) {
  const manifest = JSON.parse(await readFile(path.join(base, 'manifest.json'), 'utf8'));
  if (manifest.schema !== 1 || !manifest.source?.sha256 || !Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    throw new Error('Generated artifact manifest is incomplete.');
  }
  for (const artifact of manifest.artifacts) {
    const file = path.join(base, artifact.path);
    const info = await stat(file).catch(() => null);
    if (!info?.isFile() || info.size !== artifact.bytes || info.size === 0) throw new Error(`Artifact size/type mismatch: ${artifact.path}`);
    const bytes = await readFile(file);
    if (hash(bytes) !== artifact.sha256) throw new Error(`Artifact hash mismatch: ${artifact.path}`);
  }
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateArtifactManifest()
    .then((manifest) => console.log(`Validated ${manifest.artifacts.length} generated artifacts against their manifest.`))
    .catch((error) => { console.error(`Artifact validation failed: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
}
