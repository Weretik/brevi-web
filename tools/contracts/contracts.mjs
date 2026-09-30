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

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const snapshot = join(root, 'docs/contracts/openapi/backend');
const provenancePath = join(root, 'docs/contracts/openapi/SOURCE.json');
const generatedPath = join(root, 'libs/admin/api-contract/src/generated/openapi.ts');
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

function digest(directory) {
  const hash = createHash('sha256');
  for (const file of files(directory)) {
    hash.update(file.replaceAll('\\', '/'));
    hash.update(readFileSync(join(directory, file)));
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
  const supplierContract = readFileSync(join(snapshot, 'reference/suppliers.openapi.yaml'), 'utf8');
  for (const operationId of [
    'getSuppliers',
    'createSupplier',
    'updateSupplier',
    'deleteSupplier',
  ]) {
    if (!supplierContract.includes('operationId: ' + operationId))
      throw Error('Missing operationId: ' + operationId);
  }
  const garmentContract = readFileSync(
    join(snapshot, 'reference/garment-accessories.openapi.yaml'),
    'utf8',
  );
  for (const operationId of [
    'getGarmentAccessories',
    'createGarmentAccessory',
    'updateGarmentAccessory',
    'deleteGarmentAccessory',
  ]) {
    if (!garmentContract.includes('operationId: ' + operationId))
      throw Error('Missing operationId: ' + operationId);
  }
  const fabricContract = readFileSync(join(snapshot, 'reference/fabrics.openapi.yaml'), 'utf8');
  for (const operationId of ['getFabrics', 'createFabric', 'updateFabric', 'deleteFabric']) {
    if (!fabricContract.includes('operationId: ' + operationId))
      throw Error('Missing operationId: ' + operationId);
  }
  const additionalContract = readFileSync(
    join(snapshot, 'reference/additional-references.openapi.yaml'),
    'utf8',
  );
  for (const operationId of ['getAdditionalReferences', 'updateAdditionalReference']) {
    if (!additionalContract.includes('operationId: ' + operationId))
      throw Error('Missing operationId: ' + operationId);
  }
  const productContract = readFileSync(
    join(snapshot, 'catalog/product-catalog.openapi.yaml'),
    'utf8',
  );
  for (const operationId of [
    'getAdminProducts',
    'getAdminProductById',
    'createProduct',
    'replaceProduct',
    'deleteProduct',
  ]) {
    if (!productContract.includes('operationId: ' + operationId))
      throw Error('Missing operationId: ' + operationId);
  }
  const productDependencies = readFileSync(
    join(snapshot, 'catalog/product-dependencies.openapi.yaml'),
    'utf8',
  );
  for (const operationId of [
    'getAdminProductCategories',
    'getCatalogMedia',
    'uploadCatalogMedia',
    'deleteCatalogMedia',
  ]) {
    if (!productDependencies.includes('operationId: ' + operationId))
      throw Error('Missing operationId: ' + operationId);
  }
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
