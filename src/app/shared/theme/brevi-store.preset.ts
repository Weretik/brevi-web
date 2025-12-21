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
      },
    },
  },
});

export default BreviStorePreset;
