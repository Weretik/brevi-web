import { describe, expect, it } from 'vitest';

import { formatKyivDateTime, fromKyivInput, toKyivInput } from './kyiv-time';

describe('Kyiv time', () => {
  it('shows an instant in Kyiv time in winter and summer', () => {
    expect(formatKyivDateTime('2026-11-16T07:00:00Z')).toBe('16.11.2026, 09:00');
    expect(formatKyivDateTime('2026-07-01T06:00:00Z')).toBe('01.07.2026, 09:00');
    expect(formatKyivDateTime(null)).toBe('—');
  });

  it('turns a Kyiv wall time into an instant and back', () => {
    expect(fromKyivInput('2026-11-16T09:00')).toBe('2026-11-16T07:00:00.000Z');
    expect(fromKyivInput('2026-07-01T09:00')).toBe('2026-07-01T06:00:00.000Z');
    expect(toKyivInput('2026-11-16T07:00:00Z')).toBe('2026-11-16T09:00');
    expect(fromKyivInput('16.11.2026')).toBeNull();
  });
});
