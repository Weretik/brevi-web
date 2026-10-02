import { describe, expect, it } from 'vitest';

import { apiUrl, configureApiEnvironment } from './api-environment';

describe('apiUrl', () => {
  it('keeps relative paths in development', () => {
    configureApiEnvironment({ production: false, api: { baseUrl: 'https://api.example.test' } });
    expect(apiUrl('/api/products')).toBe('/api/products');
  });

  it('joins a production base URL without a duplicate slash', () => {
    configureApiEnvironment({ production: true, api: { baseUrl: 'https://api.example.test/' } });
    expect(apiUrl('/api/products')).toBe('https://api.example.test/api/products');
  });
});
