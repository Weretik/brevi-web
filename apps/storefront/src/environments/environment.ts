export const environment = {
  production: false,
  enableHttpLogs: true,

  app: {
    name: 'Brevi Store',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'http://localhost:5000/storefront',
  },

  features: {
    home: true,
    catalog: true,
  },
};
