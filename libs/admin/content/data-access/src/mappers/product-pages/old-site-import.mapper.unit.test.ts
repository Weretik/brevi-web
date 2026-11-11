import { describe, expect, it } from 'vitest';

import { mapOldSiteImportReport } from './old-site-import.mapper';

const report = {
  dryRun: true,
  total: 3,
  created: 1,
  updated: 0,
  kept: 1,
  notMatched: [{ url: '/halat-gera/', name: 'Халат ГЕРА', reason: 'Товар не знайдено.' }],
  problems: [],
};

describe('mapOldSiteImportReport', () => {
  it('maps the counts and the pages left without a product', () => {
    expect(mapOldSiteImportReport(report)).toEqual(report);
  });

  it('refuses an answer without counts', () => {
    expect(() => mapOldSiteImportReport({ ...report, created: undefined })).toThrow(/створено/);
  });
});
