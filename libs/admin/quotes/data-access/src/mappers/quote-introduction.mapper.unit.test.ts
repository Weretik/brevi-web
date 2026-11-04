import { describe, expect, it } from 'vitest';

import {
  toCreateQuoteIntroTemplateInput,
  toSaveQuoteIntroductionInput,
} from './quote-introduction.mapper';

import type { QuoteIntroDraft } from '@admin/quotes/model';

const slot = (productId: number, itemId: number | null = null) => ({
  key: `k${productId}`,
  itemId,
  productId,
  articleId: productId * 100,
  name: `Модель ${productId}`,
  photoUrl: null,
  fabricTitle: null,
  savedPrice: 900,
  savedArticleId: productId * 100,
  problem: null,
});

const draft: QuoteIntroDraft = {
  version: 3,
  internalName: '  ТОВ «Агро» ',
  customerId: null,
  recipientEmail: ' ',
  recipientName: 'Іван',
  companyName: '',
  managerNote: '',
  layout: 'Summer',
  letterName: 'Після розмови',
  pages: [{ season: 'Summer', slots: [slot(1, 10), slot(2), slot(3), slot(4)] }],
};

describe('introduction input', () => {
  it('sends models and fabrics without prices; empty texts become null', () => {
    const input = toSaveQuoteIntroductionInput(draft);
    expect(input.internalName).toBe('ТОВ «Агро»');
    expect(input.recipientEmail).toBeNull();
    expect(input.pages[0].models[0]).toEqual({ itemId: 10, productId: 1, articleId: 100 });
    expect(JSON.stringify(input)).not.toContain('900');
  });

  it('keeps the template name trimmed with the same pages', () => {
    const input = toCreateQuoteIntroTemplateInput(' Агро база ', draft);
    expect(input.name).toBe('Агро база');
    expect(input.pages[0].models.map((model) => model.productId)).toEqual([1, 2, 3, 4]);
  });
});
