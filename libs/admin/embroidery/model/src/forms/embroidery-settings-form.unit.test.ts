import { describe, expect, it } from 'vitest';

import {
  embroideryDraftToContent,
  embroiderySettingsChangedSections,
  embroiderySettingsToDraft,
  emptyEmbroideryHoop,
  nextEmbroideryRowId,
} from './embroidery-settings-form';
import {
  embroiderySettingsErrorCounts,
  validateEmbroideryExpense,
  validateEmbroiderySettings,
} from '../validators/embroidery-settings-validation';

import type { EmbroiderySettings } from '../entities/embroidery-settings';

const settings: EmbroiderySettings = {
  version: 0,
  updatedByName: null,
  updatedAt: null,
  stitchRate: { value: 1, updatedOn: null },
  rates: { threadRate: 0.3, hoopingRate: 10, programHourRate: 300, taxPercent: 24 },
  markups: [
    { name: 'Опт', percent: 60 },
    { name: 'Стандарт', percent: 90 },
    { name: 'Терміново', percent: 120 },
  ],
  stabilizer: { pricePerMetre: 20, widthCm: 90 },
  fabric: { pricePerMetre: 80, widthCm: 150 },
  fabricIncreasePercent: 40,
  hoops: [{ id: '15', label: '15 см', blankWidthCm: 18, blankLengthCm: 18, glueRate: null }],
  expenses: [{ id: 'glue', name: 'Клей', basis: 'Hoop', rate: 4, enabled: true, mode: 'All' }],
};

describe('«Налаштування» draft', () => {
  it('round-trips the saved settings without problems', () => {
    const draft = embroiderySettingsToDraft(settings);
    expect(validateEmbroiderySettings(draft)).toEqual({});
    expect(embroideryDraftToContent(draft).markups).toEqual(settings.markups);
    expect(embroiderySettingsChangedSections(draft, draft)).toEqual([]);
  });

  it('names the changed section and counts problems by section', () => {
    const saved = embroiderySettingsToDraft(settings);
    const draft = {
      ...saved,
      fabric: { ...saved.fabric, widthCm: null },
      rates: { ...saved.rates, taxPercent: -1 },
    };
    expect(embroiderySettingsChangedSections(saved, draft)).toEqual(['rates', 'materials']);
    expect(embroiderySettingsErrorCounts(validateEmbroiderySettings(draft))).toEqual({
      rates: 1,
      materials: 1,
    });
  });

  it('needs at least one hoop and unique hoop names', () => {
    const draft = embroiderySettingsToDraft(settings);
    expect(validateEmbroiderySettings({ ...draft, hoops: [] })).toHaveProperty('hoops');
    const copy = { ...draft.hoops[0]!, id: 'hoop-1' };
    expect(validateEmbroiderySettings({ ...draft, hoops: [...draft.hoops, copy] })).toHaveProperty(
      'hoops.hoop-1.label',
    );
  });

  it('lets a rate stay empty but not negative', () => {
    const expense = settings.expenses[0]!;
    expect(validateEmbroideryExpense({ ...expense, rate: null })).toEqual({});
    expect(validateEmbroideryExpense({ ...expense, rate: -1 })).toHaveProperty('rate');
  });

  it('gives new rows a free code', () => {
    expect(nextEmbroideryRowId('hoop', [{ id: 'hoop-1' }])).toBe('hoop-2');
    expect(emptyEmbroideryHoop(settings.hoops).id).toBe('hoop-1');
  });
});
