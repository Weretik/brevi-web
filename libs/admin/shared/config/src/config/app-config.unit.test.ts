import { describe, expect, it } from 'vitest';

import { createAppConfig } from './app-config';

describe('createAppConfig', () => {
  it('maps the Brevi environment and applies stable optional defaults', () => {
    expect(
      createAppConfig({
        production: true,
        enableHttpLogs: true,
        app: { name: 'Brevi Admin', version: '2.0.0' },
        api: { baseUrl: 'https://api.brevi.test/' },
        features: { catalog: false, dashboard: true },
      }),
    ).toEqual({
      anonymousAccess: false,
      apiBaseUrl: 'https://api.brevi.test',
      enableHttpLogs: true,
      features: { catalog: false, dashboard: true },
      isDevelopment: false,
      name: 'Brevi Admin',
      routerBasename: '/',
      version: '2.0.0',
    });
  });

  it('uses Brevi defaults without inventing Kedr configuration', () => {
    expect(createAppConfig({ production: false })).toEqual({
      anonymousAccess: false,
      apiBaseUrl: '',
      enableHttpLogs: false,
      features: { catalog: true, dashboard: true },
      isDevelopment: true,
      name: 'Brevi Admin',
      routerBasename: '/',
      version: '0.1.0',
    });
  });
  it.each([false, true])('normalizes explicit anonymous access for production=%s', (production) => {
    expect(createAppConfig({ production, auth: { anonymousAccess: true } }).anonymousAccess).toBe(
      true,
    );
  });
});
