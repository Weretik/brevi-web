import { SuppliersGrid } from '@admin/references/ui';
import { ThemeProvider } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { darkTheme, lightTheme } from './brevi-theme';

describe('suppliers table with the Brevi theme', () => {
  it.each([
    ['light', lightTheme],
    ['dark', darkTheme],
  ] as const)('preserves shared Ukrainian column-menu labels in %s mode', (_mode, theme) => {
    render(
      <ThemeProvider theme={theme}>
        <SuppliersGrid
          rows={[]}
          loading={false}
          selection={{ type: 'include', ids: new Set() }}
          onSelectionChange={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </ThemeProvider>,
    );
    const header = screen.getByRole('columnheader', { name: 'Назва' });
    const menuButton = within(header).getByLabelText(/column menu|Меню стовпця/);
    expect(menuButton).toHaveAttribute('aria-label', 'Меню стовпця Назва');
  });
});
