import { describe, expect, it } from 'vitest';

import { fabricNormBody, fabricNormTotal, validateFabricNorm } from './fabric-norm-form';
import { validateWorkshopEmployee, workshopEmployeeBody } from './workshop-employee-form';

const empty = {
  oneColor: '',
  twoColorsMain: '',
  twoColorsAdditional: '',
  threeColorsMain: '',
  threeColorsAdditional1: '',
  threeColorsAdditional2: '',
};

describe('fabric norm form', () => {
  it('accepts a comma and sums a split norm', () => {
    const values = { ...empty, twoColorsMain: '3,35', twoColorsAdditional: '0.25' };
    expect(validateFabricNorm(values)).toEqual({});
    expect(fabricNormTotal(values, ['twoColorsMain', 'twoColorsAdditional'])).toBe(3.6);
    expect(fabricNormBody(values)).toMatchObject({ twoColorsMain: 3.35, oneColor: null });
  });

  it('needs the main fabric, at least one value and at most 3 decimals', () => {
    expect(
      validateFabricNorm({ ...empty, twoColorsAdditional: '0.4' }).twoColorsMain,
    ).toBeDefined();
    expect(validateFabricNorm(empty).norm).toBeDefined();
    expect(validateFabricNorm({ ...empty, oneColor: '1.2345' }).oneColor).toBeDefined();
    expect(validateFabricNorm({ ...empty, oneColor: 'abc' }).oneColor).toBeDefined();
  });
});

describe('workshop employee form', () => {
  it('trims extra spaces and needs both fields', () => {
    expect(workshopEmployeeBody({ fullName: '  Олена   Коваль ', position: ' Швачка ' })).toEqual({
      fullName: 'Олена Коваль',
      position: 'Швачка',
    });
    expect(Object.keys(validateWorkshopEmployee({ fullName: ' ', position: '' }))).toEqual([
      'fullName',
      'position',
    ]);
  });
});
