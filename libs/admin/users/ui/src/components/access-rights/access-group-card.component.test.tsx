import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessGroupCard } from './access-group-card';

import type { AccessAreaGroup } from '@admin/users/model';

const group: AccessAreaGroup = {
  title: 'Довідники',
  areas: [
    { key: 'products', group: 'Довідники', title: 'Товари', actions: ['view', 'create', 'edit'] },
    { key: 'fabrics', group: 'Довідники', title: 'Тканини', actions: ['view'] },
  ],
};

const renderCard = (grants: Record<string, ('view' | 'create' | 'edit' | 'delete')[]>) => {
  const onViewChange = vi.fn();
  const onActionChange = vi.fn();
  render(
    <AccessGroupCard
      disabled={false}
      grants={grants}
      group={group}
      onActionChange={onActionChange}
      onViewChange={onViewChange}
    />,
  );
  return { onActionChange, onViewChange };
};

describe('AccessGroupCard', () => {
  it('shows how many pages the role sees and only the actions a page has', () => {
    renderCard({ products: ['view', 'edit'] });

    expect(screen.getByText('1 з 2 сторінок')).toBeTruthy();
    expect((screen.getByLabelText('Редагувати: Товари') as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByLabelText('Видаляти: Товари')).toBeNull();
    expect(screen.queryByLabelText('Створювати: Тканини')).toBeNull();
  });

  it('disables actions of a page the role does not see', () => {
    const { onViewChange } = renderCard({});

    expect(screen.getByText('немає доступу')).toBeTruthy();
    expect((screen.getByLabelText('Створювати: Товари') as HTMLInputElement).disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('Бачить: Товари'));
    expect(onViewChange).toHaveBeenCalledWith('products', true);
  });

  it('reports an action change', () => {
    const { onActionChange } = renderCard({ products: ['view'] });

    fireEvent.click(screen.getByLabelText('Створювати: Товари'));
    expect(onActionChange).toHaveBeenCalledWith('products', 'create', true);
  });
});
