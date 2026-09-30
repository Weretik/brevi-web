import { BrowserRouter } from 'react-router-dom';

import { ColorModeProvider } from './color-mode-provider';

import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ColorModeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ColorModeProvider>
  );
}
