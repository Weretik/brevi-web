export const environment = {
  production: true,

  app: {
    name: 'Brevi Web',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://api.brevi.com.ua/api',
    timeoutMs: 15000,
  },

  features: {
    admin: true,
    storefront: true,
  },
  logging: {
    enabled: true,
    level: 'debug',
  },
};
