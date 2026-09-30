import { createTheme } from '@mui/material/styles';

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

export const lightTheme = createTheme({ ...sharedThemeOptions, palette: lightPalette });
export const darkTheme = createTheme({ ...sharedThemeOptions, palette: darkPalette });
