import { describe, expect, it } from 'vitest';

import { createAdminApiStore } from './admin-api-provider';
import { adminApi } from './base-api';

describe('admin API foundation', () => {
  it('registers one canonical reducer and middleware path', () => {
    const adminStore = createAdminApiStore();
    expect(adminApi.reducerPath).toBe('adminApi');
    expect(adminStore.getState()).toHaveProperty('adminApi');
  });
});
