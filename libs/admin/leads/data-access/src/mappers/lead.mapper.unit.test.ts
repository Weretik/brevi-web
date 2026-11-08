import { describe, expect, it } from 'vitest';

import { toRecordLeadCallInput, toSaveLeadCallResultInput } from './lead-input.mapper';
import { mapLeadCallResults } from './lead.mapper';

describe('lead mappers', () => {
  it('sorts call results by position', () => {
    const results = mapLeadCallResults([
      { id: 2, name: 'Б', outcome: 'Closed', retryDays: null, isActive: true, position: 5 },
      { id: 1, name: 'А', outcome: 'Retry', retryDays: 2, isActive: true, position: 1 },
    ]);
    expect(results.map((x) => x.name)).toEqual(['А', 'Б']);
  });

  it('sends the call with a trimmed comment and an ISO date', () => {
    const body = toRecordLeadCallInput(
      { resultId: 4, nextContactAt: '2026-11-12T11:00', comment: '  ' },
      3,
    );
    expect(body).toEqual({
      resultId: 4,
      comment: null,
      nextContactAt: new Date(2026, 10, 12, 11, 0).toISOString(),
      version: 3,
    });
  });

  it('keeps retry days only for a retry', () => {
    const base = { name: ' Передзвонити ', retryDays: '3', isActive: true, position: '2' } as const;
    expect(toSaveLeadCallResultInput({ ...base, outcome: 'Callback' })).toEqual({
      name: 'Передзвонити',
      outcome: 'Callback',
      retryDays: null,
      isActive: true,
      position: 2,
    });
    expect(toSaveLeadCallResultInput({ ...base, outcome: 'Retry' }).retryDays).toBe(3);
  });
});
