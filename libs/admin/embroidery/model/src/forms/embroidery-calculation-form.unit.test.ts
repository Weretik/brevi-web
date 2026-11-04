import { describe, expect, it } from 'vitest';

import {
  embroideryValuesFromRequest,
  emptyEmbroideryCalculation,
  isEmbroideryExpenseTicked,
  needsEmbroideryMachineTime,
  tickEmbroideryExpense,
  toEmbroideryCalculationRequest,
  visibleEmbroideryExpenses,
} from './embroidery-calculation-form';
import { validateEmbroideryCalculation } from '../validators/embroidery-calculation-validation';

import type { EmbroideryFormSetup } from '../entities/embroidery-form-setup';

const setup: EmbroideryFormSetup = {
  seesCost: false,
  hoops: [
    { id: '15', label: '15 см', blankWidthCm: 18, blankLengthCm: 18 },
    { id: '18', label: '18 см', blankWidthCm: 22, blankLengthCm: 22 },
    { id: '32', label: '32 см', blankWidthCm: 40, blankLengthCm: 40 },
  ],
  expenses: [
    { id: 'glue', name: 'Клей', basis: 'Hoop', mode: 'All', enabled: true, hasRate: true },
    {
      id: 'edge',
      name: 'Обробка краю',
      basis: 'Unit',
      mode: 'ChevronOnly',
      enabled: true,
      hasRate: true,
    },
    {
      id: 'machine',
      name: 'Машина',
      basis: 'MachineHour',
      mode: 'All',
      enabled: false,
      hasRate: true,
    },
  ],
  markupNames: ['Опт', 'Стандарт', 'Терміново'],
  settingsUpdatedAt: null,
};

describe('«Розрахунок» form', () => {
  it('starts on the middle hoop and waits for quantity and stitches', () => {
    const values = emptyEmbroideryCalculation(setup);
    expect(values.hoopId).toBe('18');
    expect(toEmbroideryCalculationRequest(values)).toBeNull();
    expect(validateEmbroideryCalculation(values)).toEqual({});
  });

  it('builds the request and ignores chevron fields on garments', () => {
    const values = {
      ...emptyEmbroideryCalculation(setup),
      quantity: 50,
      stitchesPerUnit: 10_000,
      unitsPerHoop: null,
    };
    expect(validateEmbroideryCalculation(values)).toEqual({});
    expect(toEmbroideryCalculationRequest(values)).toMatchObject({
      unitsPerHoop: 1,
      programMinutes: 60,
    });
    expect(validateEmbroideryCalculation({ ...values, mode: 'Chevron' })).toHaveProperty(
      'unitsPerHoop',
    );
  });

  it('sends no development time for a ready program', () => {
    const values = {
      ...emptyEmbroideryCalculation(setup),
      quantity: 1,
      stitchesPerUnit: 1,
      program: 'Ready' as const,
      programMinutes: null,
    };
    expect(validateEmbroideryCalculation(values)).toEqual({});
    expect(toEmbroideryCalculationRequest(values)?.programMinutes).toBe(0);
  });

  it('keeps only ticks that differ from «Налаштування»', () => {
    const glue = setup.expenses[0]!;
    const values = emptyEmbroideryCalculation(setup);
    const off = tickEmbroideryExpense(values, glue, false);
    expect(off.expenseOverrides).toEqual({ glue: false });
    expect(isEmbroideryExpenseTicked(off, glue)).toBe(false);
    expect(tickEmbroideryExpense(off, glue, true).expenseOverrides).toEqual({});
  });

  it('shows chevron costs and the machine time only when they apply', () => {
    const values = emptyEmbroideryCalculation(setup);
    expect(visibleEmbroideryExpenses(setup, 'Garment').map((x) => x.id)).toEqual([
      'glue',
      'machine',
    ]);
    expect(visibleEmbroideryExpenses(setup, 'Chevron')).toHaveLength(3);
    expect(needsEmbroideryMachineTime(setup, values)).toBe(false);
    expect(
      needsEmbroideryMachineTime(setup, tickEmbroideryExpense(values, setup.expenses[2]!, true)),
    ).toBe(true);
  });

  it('rejects fractions and zero', () => {
    const values = { ...emptyEmbroideryCalculation(setup), quantity: 0, stitchesPerUnit: 1.5 };
    expect(Object.keys(validateEmbroideryCalculation(values))).toEqual([
      'quantity',
      'stitchesPerUnit',
    ]);
  });
});

describe('embroideryValuesFromRequest', () => {
  it('loads a saved form and drops hoops and costs that no longer exist', () => {
    const values = embroideryValuesFromRequest(
      {
        mode: 'Chevron',
        quantity: 120,
        stitchesPerUnit: 8000,
        hoopId: 'gone',
        unitsPerHoop: 4,
        stabilizerLayers: 2,
        fabricLayers: 1,
        program: 'Ready',
        programMinutes: 0,
        machineMinutes: null,
        materialMode: 'FullCut',
        expenseOverrides: { glue: false, removed: true },
      },
      setup,
    );

    expect(values.quantity).toBe(120);
    expect(values.hoopId).toBe('18');
    expect(values.programMinutes).toBe(60);
    expect(values.expenseOverrides).toEqual({ glue: false });
  });
});
