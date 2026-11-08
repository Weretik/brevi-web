import { describe, expect, it } from 'vitest';

import { axiosClient } from './axios-client';

describe('axiosClient', () => {
  it('sends a list as repeated keys, the way the backend binds it', () => {
    expect(axiosClient.getUri({ url: '/api/x', params: { ids: [30, 46] } })).toBe(
      '/api/x?ids=30&ids=46',
    );
  });
});
