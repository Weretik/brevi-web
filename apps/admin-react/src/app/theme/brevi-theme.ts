import { ukUA as materialUkUA } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { ukUA as dataGridUkUA } from '@mui/x-data-grid/locales';
import type {} from '@mui/x-data-grid/themeAugmentation';

import { breviBrand, darkPalette, lightPalette } from './brevi-palette';

import type { ThemeOptions } from '@mui/material/styles';

const sharedThemeOptions: ThemeOptions = {
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: 320 },
        ':focus-visible': { outline: `2px solid ${breviBrand}`, outlineOffset: 2 },
      },
    },
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
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
