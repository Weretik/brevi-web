export const environment = {
  production: true,
  enableHttpLogs: false,

  app: {
    name: 'Brevi Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://brevierp-api-443622778364.europe-central2.run.app',
    timeoutMs: 15000,
  },

  features: {
    dashboard: true,
    catalog: true,
  },
  logging: {
    enabled: true,
    endpoint: null,
    sampleRate: 1,
  },
};
