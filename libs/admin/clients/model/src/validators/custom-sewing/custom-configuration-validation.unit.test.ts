import { describe, expect, it } from 'vitest';

import { customConfigurationErrors } from './custom-configuration-validation';
import {
  customFabricAlternative,
  emptyCustomConfiguration,
} from '../../mappers/custom-sewing/custom-draft';

const configuration = () => ({
  ...emptyCustomConfiguration(),
  name: 'Куртка',
  productType: 'Куртка',
});

describe('custom sewing form rules', () => {
  it('uses the backend material unit length boundary', () => {
    const value = {
      ...configuration(),
      fabrics: [{ referenceId: 1, quantity: 1, unit: 'x'.repeat(50) }],
    };
    expect(customConfigurationErrors(value)).toEqual({});
    expect(
      customConfigurationErrors({
        ...value,
        fabrics: [{ ...value.fabrics[0]!, unit: 'x'.repeat(51) }],
      }),
    ).toHaveProperty('fabrics');
  });

  it('preserves repeated material and operation rows accepted by the backend', () => {
    expect(
      customConfigurationErrors(
        {
          ...configuration(),
          fabrics: [
            { referenceId: 1, quantity: 1, unit: 'Metre' },
            { referenceId: 1, quantity: 2, unit: 'Metre' },
          ],
          operations: [
            { referenceId: 2, quantity: 1, manualMinutes: null },
            { referenceId: 2, quantity: 2, manualMinutes: 3 },
          ],
        },
        true,
      ),
    ).toEqual({});
  });

  it('keeps incomplete composition editable but requires fabric and operation for calculation', () => {
    expect(customConfigurationErrors(configuration())).toEqual({});
    expect(customConfigurationErrors(configuration(), true)).toMatchObject({
      fabrics: expect.any(String),
      operations: expect.any(String),
    });
  });
  it('rejects missing/zero norms without calculating prices', () => {
    const value = {
      ...configuration(),
      fabrics: [
        { referenceId: 1, quantity: 0, unit: 'Metre' },
        { referenceId: 1, quantity: 2, unit: 'Metre' },
      ],
      operations: [{ referenceId: 2, quantity: 1, manualMinutes: 0 }],
    };
    expect(customConfigurationErrors(value, true)).toMatchObject({
      fabrics: expect.any(String),
      operations: expect.any(String),
    });
  });
  it('creates independent fabric alternatives without carrying artwork or a server basis', () => {
    const value = { ...configuration(), fabrics: [{ referenceId: 1, quantity: 2, unit: 'Metre' }] };
    const alternative = customFabricAlternative(value);
    expect(alternative.fabrics).not.toBe(value.fabrics);
    expect(alternative.fabrics[0]).not.toBe(value.fabrics[0]);
    expect(alternative).not.toHaveProperty('basis');
    expect(value.name).toBe('Куртка');
  });
});
