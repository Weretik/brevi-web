import { describe, expect, it } from 'vitest';

import { changeProductType, draftFromDetail, emptyProductDraft } from './product-draft';
import { validateProductDraft } from './product-validation';

import type { ProductDetail } from '../product-detail/product-detail';

describe('product write drafts', () => {
  it('requires common and type-specific fields', () => {
    expect(validateProductDraft(emptyProductDraft('Sewing'), 0)).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      metersPerProduct: expect.any(String),
    });
    expect(validateProductDraft(emptyProductDraft('Ppe'), 1)).toMatchObject({
      supplierId: expect.any(String),
      basePrice: expect.any(String),
    });
  });

  it('switches type without carrying fields from the previous type', () => {
    const sewing = { ...emptyProductDraft('Sewing'), name: 'Куртка' };
    const ppe = changeProductType(sewing, 'Ppe');
    expect(ppe.name).toBe('Куртка');
    expect(ppe).toMatchObject({ type: 'Ppe', supplierId: 0 });
    expect(ppe).not.toHaveProperty('metersPerProduct');
  });

  it('accepts only percentage reference IDs for PPE', () => {
    const base = emptyProductDraft('Ppe');
    if (base.type !== 'Ppe') throw new Error('Очікувався PPE draft.');
    const draft = {
      ...base,
      retailPercent: { source: 'Reference' as const, additionalReferenceId: 7 },
    };
    expect(validateProductDraft(draft, 1, [8])).toHaveProperty('retailPercent');
    expect(validateProductDraft(draft, 1, [7])).not.toHaveProperty('retailPercent');
  });

  it('restores every editable nested section for full replace', () => {
    const detail: ProductDetail = {
      id: 8,
      name: 'Куртка',
      ruName: 'Куртка',
      slug: 'jacket',
      type: 'Sewing',
      descriptionUk: 'Опис',
      descriptionRu: 'Описание',
      categoryIds: [2],
      categories: [{ id: 2, name: 'Одяг', ruName: 'Одежда', slug: 'clothing' }],
      mainPhoto: null,
      createdAtUtc: '2026-09-01T00:00:00Z',
      updatedAtUtc: null,
      minimumWholesalePrice: 10,
      photos: [
        { mediaFileId: 4, url: '/photo', alt: 'Фото', isMain: true, isVisible: true, sortOrder: 0 },
      ],
      informationBlocks: [
        { titleUk: 'UA', titleRu: 'RU', textUk: 'Текст', textRu: 'Текст', sortOrder: 0 },
      ],
      characteristicTables: [
        {
          titleUk: 'Розмір',
          titleRu: 'Размер',
          sortOrder: 0,
          rows: [
            { labelUk: 'Колір', labelRu: 'Цвет', valueUk: 'Синій', valueRu: 'Синий', sortOrder: 0 },
          ],
        },
      ],
      sewing: {
        metersPerProduct: 2,
        fabrics: [{ fabricId: 3, name: 'Тканина', price: 5, isPrimary: true, sortOrder: 0 }],
        accessories: [
          { garmentAccessoryId: 7, name: 'Ґудзик', price: 1, quantity: 2, sortOrder: 0 },
        ],
        operations: [{ id: 9, name: 'Шити', minutes: 10 }],
        piecesPerShift: null,
        prices: null,
      },
      ppe: null,
    };
    const draft = draftFromDetail(detail);
    expect(draft.categoryIds).toEqual([2]);
    expect(draft.photos[0].mediaFileId).toBe(4);
    expect(draft.informationBlocks?.[0].titleUk).toBe('UA');
    expect(draft.characteristicTables?.[0].rows[0].valueUk).toBe('Синій');
    expect(draft.type === 'Sewing' && draft.fabrics[0].fabricId).toBe(3);
  });
});
