import { describe, expect, it } from 'vitest';

import { quoteDraftErrors } from './quote-draft-validation';
import { quoteSaveProblems } from './quote-save-problems';
import { emptyQuoteDraft, oneOffItemDraft } from '../mappers/editor/quote-draft-mapper';

describe('quoteSaveProblems', () => {
  it('names the client and each item by its position', () => {
    const item = { ...oneOffItemDraft(), name: '' };
    const draft = { ...emptyQuoteDraft(), items: [item] };
    const problems = quoteSaveProblems(draft, quoteDraftErrors(draft));

    expect(problems[0]).toEqual({
      text: 'Клієнт: Вкажіть клієнта або назву запиту.',
      target: 'header',
    });
    expect(problems.slice(1).every((problem) => problem.text.startsWith('Позиція 01'))).toBe(true);
    expect(problems.slice(1).every((problem) => problem.target === item.key)).toBe(true);
    expect(problems.length).toBeGreaterThan(1);
  });

  it('is empty when the КП can be saved', () => {
    expect(quoteSaveProblems({ ...emptyQuoteDraft(), internalName: 'Агро' }, {})).toEqual([]);
  });
});
