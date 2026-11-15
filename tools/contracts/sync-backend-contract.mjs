import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { backend, normalizeContract, sourceDocument } from './backend-contract.mjs';
import { downloadContract, resolveCommit } from './backend-source.mjs';

// npm run contracts:sync                  -> the backend default branch
// npm run contracts:sync -- --ref <ref>   -> a backend branch or commit (for a backend PR that is not merged yet)
// npm run contracts:sync -- --file <path> -> a local backend build
const { values } = parseArgs({ options: { ref: { type: 'string' }, file: { type: 'string' } } });
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const snapshotDirectory = path.join(workspaceRoot, backend.snapshotDirectory);

const ref = values.ref ?? backend.branch;
const contract = values.file
  ? normalizeContract(await readFile(path.resolve(values.file), 'utf8'))
  : normalizeContract(await downloadContract(backend, ref));
const commit = values.file
  ? `local file ${path.basename(values.file)}`
  : resolveCommit(backend, ref);

await mkdir(snapshotDirectory, { recursive: true });
for (const entry of await readdir(snapshotDirectory)) {
  if (entry !== 'openapi.json' && entry !== 'SOURCE.md')
    await rm(path.join(snapshotDirectory, entry), { recursive: true });
}
await writeFile(path.join(snapshotDirectory, 'openapi.json'), contract, 'utf8');
await writeFile(
  path.join(snapshotDirectory, 'SOURCE.md'),
  sourceDocument(backend, { ref: values.file ? 'local' : ref, commit }),
  'utf8',
);
execFileSync('npm', ['run', '--silent', 'contracts:generate'], {
  cwd: workspaceRoot,
  stdio: 'inherit',
});
console.log(`Synced the ${backend.repository} contract (${values.file ?? ref}, ${commit}).`);
