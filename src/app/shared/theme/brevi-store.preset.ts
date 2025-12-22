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
  },
});

export default BreviStorePreset;
