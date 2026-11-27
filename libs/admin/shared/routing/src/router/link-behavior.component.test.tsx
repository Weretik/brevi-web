import { Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { routerLinkComponents } from './link-behavior';

import type { ReactElement } from 'react';

const theme = createTheme({ components: routerLinkComponents });

function renderAt(button: ReactElement) {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/start']}>
        <Routes>
          <Route element={button} path="/start" />
          <Route element={<h1>Каталог</h1>} path="/catalog" />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('LinkBehavior', () => {
  it('navigates in-app hrefs through the router', () => {
    renderAt(<Button href="/catalog">До каталогу</Button>);

    fireEvent.click(screen.getByRole('link', { name: 'До каталогу' }));

    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeTruthy();
  });

  it('keeps external links as plain anchors', () => {
    renderAt(<Button href="https://brevi.com.ua/uk">Сайт</Button>);

    expect(screen.getByRole('link', { name: 'Сайт' }).getAttribute('href')).toBe(
      'https://brevi.com.ua/uk',
    );
  });
});
