import { definePreset, palette } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

import { tokens } from './tokens';

export const BreviStorePreset = definePreset(Lara, {
  global: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: '10px',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: tokens.colors.primary,
      offset: '2px',
    },
  },

  semantic: {
    primary: palette(tokens.colors.primary),
    neutral: palette(tokens.colors.neutral),

    info: palette(tokens.colors.info),
    success: palette(tokens.colors.success),
    warning: palette(tokens.colors.warning),
    danger: palette(tokens.colors.danger),
  },
});
