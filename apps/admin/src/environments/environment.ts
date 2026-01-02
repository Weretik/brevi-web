export const environment = {
  production: false,
  enableHttpLogs: true,

  app: {
    name: 'Brevi Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'http://localhost:5000/admin',
  },

  features: {
    dashboard: true,
    catalog: true,
  },
};
