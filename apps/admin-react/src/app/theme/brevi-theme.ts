import { ukUA as materialUkUA } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { ukUA as dataGridUkUA } from '@mui/x-data-grid/locales';
import type {} from '@mui/x-data-grid/themeAugmentation';

import { components } from './components';
import { motion } from './motion';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';

import type { ThemeOptions } from '@mui/material/styles';

const sharedThemeOptions: ThemeOptions = {
  shape: { borderRadius: 8 },
  typography,
  transitions: {
    duration: {
      shortest: motion.duration.fast,
      shorter: motion.duration.fast,
      short: motion.duration.base,
      standard: motion.duration.base,
      complex: motion.duration.slow,
      enteringScreen: motion.duration.base,
      leavingScreen: motion.duration.fast,
    },
    easing: { easeOut: motion.easing.out },
  },
  components,
};

const missingDataGridUkUA: ThemeOptions = {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          columnMenuAriaLabel: (columnName: string) => `Меню стовпця ${columnName}`,
        },
      },
    },
  },
};

function createBreviTheme(palette: ThemeOptions['palette']) {
  return createTheme(
    { ...sharedThemeOptions, palette },
    materialUkUA,
    dataGridUkUA,
    missingDataGridUkUA,
  );
}

export const lightTheme = createBreviTheme(lightPalette);
export const darkTheme = createBreviTheme(darkPalette);
