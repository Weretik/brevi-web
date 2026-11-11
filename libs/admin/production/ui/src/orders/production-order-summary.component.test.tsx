import { emptyProductionOrderFilters } from '@admin/production/model';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ModelSummarySortEditor } from './model-summary-sort-editor';
import { ProductionModelSummaryTable } from './production-model-summary-table';
import { ProductionOrderAttention } from './production-order-attention';
import {
  ProductionOrderFilterChips,
  ProductionOrderFilterPanel,
  countProductionOrderFilters,
} from './production-order-filters';
import { ProductionStageConveyor } from './production-stage-conveyor';

import type { ModelSummarySortLevel, ProductionModelSummaryRow } from '@admin/production/model';

afterEach(cleanup);

const options = {
  clients: ['Школа'],
  models: [{ code: 'MOD-052', name: 'Куртка «Віол»' }],
  fabrics: [{ code: 'FAB-023', name: 'Грета' }],
  colors: ['Червоний'],
  seasons: ['Зима'],
};

describe('ProductionOrderFilterPanel and chips', () => {
  it('shows set filters as chips; × removes one filter', () => {
    const onChange = vi.fn();
    const onManagerChange = vi.fn();
    const onStageChange = vi.fn();
    render(
      <ProductionOrderFilterChips
        values={{ ...emptyProductionOrderFilters, model: 'MOD-052', from: '2026-10-01' }}
        options={options}
        manager="Олена"
        stage="Cutting"
        onChange={onChange}
        onManagerChange={onManagerChange}
        onStageChange={onStageChange}
      />,
    );

    expect(screen.getByText('Модель: MOD-052 · Куртка «Віол»')).toBeTruthy();
    const remove = (text: string) =>
      fireEvent.click(
        within(screen.getByText(text).closest('.MuiChip-root') as HTMLElement).getByTestId(
          'CancelIcon',
        ),
      );
    remove('Період від: 01.10.2026');
    remove('Менеджер: Олена');
    remove('Етап: Крій');

    expect(onChange).toHaveBeenCalledWith('from', null);
    expect(onManagerChange).toHaveBeenCalledWith(null);
    expect(onStageChange).toHaveBeenCalledWith(null);
    expect(
      countProductionOrderFilters({ ...emptyProductionOrderFilters, model: 'X' }, 'Олена'),
    ).toBe(2);
  });

  it('picks a client, marks a period that ends before it starts and resets', () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    render(
      <ProductionOrderFilterPanel
        open
        values={{ ...emptyProductionOrderFilters, from: '2026-11-02', to: '2026-11-01' }}
        options={options}
        manager={null}
        managers={['Олена']}
        count={3}
        onChange={onChange}
        onManagerChange={vi.fn()}
        onReset={onReset}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Замовник'), { target: { value: 'Шк' } });
    fireEvent.click(screen.getByRole('option', { name: 'Школа' }));
    fireEvent.click(screen.getByRole('button', { name: 'Скинути' }));

    expect(onChange).toHaveBeenCalledWith('client', 'Школа');
    expect(onReset).toHaveBeenCalled();
    expect(screen.getByText('Раніше за «від»')).toBeTruthy();
    expect(screen.queryByLabelText('Менеджер')).toBeNull();
    expect(screen.getByRole('button', { name: 'Показати 3' })).toBeTruthy();
  });
});

describe('ProductionStageConveyor and attention', () => {
  const stages = [
    { stage: 'New' as const, count: 2, overdue: 0 },
    { stage: 'Cutting' as const, count: 1, overdue: 1 },
    { stage: 'Complete' as const, count: 0, overdue: 0 },
  ];

  it('selects a stage, removes it on a second press and hides an empty «Завершено»', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <ProductionStageConveyor stages={stages} selected={null} onSelect={onSelect} />,
    );
    expect(screen.queryByText('Завершено')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Крій: 1, прострочено 1' }));
    expect(onSelect).toHaveBeenLastCalledWith('Cutting');

    rerender(<ProductionStageConveyor stages={stages} selected="Cutting" onSelect={onSelect} />);
    const cutting = screen.getByRole('button', { name: 'Крій: 1, прострочено 1' });
    expect(cutting.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(cutting);
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('shows nothing when every order is on time', () => {
    const { container } = render(
      <ProductionOrderAttention
        attention={{ overdue: 0, dueSoon: 0 }}
        active={false}
        onShow={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(container.textContent).toBe('');
  });

  it('warns about orders due soon and switches back to all orders', () => {
    const onReset = vi.fn();
    render(
      <ProductionOrderAttention
        attention={{ overdue: 0, dueSoon: 5 }}
        active
        onShow={vi.fn()}
        onReset={onReset}
      />,
    );
    expect(screen.getByText('5 завдань мають термін у найближчі 3 дні')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Усі завдання' }));
    expect(onReset).toHaveBeenCalled();
  });
});

describe('ModelSummarySortEditor', () => {
  const levels: ModelSummarySortLevel[] = [
    { field: 'season', direction: 'asc' },
    { field: 'model', direction: 'asc' },
  ];

  it('moves, flips, removes and adds levels', () => {
    const onChange = vi.fn();
    render(<ModelSummarySortEditor levels={levels} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Підняти: Модель' }));
    expect(onChange).toHaveBeenLastCalledWith([levels[1], levels[0]]);
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Напрям: Сезон' })).getByRole('button', {
        name: 'За спаданням',
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith([{ field: 'season', direction: 'desc' }, levels[1]]);
    fireEvent.click(screen.getByRole('button', { name: 'Прибрати: Сезон' }));
    expect(onChange).toHaveBeenLastCalledWith([levels[1]]);
    fireEvent.click(screen.getByRole('button', { name: 'Додати поле' }));
    expect(onChange).toHaveBeenLastCalledWith([...levels, { field: 'category', direction: 'asc' }]);
    expect(
      (screen.getByRole('button', { name: 'Підняти: Сезон' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});

describe('ProductionModelSummaryTable', () => {
  const row: ProductionModelSummaryRow = {
    modelCode: 'MOD-052',
    modelName: 'Куртка «Віол»',
    season: 'Зима',
    category: 'Куртка',
    quantity: 42,
    ordersCount: 3,
  };

  it('lists models with the total and opens the orders of a model', () => {
    const onView = vi.fn();
    render(<ProductionModelSummaryTable rows={[row]} totalQuantity={42} onView={onView} />);

    expect(screen.getByText('Усього виробів')).toBeTruthy();
    expect(screen.getAllByText('42')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути завдання: Куртка «Віол»' }));

    expect(onView).toHaveBeenCalledWith(row);
  });
});
