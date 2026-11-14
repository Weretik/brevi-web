import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReportTotals } from './report-totals';

import type { WorkshopReport } from '@admin/production/model';

const report = (outputValue: number, unpricedPieces = 0): WorkshopReport => ({
  from: '2026-11',
  to: '2026-11',
  closedMonths: [],
  openMonths: ['2026-11'],
  totals: {
    sewnPieces: 3,
    outputValue,
    unpricedPieces,
    accrued: 900,
    minutes: 0,
    issuedMeters: 4,
    issuedValue: 480,
    unpricedIssuedMeters: 0,
    stockMeters: 6,
    stockValue: 720,
    unpricedStockMeters: 0,
  },
  output: [],
  staff: [],
  materials: [],
  stock: [],
  warnings: [],
});

afterEach(cleanup);

describe('ReportTotals', () => {
  it('marks only what is missing from the sums', () => {
    const { rerender } = render(<ReportTotals report={report(4500)} comparison={null} />);
    expect(screen.queryByRole('alert')).toBeNull();

    rerender(<ReportTotals report={report(4500, 2)} comparison={null} />);
    expect(screen.getByRole('alert')).toHaveTextContent('2 шт. без ціни КП');
  });

  it('shows the change against the other period', () => {
    render(<ReportTotals report={report(4500)} comparison={report(3000)} />);
    expect(screen.getByText(/було 3\s000,00 грн/u)).toBeVisible();
  });
});
