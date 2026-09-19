// SPDX-License-Identifier: Apache-2.0

import { createHash } from 'node:crypto';
import { access, cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deploymentPath = path.join(root, 'deployments', 'preprod.json');
const managedPath = path.join(root, 'contract', 'managed');
const uiRoot = path.join(root, 'ui');
const bundlePath = path.join(root, 'deployments', 'preprod-circuit-bundle');
const publicZkPath = path.join(uiRoot, 'public', 'zkconfig');

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function readJson(filePath, label) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is missing or invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function requiredFile(filePath, label) {
  try {
    const info = await stat(filePath);
    if (!info.isFile() || info.size === 0) throw new Error('empty or not a regular file');
    return readFile(filePath);
  } catch (error) {
    throw new Error(`${label} is missing: ${filePath} (${error instanceof Error ? error.message : String(error)})`);
  }
}

export async function validateDeploymentBundle({ deployment, managed, bundle }) {
  if (deployment.network !== 'preprod') throw new Error('Deployment manifest is not for the Preprod network.');
  if (!deployment.address || !deployment.transactionId) throw new Error('Deployment manifest lacks a confirmed address or transaction identifier.');
  if (!deployment.campaign?.issuerPublicKey) throw new Error('Deployment manifest lacks the public issuer key.');
  if (deployment.sourceDigest !== managed.source?.sha256) throw new Error('Deployment source digest does not match contract/managed/manifest.json.');
  if (!Array.isArray(deployment.artifacts) || deployment.artifacts.length === 0) throw new Error('Deployment manifest has no recorded circuit artifacts.');
  if (!Array.isArray(managed.artifacts) || managed.artifacts.length !== deployment.artifacts.length) throw new Error('Deployment artifact list does not match the current compiled manifest.');
  for (const expected of managed.artifacts) {
    const recorded = deployment.artifacts.find((item) => item.path === expected.path);
    if (!recorded || recorded.sha256 !== expected.sha256 || recorded.bytes !== expected.bytes) {
      throw new Error(`Deployment artifact metadata mismatch for ${expected.path}.`);
    }
    const bytes = await requiredFile(path.join(bundle, expected.path), `Preprod circuit bundle artifact ${expected.path}`);
    if (bytes.length !== expected.bytes || sha256(bytes) !== expected.sha256) throw new Error(`Preprod circuit bundle hash mismatch for ${expected.path}.`);
  }
}

function publicConfig() {
  const forbidden = Object.keys(process.env).filter((key) => key.startsWith('VITE_') && /(seed|secret|private|prover|password|state)/i.test(key));
  if (forbidden.length) throw new Error(`Refusing to build with private VITE_* variables: ${forbidden.join(', ')}`);
  const config = {
    network: process.env.VITE_PROOFPERKS_NETWORK,
    address: process.env.VITE_PROOFPERKS_CONTRACT_ADDRESS,
    issuer: process.env.VITE_PROOFPERKS_ISSUER_PUBLIC_KEY,
    credentialNetwork: process.env.VITE_PROOFPERKS_CREDENTIAL_NETWORK_ID,
    credentialDeployment: process.env.VITE_PROOFPERKS_CREDENTIAL_DEPLOYMENT_ID,
  };
  if (config.network !== 'preprod') throw new Error('VITE_PROOFPERKS_NETWORK must be exactly preprod.');
  if (!config.address || !config.issuer || !config.credentialNetwork || !config.credentialDeployment) throw new Error('Required public Preprod configuration is missing.');
  return config;
}

async function run(command, args, env) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)));
  });
}

export async function main() {
  const deployment = await readJson(deploymentPath, 'deployments/preprod.json');
  const managed = await readJson(path.join(managedPath, 'manifest.json'), 'contract/managed/manifest.json');
  await access(bundlePath).catch(() => { throw new Error('deployments/preprod-circuit-bundle is missing; only a confirmed deployment may create it.'); });
  await validateDeploymentBundle({ deployment, managed, bundle: bundlePath });
  const config = publicConfig();
  if (config.address !== deployment.address) throw new Error('VITE_PROOFPERKS_CONTRACT_ADDRESS does not match the confirmed Preprod deployment.');
  if (config.issuer.toLowerCase() !== deployment.campaign.issuerPublicKey.toLowerCase()) throw new Error('VITE_PROOFPERKS_ISSUER_PUBLIC_KEY does not match the confirmed deployment.');
  if (deployment.credentialScope) {
    if (config.credentialNetwork !== deployment.credentialScope.networkId || config.credentialDeployment !== deployment.credentialScope.deploymentId) {
      throw new Error('Public credential scope does not match the confirmed Preprod deployment.');
    }
  }

  await rm(publicZkPath, { recursive: true, force: true });
  await mkdir(path.dirname(publicZkPath), { recursive: true });
  await cp(bundlePath, publicZkPath, { recursive: true });
  await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build', '--workspace', '@proofperks/ui'], {
    ...process.env,
    PROOFPERKS_ZK_CONFIG_SOURCE: bundlePath,
  });

  const builtManifest = await readJson(path.join(uiRoot, 'dist', 'zkconfig', 'manifest.json'), 'built public circuit manifest');
  await validateDeploymentBundle({ deployment, managed: builtManifest, bundle: path.join(uiRoot, 'dist', 'zkconfig') });
  console.log(`Vercel build verified: ${deployment.address} on Preprod; ${managed.artifacts.length} circuit artifacts hash-checked.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Vercel build refused: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
