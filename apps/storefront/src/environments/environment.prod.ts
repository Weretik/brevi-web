export const environment = {
  production: true,
  enableHttpLogs: false,

  app: {
    name: 'Brevi Store',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://api.brevi.com.ua/storefront',
    timeoutMs: 15000,
  },

  features: {
    home: true,
    catalog: true,
  },
  logging: {
    enabled: true,
    level: 'debug',
  },
};
