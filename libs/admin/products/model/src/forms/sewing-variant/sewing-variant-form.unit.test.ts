import { describe, expect, it } from 'vitest';

import {
  createSewingVariantFormValues,
  parseSewingMetres,
  sewingVariantInput,
} from './sewing-variant-form';
import { validateSewingVariant } from '../../validators/sewing-variant/sewing-variant-validation';

import type { SewingArticle } from '../../entities/sewing-articles/sewing-article';

const variant: SewingArticle = {
  id: 11,
  productId: 42,
  saleSku: '602',
  active: true,
  sortOrder: 0,
  fabricId: 59,
  fabricQuantity: 2.5,
};

describe('fabric variant form (CAT-015)', () => {
  it('takes the metres of the other fabrics for a new variant', () => {
    expect(createSewingVariantFormValues(null, [variant])).toEqual({
      fabricId: null,
      fabricQuantity: '2,5',
      saleSku: '',
      active: true,
    });
    expect(createSewingVariantFormValues(variant, [])).toMatchObject({
      fabricId: 59,
      saleSku: '602',
    });
  });

  it('accepts a comma and sends trimmed values', () => {
    expect(parseSewingMetres(' 2,75 ')).toBe(2.75);
    expect(
      sewingVariantInput(
        { fabricId: 59, fabricQuantity: '2,75', saleSku: ' 604 ', active: false },
        3,
        7,
      ),
    ).toEqual({
      saleSku: '604',
      active: false,
      sortOrder: 3,
      fabricId: 59,
      fabricQuantity: 2.75,
      expectedVersion: 7,
    });
  });

  it('requires a fabric, positive metres and a SKU unique in the model', () => {
    expect(
      validateSewingVariant({ fabricId: null, fabricQuantity: '0', saleSku: '602', active: true }, [
        '602',
      ]),
    ).toEqual({
      fabricId: 'Оберіть тканину.',
      fabricQuantity: 'Вкажіть розхід від 0 до 1000 м.',
      saleSku: 'Такий артикул уже є в моделі.',
    });
    expect(
      validateSewingVariant({ fabricId: 59, fabricQuantity: '2,5', saleSku: '604', active: true }, [
        '602',
      ]),
    ).toEqual({});
  });
});
