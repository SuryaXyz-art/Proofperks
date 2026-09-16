// SPDX-License-Identifier: Apache-2.0

import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(uiRoot, '..', 'contract', 'src', 'managed', 'proofperks');
const destination = path.resolve(uiRoot, 'public', 'zkconfig');

await rm(destination, { recursive: true, force: true });
await mkdir(path.dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true });
console.log(`Copied Preprod ZK configuration from ${source}`);
