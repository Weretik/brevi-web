import { describe, expect, it } from 'vitest';

import { introductionDetailFixture, introductionPreparedFixture } from './introduction.fixture';
import {
  mapIntroductionDetail,
  mapIntroductionPrepared,
  mapIntroductionPage,
} from './introduction.mapper';

describe('introduction transport validation', () => {
  it('maps numeric server layout/slots and page metadata into UI models', () => {
    const dto = introductionDetailFixture();
    const detail = mapIntroductionDetail(dto);
    expect(detail.format).toBe('summer');
    expect(detail.selections[0]).toEqual({ slotUid: 100, productId: 10, articleId: 20 });
    const page = mapIntroductionPage({
      value: [dto],
      pagedInfo: { pageNumber: 1, pageSize: 25, totalRecords: 1, totalPages: 1 },
    });
    expect(page.total).toBe(1);
    expect(page.rows[0]?.id).toBe(detail.id);
  });
  it('rejects contradictory uid, duplicate model and incomplete layouts', () => {
    const wrong = introductionDetailFixture();
    wrong.snapshot.selections[0]!.slot.uid = 202;
    expect(() => mapIntroductionDetail(wrong)).toThrow();
    const duplicate = introductionDetailFixture();
    duplicate.snapshot.selections[1]!.productId = 10;
    expect(() => mapIntroductionDetail(duplicate)).toThrow();
    const missing = introductionDetailFixture();
    missing.snapshot.selections.pop();
    expect(() => mapIntroductionDetail(missing)).toThrow();
  });
  it('projects public preview only and rejects foreign URL and absent offered price', () => {
    const prepared = introductionPreparedFixture();
    const result = mapIntroductionPrepared(prepared);
    expect(result.slots[0]).not.toHaveProperty('currentPrice');
    expect(result.slots[0]?.largeWholesale).toBe(250);
    prepared.slots[0]!.productUrl = 'https://evil.example/product';
    expect(() => mapIntroductionPrepared(prepared)).toThrow();
    prepared.slots[0]!.productUrl = 'https://brevi.com.ua/product';
    prepared.slots[0]!.largeWholesale = 0;
    expect(() => mapIntroductionPrepared(prepared)).toThrow();
  });
});
