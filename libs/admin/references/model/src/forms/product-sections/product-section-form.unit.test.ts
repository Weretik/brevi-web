import { describe, expect, it } from 'vitest';

import { createProductSectionFormValues, productSectionBody } from './product-section-form';
import { validateProductSection } from '../../validators/product-sections/product-section-validation';

describe('product section form', () => {
  it('starts a new section as an active one of the chosen type', () => {
    expect(createProductSectionFormValues(null, 'Ppe')).toEqual({
      type: 'Ppe',
      name: '',
      isActive: true,
      comment: '',
    });
  });

  it('trims text and sends an empty comment as null', () => {
    expect(
      productSectionBody({ type: 'Sewing', name: ' Одяг ЛІТО ', isActive: false, comment: ' ' }, 4),
    ).toEqual({ type: 'Sewing', name: 'Одяг ЛІТО', isActive: false, comment: null, sortOrder: 4 });
  });

  it('needs a name and limits text', () => {
    expect(
      validateProductSection({
        type: 'Sewing',
        name: ' ',
        isActive: true,
        comment: 'я'.repeat(1001),
      }),
    ).toEqual({ name: 'Вкажіть назву розділу.', comment: 'Не більше 1000 символів.' });
  });
});
