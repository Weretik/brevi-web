import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SewingForecastTable } from './sewing-forecast-table';

import type { ForecastRow } from '@admin/production/model';

const row = (patch: Partial<ForecastRow>): ForecastRow => ({
  orderId: 1,
  orderNumber: 12,
  clientName: 'Геофізика',
  managerName: 'Анастасія',
  remaining: 3,
  minutes: 120,
  finishOn: '2026-11-20',
  status: 'Estimated',
  reason: null,
  dueDate: '2026-11-19',
  isLate: false,
  ...patch,
});

afterEach(cleanup);

describe('SewingForecastTable', () => {
  it('marks only problems and moves rows for the workshop', () => {
    const onMove = vi.fn();
    render(
      <MemoryRouter>
        <SewingForecastTable
          rows={[
            row({ isLate: true }),
            row({
              orderId: 2,
              orderNumber: 13,
              reason: 'MissingRate',
              finishOn: null,
              status: 'Unknown',
            }),
            row({ orderId: 3, orderNumber: 14, finishOn: '2026-11-10' }),
          ]}
          showMinutes={false}
          onMove={onMove}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText(/пізніше «Готово до» 19.11.2026/)).toBeTruthy();
    expect(screen.getByText('Немає розцінки пошиття в позиції')).toBeTruthy();
    expect(screen.queryByText('Хвилин')).toBeNull();
    expect(screen.getAllByLabelText(/Нижче|Вище/)).toHaveLength(6);
    fireEvent.click(screen.getByLabelText('Нижче: № 12'));
    expect(onMove).toHaveBeenCalledWith(0, 1);
  });

  it('has no reorder buttons for managers', () => {
    render(
      <MemoryRouter>
        <SewingForecastTable rows={[row({})]} showMinutes={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByLabelText(/Нижче|Вище/)).toBeNull();
    expect(screen.queryByText(/пізніше/)).toBeNull();
  });
});
