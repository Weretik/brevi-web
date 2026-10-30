import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkRequiredOperations } from './check-required-operations.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const snapshot = join(root, 'docs/contracts/openapi/backend');
const provenancePath = join(root, 'docs/contracts/openapi/SOURCE.json');
const generatedPath = join(root, 'libs/admin/shared/contracts/src/generated/openapi.ts');
const entry = 'docs/sdd/contracts/openapi.yaml';

function git(checkout, ...args) {
  return execFileSync('git', args, { cwd: checkout, encoding: 'utf8' }).trim();
}

function files(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((item) => {
      const relative = join(prefix, item.name);
      return item.isDirectory() ? files(join(directory, item.name), relative) : [relative];
    })
    .sort();
}

// Same digest on Windows and Linux: POSIX paths in one sort order, LF line endings.
function digest(directory) {
  const hash = createHash('sha256');
  const relativePaths = files(directory)
    .map((file) => file.replaceAll('\\', '/'))
    .sort();
  for (const file of relativePaths) {
    hash.update(file);
    hash.update(readFileSync(join(directory, file), 'utf8').replaceAll('\r\n', '\n'));
  }
  return hash.digest('hex');
}

function generate(output) {
  if (!existsSync(join(snapshot, 'openapi.yaml'))) throw Error('Run contracts:sync first.');
  mkdirSync(dirname(output), { recursive: true });
  execFileSync(
    process.execPath,
    [
      join(root, 'node_modules/openapi-typescript/bin/cli.js'),
      join(snapshot, 'openapi.yaml'),
      '-o',
      output,
    ],
    { cwd: root, stdio: 'inherit' },
  );
  execFileSync(
    process.execPath,
    [
      join(root, 'node_modules/prettier/bin/prettier.cjs'),
      '--config',
      join(root, 'prettier.config.cjs'),
      '--ignore-path',
      join(root, '.gitignore'),
      '--write',
      output,
    ],
    { cwd: root, stdio: 'inherit' },
  );
}

const [command, checkoutArg, commit] = process.argv.slice(2);
if (command === 'sync') {
  if (!checkoutArg || !commit || !/^[a-f0-9]{40}$/.test(commit))
    throw Error('Usage: npm run contracts:sync -- <backend-checkout> <full-commit-SHA>');
  const checkout = resolve(checkoutArg);
  if (git(checkout, 'rev-parse', 'HEAD') !== commit)
    throw Error('Backend HEAD differs from pinned commit.');
  if (git(checkout, 'status', '--porcelain')) throw Error('Backend checkout must be clean.');
  const source = join(checkout, 'docs/sdd/contracts');
  if (!existsSync(join(source, 'openapi.yaml')))
    throw Error('Backend OpenAPI entry point missing.');
  rmSync(snapshot, { recursive: true, force: true });
  for (const file of files(source)) {
    const destination = join(snapshot, file);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(source, file), destination);
  }
  const provenance = {
    repository: git(checkout, 'remote', 'get-url', 'origin'),
    commit,
    sourcePath: entry,
    syncedAt: new Date().toISOString(),
    command: 'npm run contracts:sync -- <backend-checkout> ' + commit,
    sha256: digest(snapshot),
  };
  writeFileSync(provenancePath, JSON.stringify(provenance, null, 2) + '\n');
  console.log('Synchronized', commit);
} else if (command === 'generate') {
  generate(generatedPath);
} else if (command === 'check') {
  const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'));
  if (digest(snapshot) !== provenance.sha256) throw Error('Snapshot differs from provenance.');
  checkRequiredOperations(snapshot);
  const temporary = mkdtempSync(join(tmpdir(), 'brevi-contract-'));
  try {
    const output = join(temporary, 'openapi.ts');
    generate(output);
    if (readFileSync(output, 'utf8') !== readFileSync(generatedPath, 'utf8'))
      throw Error('Generated types are stale.');
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
  console.log('Snapshot and generated types match provenance.');
} else {
  throw Error('Expected sync, generate or check.');
}
