import { routerLinkComponents } from '@admin/shared/routing';
import { PageRightsProvider } from '@admin/shared/ui';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { ReferenceRowMenu } from './reference-row-menu';

import type { CanDo, PageAction } from '@admin/shared/ui';

function renderMenu(granted: readonly PageAction[], deleteRight?: PageAction) {
  const can: CanDo = (action) => granted.includes(action);
  render(
    <MemoryRouter>
      <PageRightsProvider can={can}>
        <ReferenceRowMenu
          row={{ id: 1, name: 'Габардин' }}
          anchorPosition={{ left: 0, top: 0 }}
          fallbackLabel="Дії"
          onClose={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          deleteLabel="В архів"
          deleteRight={deleteRight}
        />
      </PageRightsProvider>
    </MemoryRouter>,
  );
}

const linkTheme = createTheme({ components: routerLinkComponents });

describe('ReferenceRowMenu full card link', () => {
  it('opens the full card through the router without importing it', () => {
    render(
      <ThemeProvider theme={linkTheme}>
        <MemoryRouter initialEntries={['/references/fabrics']}>
          <Routes>
            <Route
              element={
                <ReferenceRowMenu
                  row={{ id: 7, name: 'Габардин' }}
                  anchorPosition={{ left: 0, top: 0 }}
                  fallbackLabel="Дії"
                  onClose={vi.fn()}
                  onView={vi.fn()}
                  onEdit={vi.fn()}
                  onDelete={vi.fn()}
                  openHref={(row) => `/references/fabrics/${row.id}`}
                />
              }
              path="/references/fabrics"
            />
            <Route element={<h1>Картка тканини</h1>} path="/references/fabrics/7" />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Відкрити повну картку' }));

    expect(screen.getByRole('heading', { name: 'Картка тканини' })).toBeInTheDocument();
  });
});

describe('ReferenceRowMenu and «Права доступу»', () => {
  it('shows only viewing to a role that may only see the page', () => {
    renderMenu([]);
    expect(screen.getByRole('menuitem', { name: 'Переглянути' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Редагувати' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'В архів' })).not.toBeInTheDocument();
  });

  it('shows archiving to a role with «Редагувати» when it needs the edit right', () => {
    renderMenu(['edit'], 'edit');
    expect(screen.getByRole('menuitem', { name: 'Редагувати' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'В архів' })).toBeInTheDocument();
  });
});
