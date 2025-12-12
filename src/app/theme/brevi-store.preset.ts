import { definePreset, palette } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

const BreviStorePreset = definePreset(Lara, {
  global: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: '10px',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '#fd9600',
    },
  },
  semantic: {
    primary: palette('#fd9600'),
    neutral: palette('#333333'),
    surface: {
      0: '#ffffff',
      50: '#f8f9fa',
      100: '#f1f3f5',
      200: '#e9ecef',
      // dark-mode
      700: '#222222',
      800: '#1a1a1a',
      900: '#111111',
    },
    info: palette('#0ea5e9'),
    success: palette('#22c55e'),
    warning: palette('#facc15'),
    danger: palette('#ef4444'),

    colorScheme: {
      light: {
        primary: {
          color: '#fd9600',
          inverseColor: '#ffffff',
          hoverColor: '#e58300',
          activeColor: '#cc7500',
        },
        neutral: {
          color: '#333333',
          hoverColor: '#111111',
        },
        surface: {
          0: '{surface.0}',
          50: '{surface.50}',
          100: '{surface.100}',
          200: '{surface.200}',
        },
      },
      dark: {
        primary: {
          color: '#fd9600',
          inverseColor: '#000000',
          hoverColor: '#e58300',
          activeColor: '#cc7500',
        },
        neutral: {
          color: '#e5e5e5',
          hoverColor: '#ffffff',
        },
        surface: {
          0: '{surface.900}',
          50: '{surface.800}',
          100: '{surface.700}',
        },
      },
    },
  },
});

export default BreviStorePreset;
