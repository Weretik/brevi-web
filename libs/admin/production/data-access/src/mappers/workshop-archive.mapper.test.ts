import { describe, expect, it } from 'vitest';

import { mapWorkshopArchiveImportResult, mapWorkshopArchivePage } from './workshop-archive.mapper';

describe('workshop archive mappers', () => {
  it('keeps the old date text and the links of a line', () => {
    const page = mapWorkshopArchivePage({
      kind: 'Schedule',
      page: 1,
      pageSize: 50,
      total: 1,
      items: [
        {
          id: 1,
          sourceRow: 3,
          date: null,
          dateText: '22.11/2017',
          number: null,
          client: 'Диканське',
          product: null,
          quantity: '10+4',
          fabric: null,
          status: null,
          notes: null,
          fields: [{ label: 'Сезон', value: 'Літо' }],
          links: [{ label: 'Документ', url: 'https://docs.google.com/d/1' }],
        },
      ],
    });
    expect(page.items[0]).toMatchObject({ dateText: '22.11/2017', quantity: '10+4' });
    expect(page.items[0].links[0].label).toBe('Документ');
  });

  it('lists only the errors of an import', () => {
    const result = mapWorkshopArchiveImportResult({
      dryRun: true,
      created: 3,
      unchanged: 1,
      errors: 1,
      errorLines: [{ sourceKey: 'schedule:9', error: 'Посилання має бути https.' }],
    });
    expect(result).toMatchObject({ created: 3, unchanged: 1, errors: 1 });
    expect(result.lines[0]).toMatchObject({ key: 'schedule:9', action: 'error' });
  });
});
