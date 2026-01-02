export const environment = {
  production: true,
  enableHttpLogs: false,

  app: {
    name: 'Brevi Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://api.brevi.com.ua/admin',
    timeoutMs: 15000,
  },

  features: {
    dashboard: true,
    catalog: true,
  },
  logging: {
    enabled: true,
    level: 'debug',
  },
};
