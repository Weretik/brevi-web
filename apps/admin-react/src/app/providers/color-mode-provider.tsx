import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useState } from 'react';

import { darkTheme, lightTheme } from '../theme/brevi-theme';
import { readColorMode, saveColorMode } from '../theme/color-mode';

import type { AdminColorMode } from '@admin/core/shell';
import type { PropsWithChildren } from 'react';

interface ColorModeContextValue {
  colorMode: AdminColorMode;
  changeColorMode: (mode: AdminColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useAdminColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('Admin color mode provider is missing');
  }
  return context;
}

export function ColorModeProvider({ children }: PropsWithChildren) {
  const [colorMode, setColorMode] = useState<AdminColorMode>(readColorMode);
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme =
    colorMode === 'dark' || (colorMode === 'system' && systemIsDark) ? darkTheme : lightTheme;

  const changeColorMode = (mode: AdminColorMode) => {
    setColorMode(mode);
    saveColorMode(mode);
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, changeColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
