import { describe, expect, it } from 'vitest';

import {
  changeSewingMaterialKind,
  createSewingMaterialFormValues,
  sewingMaterialFromForm,
  validateSewingMaterialForm,
} from './sewing-material-form';
import {
  createSewingOperationFormValues,
  sewingOperationFromForm,
  validateSewingOperationForm,
} from '../sewing-operation/sewing-operation-form';

describe('composition line forms (CAT-015)', () => {
  it('turns a material panel into a line and resets the reference on a new kind', () => {
    const values = { ...createSewingMaterialFormValues(null), referenceId: 10, quantity: '1,5' };
    expect(sewingMaterialFromForm(values, 'a', 2)).toMatchObject({
      kind: 'Accessory',
      referenceId: 10,
      costCode: null,
      quantity: 1.5,
      sortOrder: 2,
    });
    const other = changeSewingMaterialKind(values, 'OtherCost');
    expect(other).toMatchObject({ referenceId: null, unit: 'Service' });
    expect(validateSewingMaterialForm(other)).toEqual({ costCode: 'Вкажіть код витрати.' });
  });

  it('keeps the reference norm when the manual time is empty', () => {
    const values = { ...createSewingOperationFormValues(null), operationId: 7 };
    expect(validateSewingOperationForm(values)).toEqual({});
    expect(sewingOperationFromForm(values, 'b', 0).manualMinutes).toBeNull();
    expect(sewingOperationFromForm({ ...values, manualMinutes: '4,5' }, 'b', 0).manualMinutes).toBe(
      4.5,
    );
    expect(validateSewingOperationForm({ ...values, manualMinutes: '0' })).toEqual({
      manualMinutes: 'Вкажіть час більше 0 або залиште поле порожнім.',
    });
  });
});
