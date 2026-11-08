import { describe, expect, it } from 'vitest';

import {
  applyIntroTemplate,
  chooseIntroModel,
  emptyIntroDraft,
  introSlotPrice,
  introToDraft,
  setIntroLayout,
} from './quote-intro-draft-mapper';
import { quoteIntroErrors } from '../validators/quote-intro-validation';

import type { Quote } from '../entities/quote';
import type { QuoteCatalogProduct } from '../entities/quote-catalog';
import type { QuoteIntroductionSetup } from '../entities/quote-introduction';

const product = (id: number, season: string, large = 1000 + id): QuoteCatalogProduct => ({
  productId: id,
  kind: 'Sewing',
  code: `MOD-${id}`,
  name: `Модель ${id}`,
  season,
  photoUrl: null,
  description: null,
  prices: null,
  problem: null,
  variants: [
    {
      articleId: id * 100,
      sku: `S-${id}`,
      title: `Тканина ${id}`,
      fabricInfo: null,
      prices: { retail: null, wholesale: null, large },
      problem: null,
    },
  ],
});

const setup: QuoteIntroductionSetup = {
  summer: { code: 'MOD-1', product: product(1, 'Літо'), problem: null },
  winter: { code: 'MOD-5', product: product(5, 'Зима'), problem: null },
  letters: [{ name: 'Після розмови', subject: 'Добірка спецодягу', body: 'Дякуємо.' }],
};

describe('introduction draft', () => {
  it('starts «Загальне» with the main models and asks for every model and fabric', () => {
    const draft = emptyIntroDraft(setup);
    expect(draft.pages.map((page) => page.season)).toEqual(['Summer', 'Winter']);
    expect(draft.pages[0].slots[0].productId).toBe(1);
    expect(draft.letterName).toBe('Після розмови');

    const errors = quoteIntroErrors(draft);
    expect(errors['internalName']).toBeDefined();
    expect(errors[`slot:${draft.pages[0].slots[0].key}`]).toBe('Оберіть тканину.');
    expect(errors[`slot:${draft.pages[0].slots[1].key}`]).toBe('Оберіть модель.');
  });

  it('keeps the page of a season that stays when the layout changes', () => {
    const draft = emptyIntroDraft(setup);
    const chosen = {
      ...draft,
      pages: [
        {
          ...draft.pages[0],
          slots: draft.pages[0].slots.map((slot, index) =>
            index === 1
              ? chooseIntroModel(slot, product(2, 'Літо'), product(2, 'Літо').variants[0])
              : slot,
          ),
        },
        draft.pages[1],
      ],
    };
    const summer = setIntroLayout(chosen, 'Summer', { Summer: setup.summer.product, Winter: null });
    expect(summer.pages).toHaveLength(1);
    expect(summer.pages[0].slots[1].productId).toBe(2);
  });

  it('flags a model chosen twice', () => {
    const draft = emptyIntroDraft(setup);
    const twice = {
      ...draft,
      internalName: 'Агро',
      pages: draft.pages.map((page) => ({
        ...page,
        slots: page.slots.map((slot) =>
          chooseIntroModel(slot, product(2, 'Літо'), product(2, 'Літо').variants[0]),
        ),
      })),
    };
    expect(quoteIntroErrors(twice)['pages']).toBe('Одна модель може бути в добірці лише раз.');
  });

  it('applies a template with current Catalog data and empties a model that is gone', () => {
    const draft = emptyIntroDraft(setup);
    const applied = applyIntroTemplate(
      draft,
      {
        id: 1,
        name: 'Агро база',
        layout: 'Summer',
        letterName: null,
        pages: [
          {
            season: 'Summer',
            models: [
              { productId: 1, articleId: 100, productName: 'Модель 1', fabricTitle: 'Тканина 1' },
              { productId: 2, articleId: 999, productName: 'Модель 2', fabricTitle: 'Стара' },
              { productId: 3, articleId: 300, productName: 'Зникла', fabricTitle: 'Тканина 3' },
              { productId: 4, articleId: 400, productName: 'Модель 4', fabricTitle: 'Тканина 4' },
            ],
          },
        ],
        author: { userId: 1, name: 'Директор' },
        createdAt: '2026-11-04T10:00:00Z',
        canDelete: true,
      },
      new Map([1, 2, 4].map((id) => [id, product(id, 'Літо')])),
    );
    const [main, oldFabric, gone, fine] = applied.pages[0].slots;
    expect(applied.layout).toBe('Summer');
    expect(main.articleId).toBe(100);
    expect(oldFabric.articleId).toBeNull();
    expect(oldFabric.problem).toContain('Стара');
    expect(gone.productId).toBeNull();
    expect(gone.problem).toContain('Зникла');
    expect(fine.fabricTitle).toBe('Тканина 4');
  });

  it('keeps the saved price for the saved fabric and shows the Catalog price for a new one', () => {
    const quote = {
      version: 2,
      internalName: 'Агро',
      customerId: null,
      recipientName: null,
      companyName: null,
      managerNote: null,
      introduction: {
        layout: 'Summer',
        recipientEmail: 'a@b.ua',
        letterName: null,
        letterSubject: null,
        letterBody: 'Свій текст',
      },
      items: [1, 2, 3, 4].map((id) => ({
        id: id * 10,
        productId: id,
        name: `Модель ${id}`,
        photoUrl: null,
        options: [
          {
            articleId: id * 100,
            title: `Тканина ${id}`,
            prices: { large: { amount: 500 } },
          },
        ],
      })),
    } as unknown as Quote;
    const draft = introToDraft(quote);
    const slot = draft.pages[0].slots[1];
    expect(draft.recipientEmail).toBe('a@b.ua');
    expect([draft.letterSubject, draft.letterBody]).toEqual([null, 'Свій текст']);
    expect(introSlotPrice(slot, product(2, 'Літо'))).toBe(500);
    expect(introSlotPrice({ ...slot, articleId: null }, product(2, 'Літо'))).toBeNull();
    const changed = chooseIntroModel(slot, product(3, 'Літо'), product(3, 'Літо').variants[0]);
    expect(changed.itemId).toBeNull();
    expect(introSlotPrice(changed, product(3, 'Літо'))).toBe(1003);
  });
});
