import { describe, expect, it } from 'vitest';

import { validateSewingModel } from './sewing-model-validation';
import {
  emptySewingModelForm,
  sewingModelCreateInput,
} from '../../forms/sewing-create/sewing-model-form';

const values = {
  ...emptySewingModelForm,
  code: 'MOD-031',
  name: 'Халат «Мед»',
  sectionId: 4,
};

describe('«Нова модель» step 1', () => {
  it('requires the code, the name and the section', () => {
    expect(validateSewingModel(emptySewingModelForm)).toEqual({
      code: 'Вкажіть код моделі.',
      name: 'Вкажіть назву моделі.',
      sectionId: 'Оберіть розділ.',
    });
    expect(validateSewingModel(values)).toEqual({});
  });

  it('rejects a code another product has and a bad link', () => {
    const taken = {
      code: 'mod-031',
      isAvailable: false,
      takenByProductId: 9,
      takenByProductName: 'Костюм «Верде»',
      suggestedCode: null,
    };
    expect(validateSewingModel({ ...values, currentSiteUrl: 'brevi' }, taken)).toEqual({
      code: 'Код уже має модель «Костюм «Верде»».',
      currentSiteUrl: 'Посилання має починатися з https:// і бути до 500 символів.',
    });
    expect(validateSewingModel({ ...values, code: 'MOD-032' }, taken)).toEqual({});
    expect(validateSewingModel({ ...values, name: 'x'.repeat(201) }).name).toBe(
      'Не більше 200 символів.',
    );
  });

  it('creates an inactive, unverified sewing draft', () => {
    expect(
      sewingModelCreateInput({
        ...values,
        season: 'Літо',
        currentSiteUrl: ' ',
        quoteDescription: '',
      }),
    ).toEqual({
      type: 'Sewing',
      code: 'MOD-031',
      name: 'Халат «Мед»',
      sectionId: 4,
      season: 'Літо',
      isActive: false,
      isVerified: false,
      currentSiteUrl: null,
      quoteDescription: null,
      ppe: null,
    });
  });
});
