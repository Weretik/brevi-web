import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { backend } from './backend-contract.mjs';

// Generates the TypeScript types of the snapshot and formats them the way the repository formats code.
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const output = path.join(workspaceRoot, backend.generatedTypes);
const run = (script, args) =>
  execFileSync(process.execPath, [path.join(workspaceRoot, script), ...args], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });

run('node_modules/openapi-typescript/bin/cli.js', [
  path.join(workspaceRoot, backend.snapshotDirectory, 'openapi.json'),
  '-o',
  output,
]);
run('node_modules/prettier/bin/prettier.cjs', ['--log-level', 'warn', '--write', output]);
