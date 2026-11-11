import { describe, expect, it } from 'vitest';

import { readV133Export, v133Tables } from './v133-export';

const all = () =>
  Object.values(v133Tables).map((spec) => ({ name: `d1/${spec.table}.jsonl`, text: '' }));

describe('readV133Export', () => {
  it('names every table of the transfer that was not picked', () => {
    const result = readV133Export(all().slice(2), '');
    expect(result.input).toBeNull();
    expect(result.missing).toEqual(['fabric_stock.jsonl', 'fabric_stock_movements.jsonl']);
  });

  it('keeps only the columns the transfer reads, in camelCase, and the order of the rows', () => {
    const files = all().map((file) =>
      file.name.endsWith('/production_items.jsonl')
        ? {
            ...file,
            text: [
              '{"id":"i-2","order_id":"o-1","model_article":"ab1","model_name":"Халат","quantity":3,"quote_snapshot_json":"[truncated for model]"}',
              '',
              '{"id":"i-1","order_id":"o-1","model_name":"Фартух","quantity":1}',
            ].join('\r\n'),
          }
        : file,
    );
    files.push({ name: 'fabric_stock.metadata.json', text: '{}' });
    const result = readV133Export(files, '  v133 від 11.11  ');
    expect(result.error).toBeNull();
    expect(result.input?.snapshot).toBe('v133 від 11.11');
    expect(result.input?.productionItems).toEqual([
      { id: 'i-2', orderId: 'o-1', modelArticle: 'ab1', modelName: 'Халат', quantity: 3 },
      { id: 'i-1', orderId: 'o-1', modelArticle: null, modelName: 'Фартух', quantity: 1 },
    ]);
    expect(result.input?.fabricStock).toEqual([]);
  });

  it('points at a line that is not JSON', () => {
    const files = all();
    files[0] = { name: 'fabric_stock.jsonl', text: '{"id":"s-1"}\n{oops' };
    expect(readV133Export(files, '').error).toBe('fabric_stock.jsonl, рядок 2: це не рядок JSON.');
  });
});
