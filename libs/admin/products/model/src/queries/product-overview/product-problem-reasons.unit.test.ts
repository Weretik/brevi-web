import { describe, expect, it } from 'vitest';

import { productProblemReasons } from './product-problem-reasons';

describe('productProblemReasons', () => {
  it('turns the server codes into short Ukrainian reasons without repeats', () => {
    expect(
      productProblemReasons('Sewing', [
        'MissingOperations',
        'Unpublished',
        'MissingCost',
        'MissingMaterialCost',
      ]),
    ).toEqual(['Ціну ще не опубліковано', 'Немає трудовитрат', 'Неповна комплектація']);
    expect(productProblemReasons('Ppe', ['MissingRule'])).toEqual([
      'Не вибрано правило ціноутворення',
    ]);
    expect(productProblemReasons('Sewing', [])).toEqual([]);
  });
});
