import { emptyProductionOrderFilters } from '@admin/production/model';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ModelSummarySortEditor } from './model-summary-sort-editor';
import { ProductionModelSummaryTable } from './production-model-summary-table';
import { ProductionOrderFilters } from './production-order-filters';

import type { ModelSummarySortLevel, ProductionModelSummaryRow } from '@admin/production/model';

afterEach(cleanup);

const options = {
  clients: ['Школа'],
  models: [{ code: 'MOD-052', name: 'Куртка «Віол»' }],
  fabrics: [{ code: 'FAB-023', name: 'Грета' }],
  colors: ['Червоний'],
  seasons: ['Зима'],
};

describe('ProductionOrderFilters', () => {
  it('collapsed, shows set filters as chips that remove one filter', () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    render(
      <ProductionOrderFilters
        values={{ ...emptyProductionOrderFilters, model: 'MOD-052', from: '2026-10-01' }}
        options={options}
        expanded={false}
        onExpandedChange={vi.fn()}
        onChange={onChange}
        onReset={onReset}
      />,
    );

    expect(screen.getByText('Модель: MOD-052 · Куртка «Віол»')).toBeTruthy();
    const chip = screen.getByText('Період від: 01.10.2026').closest('.MuiChip-root') as HTMLElement;
    fireEvent.click(within(chip).getByTestId('CancelIcon'));
    fireEvent.click(screen.getByRole('button', { name: 'Скинути (2)' }));

    expect(onChange).toHaveBeenCalledWith('from', null);
    expect(onReset).toHaveBeenCalled();
  });

  it('expanded, picks a client and marks a period that ends before it starts', () => {
    const onChange = vi.fn();
    render(
      <ProductionOrderFilters
        values={{ ...emptyProductionOrderFilters, from: '2026-11-02', to: '2026-11-01' }}
        options={options}
        expanded
        onExpandedChange={vi.fn()}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Замовник'), { target: { value: 'Шк' } });
    fireEvent.click(screen.getByRole('option', { name: 'Школа' }));

    expect(onChange).toHaveBeenCalledWith('client', 'Школа');
    expect(screen.getByText('Раніше за «від»')).toBeTruthy();
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
