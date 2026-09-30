import type { PaletteOptions } from '@mui/material/styles';

export const breviBrand = '#fd9600';

const semanticColors = {
  primary: { main: breviBrand, contrastText: '#1d1d1d' },
  secondary: { main: '#333333' },
  info: { main: '#0ea5e9' },
  success: { main: '#22c55e' },
  warning: { main: '#facc15' },
  error: { main: '#ef4444' },
};

export const lightPalette: PaletteOptions = {
  ...semanticColors,
  mode: 'light',
  background: { default: '#e6e6e6', paper: '#ffffff' },
  text: { primary: '#242424', secondary: '#555555' },
};

export const darkPalette: PaletteOptions = {
  ...semanticColors,
  mode: 'dark',
  background: { default: '#09090b', paper: '#17171b' },
  text: { primary: '#f5f5f5', secondary: '#c4c4c8' },
};
