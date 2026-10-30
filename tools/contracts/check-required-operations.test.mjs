import assert from 'node:assert/strict';
import test from 'node:test';

import { hasOperationId } from './check-required-operations.mjs';

test('required operation IDs match exact declarations, not longer IDs or comments', () => {
  assert.equal(hasOperationId('      operationId: prepareCrmQuote\n', 'prepareCrmQuote'), true);
  assert.equal(hasOperationId('      operationId: prepareCrmQuoteV2\n', 'prepareCrmQuote'), false);
  assert.equal(hasOperationId('      # operationId: prepareCrmQuote\n', 'prepareCrmQuote'), false);
  assert.equal(
    hasOperationId('      operationId: prepareCrmQuote # ready\n', 'prepareCrmQuote'),
    true,
  );
});

test('quoted YAML operation IDs are accepted with exact values', () => {
  assert.equal(
    hasOperationId(
      '  "operationId": "applyCrmIntroductionTemplate"\n',
      'applyCrmIntroductionTemplate',
    ),
    true,
  );
  assert.equal(
    hasOperationId(
      '  "operationId": "applyCrmIntroductionTemplateV2"\n',
      'applyCrmIntroductionTemplate',
    ),
    false,
  );
  assert.equal(
    hasOperationId(
      '  # "operationId": "applyCrmIntroductionTemplate"\n',
      'applyCrmIntroductionTemplate',
    ),
    false,
  );
});

test('JSON-compatible OpenAPI declarations allow a property comma without prefix matching', () => {
  assert.equal(
    hasOperationId('  "operationId": "enqueueCrmQuoteDelivery",\n', 'enqueueCrmQuoteDelivery'),
    true,
  );
  assert.equal(
    hasOperationId('  "operationId": "enqueueCrmQuoteDeliveryV2",\n', 'enqueueCrmQuoteDelivery'),
    false,
  );
});
