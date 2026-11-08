import { describe, expect, it } from 'vitest';

import { validateLeadCallForm, validateLeadCallResultForm } from './call-form-validation';

import type { LeadCallResult } from '../entities/lead';

const results: LeadCallResult[] = [
  { id: 1, name: 'Не дозвонились', outcome: 'Retry', retryDays: 1, isActive: true, position: 0 },
  {
    id: 2,
    name: 'Передзвонити',
    outcome: 'Callback',
    retryDays: null,
    isActive: true,
    position: 1,
  },
  { id: 3, name: 'Відмова', outcome: 'Closed', retryDays: null, isActive: true, position: 2 },
];
const now = new Date(2026, 10, 9, 10, 0);

describe('validateLeadCallForm', () => {
  it('needs a result', () => {
    expect(
      validateLeadCallForm({ resultId: null, nextContactAt: '', comment: '' }, results, now),
    ).toHaveProperty('resultId');
  });

  it('needs a date for a callback but not for a retry', () => {
    expect(
      validateLeadCallForm({ resultId: 2, nextContactAt: '', comment: '' }, results, now),
    ).toHaveProperty('nextContactAt');
    expect(
      validateLeadCallForm({ resultId: 1, nextContactAt: '', comment: '' }, results, now),
    ).toEqual({});
  });

  it('refuses a past date and ignores the date of a closing result', () => {
    const past = { resultId: 2, nextContactAt: '2026-11-08T10:00', comment: '' };
    expect(validateLeadCallForm(past, results, now).nextContactAt).toBe('Ця дата вже минула.');
    expect(validateLeadCallForm({ ...past, resultId: 3 }, results, now)).toEqual({});
  });
});

describe('validateLeadCallResultForm', () => {
  it('checks the name, the retry days and the position', () => {
    const errors = validateLeadCallResultForm(
      { name: ' відмова ', outcome: 'Retry', retryDays: '0', isActive: true, position: 'x' },
      results,
    );
    expect(Object.keys(errors).sort()).toEqual(['name', 'position', 'retryDays']);
  });
});
