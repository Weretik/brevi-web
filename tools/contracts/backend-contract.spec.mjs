import assert from 'node:assert/strict';
import test from 'node:test';

import {
  backend,
  compareSnapshot,
  contractUrl,
  normalizeContract,
  sourceDocument,
} from './backend-contract.mjs';

test('reads the generated contract from the backend default branch', () => {
  assert.equal(
    contractUrl(backend, backend.branch),
    'https://raw.githubusercontent.com/Weretik/BreviERP/master/docs/sdd/contracts/openapi.json',
  );
  assert.equal(
    contractUrl(backend, 'abc123'),
    'https://raw.githubusercontent.com/Weretik/BreviERP/abc123/docs/sdd/contracts/openapi.json',
  );
});

test('normalizes line endings and formatting so only content differences count', () => {
  const crlf = '{\r\n  "openapi": "3.1.1",\r\n  "paths": {}\r\n}\r\n';
  const compact = '{"openapi":"3.1.1","paths":{}}';
  assert.equal(normalizeContract(crlf), normalizeContract(compact));
  assert.ok(normalizeContract(compact).endsWith('}\n'));
});

test('rejects a document that is not an OpenAPI contract', () => {
  assert.throws(() => normalizeContract('<html>404</html>'), /not valid JSON/);
  assert.throws(() => normalizeContract('{"paths":{}}'), /not an OpenAPI document/);
});

test('compares the snapshot with the backend contract', () => {
  const contract = '{"openapi":"3.1.1","paths":{"/a":{}}}';
  assert.deepEqual(compareSnapshot(contract, contract), { current: true });
  const result = compareSnapshot('{"openapi":"3.1.1","paths":{}}', contract);
  assert.equal(result.current, false);
  assert.deepEqual(result.added, ['/a']);
  assert.deepEqual(result.removed, []);
});

test('records where the snapshot came from', () => {
  const text = sourceDocument(backend, { ref: 'master', commit: 'abc123' });
  assert.match(text, /Weretik\/BreviERP/);
  assert.match(text, /`abc123`/);
  assert.match(text, /npm run contracts:sync/);
});
