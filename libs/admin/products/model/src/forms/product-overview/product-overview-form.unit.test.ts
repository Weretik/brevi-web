import { describe, expect, it } from 'vitest';

import { createProductOverviewFormValues, productOverviewBody } from './product-overview-form';
import { validateProductOverview } from '../../validators/product-overview/product-overview-validation';

import type { ProductOverview } from '../../entities/product-overview/product-overview';

const sewing: ProductOverview = {
  id: 7,
  type: 'Sewing',
  code: 'MOD-025',
  name: 'Костюм «Верде»',
  sectionId: 2,
  season: 'Літо',
  isActive: true,
  currentSiteUrl: 'https://brevi.com.ua/specodyag-litnij/kostyum-verde',
  quoteDescription: 'Костюм із курткою та штанами.',
  updatedAtUtc: '2026-11-03T10:00:00Z',
};

describe('product overview form', () => {
  it('keeps the check date while the row stays checked', () => {
    const values = createProductOverviewFormValues(sewing);
    expect(productOverviewBody(values, sewing)).toEqual({
      code: 'MOD-025',
      sectionId: 2,
      season: 'Літо',
      isActive: true,
      currentSiteUrl: 'https://brevi.com.ua/specodyag-litnij/kostyum-verde',
      quoteDescription: 'Костюм із курткою та штанами.',
    });
  });

  it('sends no date for a newly checked row and no season for PPE', () => {
    const ppe: ProductOverview = {
      ...sewing,
      type: 'Ppe',
      code: '3',
    };
    const values = {
      ...createProductOverviewFormValues(ppe),
      season: 'Зима' as const,
    };
    expect(productOverviewBody(values, ppe)).toMatchObject({
      season: null,
    });
  });

  it('needs a site article for PPE and an http link', () => {
    const values = {
      ...createProductOverviewFormValues(sewing),
      code: ' ',
      currentSiteUrl: 'brevi.com.ua',
    };
    expect(validateProductOverview(values, 'Ppe')).toEqual({
      code: 'Вкажіть артикул сайту.',
      currentSiteUrl: 'Посилання має починатися з https:// і бути до 500 символів.',
    });
    expect(validateProductOverview(values, 'Sewing').code).toBeUndefined();
  });
});
