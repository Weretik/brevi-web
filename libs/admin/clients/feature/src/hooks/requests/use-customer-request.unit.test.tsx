import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useCustomerRequest } from './use-customer-request';

describe('logical CRM request replay', () => {
  it('reuses a request key for the same payload and changes it only for a new intent/revision', () => {
    const { result } = renderHook(() => useCustomerRequest());
    const first = result.current({ name: 'Synthetic', revision: 1 });
    expect(result.current({ name: 'Synthetic', revision: 1 })).toBe(first);
    expect(result.current({ name: 'Synthetic', revision: 2 })).not.toBe(first);
  });
});
