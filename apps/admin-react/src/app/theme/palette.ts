import type { NavigationPalette } from '@admin/core/shell';
import type { PaletteOptions } from '@mui/material/styles';

/** Brevi brand orange. A fill and focus color only, never body text. */
export const breviBrand = '#fd9600';

/** Graphite text on an orange fill. */
const onBrand = '#1d1d1d';

const navigationBase: Omit<NavigationPalette, 'background' | 'hover' | 'divider'> = {
  text: '#f0f0f0',
  textMuted: '#b5b5ae',
  activeBackground: breviBrand,
  activeText: onBrand,
};

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: { main: breviBrand, light: '#fff3e0', dark: '#9a5a00', contrastText: onBrand },
  secondary: { main: '#1f1f1f', contrastText: '#ffffff' },
  success: { main: '#1f7a3a', light: '#e5f3e8', contrastText: '#ffffff' },
  warning: { main: '#8a5a00', light: '#fff0d1', contrastText: '#ffffff' },
  error: { main: '#b42318', light: '#fde9e7', contrastText: '#ffffff' },
  info: { main: '#175cd3', light: '#e6eefc', contrastText: '#ffffff' },
  background: { default: '#eeeeeb', paper: '#ffffff' },
  text: { primary: '#1f1f1f', secondary: '#5f5f5a' },
  divider: '#e3e3df',
  action: { hover: '#f4f4f1', selected: '#fff3e0' },
  navigation: { ...navigationBase, background: '#1e1e1e', hover: '#2a2a28', divider: '#2e2e2c' },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: { main: breviBrand, light: '#2b2113', dark: '#ffb547', contrastText: onBrand },
  secondary: { main: '#f0f0f0', contrastText: '#1f1f1f' },
  success: { main: '#6cd08a', light: '#132619', contrastText: onBrand },
  warning: { main: '#ffc864', light: '#2a2110', contrastText: onBrand },
  error: { main: '#ff8a80', light: '#2e1513', contrastText: onBrand },
  info: { main: '#8db4ff', light: '#141f33', contrastText: onBrand },
  background: { default: '#09090b', paper: '#17171b' },
  text: { primary: '#f0f0f0', secondary: '#a6a6ae' },
  divider: '#26262c',
  action: { hover: '#1f1f24', selected: '#2b2113' },
  navigation: { ...navigationBase, background: '#0f0f12', hover: '#1c1c21', divider: '#202024' },
};
