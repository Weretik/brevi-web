import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { backend, compareSnapshot } from './backend-contract.mjs';
import { downloadContract } from './backend-source.mjs';

// Fails when the committed snapshot differs from the contract on the backend default branch.
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const snapshot = await readFile(
  path.join(workspaceRoot, backend.snapshotDirectory, 'openapi.json'),
  'utf8',
);
const result = compareSnapshot(snapshot, await downloadContract(backend, backend.branch));

if (result.current) {
  console.log(`The API snapshot matches ${backend.repository}@${backend.branch}.`);
} else {
  console.error(`The API snapshot differs from ${backend.repository}@${backend.branch}.`);
  for (const added of result.added) console.error(`  + ${added}`);
  for (const removed of result.removed) console.error(`  - ${removed}`);
  console.error(
    'Run `npm run contracts:sync`, fix the type errors it shows, and commit the result.',
  );
  process.exitCode = 1;
}
