import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductionOrdersImportDrawers } from './production-orders-import-drawers';

vi.mock('@admin/production/data-access', () => ({
  useImportProductionOrdersMutation: () => [vi.fn()],
  useImportProductionProgressMutation: () => [vi.fn()],
  useImportProductionReportPricesMutation: () => [vi.fn()],
}));

afterEach(cleanup);

describe('ProductionOrdersImportDrawers', () => {
  it('shows nothing while no transfer is chosen', () => {
    render(<ProductionOrdersImportDrawers kind={null} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it.each([
    ['orders', 'Імпорт завдань'],
    ['progress', 'Імпорт етапів'],
    ['prices', 'Ціни КП'],
  ] as const)('opens the %s transfer drawer', (kind, title) => {
    render(<ProductionOrdersImportDrawers kind={kind} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: title })).toBeTruthy();
  });
});
