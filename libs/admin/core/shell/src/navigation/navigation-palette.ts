/**
 * Colors of the always-dark navigation sidebar. The app theme owns the values;
 * the shell reads them from `theme.palette.navigation`.
 */
export interface NavigationPalette {
  background: string;
  text: string;
  textMuted: string;
  hover: string;
  divider: string;
  activeBackground: string;
  activeText: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    navigation: NavigationPalette;
  }

  interface PaletteOptions {
    navigation?: NavigationPalette;
  }
}

/** Used when the app theme does not define `palette.navigation` (for example in tests). */
const fallbackNavigationPalette: NavigationPalette = {
  background: '#1e1e1e',
  text: '#f0f0f0',
  textMuted: '#b5b5ae',
  hover: '#2a2a28',
  divider: '#2e2e2c',
  activeBackground: '#fd9600',
  activeText: '#1d1d1d',
};

export function getNavigationPalette(theme: { palette: { navigation?: NavigationPalette } }) {
  return theme.palette.navigation ?? fallbackNavigationPalette;
}
