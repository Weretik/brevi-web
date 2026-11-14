import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReportMaterialsTable } from './report-materials-table';
import { ReportOutputTable } from './report-output-table';
import { ReportStaffTable } from './report-staff-table';
import { ReportStockTable } from './report-stock-table';

afterEach(cleanup);

describe('workshop report tables', () => {
  it('«Випуск» links the order and marks an unknown КП price', () => {
    render(
      <ReportOutputTable
        rows={[
          {
            orderId: 7,
            orderNumber: 120,
            clientName: 'Школа',
            itemId: 1,
            modelName: 'Куртка',
            quantity: 5,
            unitPrice: null,
            value: null,
          },
        ]}
      />,
    );

    const table = screen.getByRole('table', { name: 'Випуск за завданнями' });
    expect(within(table).getByRole('link', { name: '№120' }).getAttribute('href')).toBe(
      '/production/orders/7',
    );
    expect(within(table).getByText('ціна невідома')).toBeTruthy();
  });

  it('«Працівники» marks a person without hours', () => {
    render(
      <ReportStaffTable
        rows={[
          {
            employeeId: 1,
            name: 'Олена',
            position: 'Швачка',
            minutes: 90,
            sewn: 3,
            cut: 0,
            accrued: 100,
            dayAverage: null,
          },
        ]}
      />,
    );

    expect(screen.getByText('1,5')).toBeTruthy();
    expect(screen.getByText('немає годин')).toBeTruthy();
  });

  it('«Видані матеріали» shows a dash for fabric not issued to an order', () => {
    render(
      <ReportMaterialsTable
        rows={[
          {
            movementId: 1,
            issuedOn: '2026-11-14',
            fabricCode: 'TK-1',
            fabricName: 'Габардин',
            color: 'Синій',
            orderId: null,
            orderNumber: null,
            modelName: null,
            meters: 2,
            pricePerMeter: 50,
            value: 100,
          },
        ]}
      />,
    );

    expect(screen.getByText('Габардин (TK-1)')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows the empty text instead of a table', () => {
    render(<ReportStockTable rows={[]} />);

    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByText('На кінець періоду тканин на складі немає.')).toBeTruthy();
  });
});
