import { PageRightsProvider } from '@admin/shared/ui';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
