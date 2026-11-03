export const environment = {
  production: false,
  enableHttpLogs: true,

  app: {
    name: 'Brevi Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://localhost:7142',
  },

  features: {
    dashboard: true,
    catalog: true,
  },
  logging: {
    enabled: false,
    endpoint: null,
    sampleRate: 1,
  },
};
