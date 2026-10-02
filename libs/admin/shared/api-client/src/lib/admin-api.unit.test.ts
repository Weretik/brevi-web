import { describe, expect, it } from 'vitest';

import { adminApi, createAdminApiStore } from '..';

describe('adminApi foundation', () => {
  it('registers one canonical reducer and middleware path', () => {
    const adminStore = createAdminApiStore();
    expect(adminApi.reducerPath).toBe('adminApi');
    expect(adminStore.getState()).toHaveProperty('adminApi');
  });
});
