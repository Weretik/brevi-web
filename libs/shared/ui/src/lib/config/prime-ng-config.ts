export function createPrimeNgConfig(preset: object) {
  return {
    theme: {
      preset,
      options: {
        prefix: 'p',
        darkModeSelector: '.my-app-dark',
        cssLayer: false,
      },
    },
    ripple: true,
    inputVariant: 'filled' as const,
    zIndex: {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100,
    },
  };
}
