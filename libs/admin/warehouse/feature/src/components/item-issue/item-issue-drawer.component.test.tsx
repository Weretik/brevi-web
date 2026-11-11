import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ItemIssueDrawer } from './item-issue-drawer';

import type { FabricStockFabric, ItemFabric } from '@admin/warehouse/model';

const api = vi.hoisted(() => ({ issue: vi.fn() }));

vi.mock('@admin/warehouse/data-access', () => ({
  useIssueFabricToItemMutation: () => [
    (arg: unknown) => ({ unwrap: () => Promise.resolve(api.issue(arg)) }),
    { isLoading: false },
  ],
}));

const fabrics: FabricStockFabric[] = [
  {
    fabricCode: 'FAB-023',
    codes: ['FAB-023', 'FAB-067'],
    fabricName: 'Грета',
    composition: null,
    density: null,
    meters: 10,
    colors: [
      { color: 'Темно-сірий', colorKey: 'темно-сірий', meters: 10, version: 'v1', sources: [] },
    ],
  },
];

const card: ItemFabric = {
  orderId: 5,
  itemId: 3,
  orderNumber: 12,
  clientName: 'Геофізика',
  modelName: 'Куртка',
  orderVersion: 2,
  isOpen: true,
  fabricCode: 'FAB-023',
  fabricName: 'Грета',
  quantity: 10,
  hasNorm: true,
  planVersion: 0,
  planMissing: null,
  plan: [
    {
      fabricCode: 'FAB-023',
      color: 'Темно-сірий',
      colorKey: 'темно-сірий',
      layer: 'Upper',
      planned: 30,
      covered: 0,
      issued: 0,
      reserved: 30,
      stockId: 1,
      stockMeters: 10,
      stockAvailable: -20,
      missing: 30,
    },
  ],
  issued: 0,
  issues: [],
  canIssue: true,
};

describe('ItemIssueDrawer', () => {
  it('checks plan and fact and the pair after before it records the issue', async () => {
    const onSaved = vi.fn();
    render(<ItemIssueDrawer card={card} fabrics={fabrics} onClose={vi.fn()} onSaved={onSaved} />);

    fireEvent.change(screen.getByLabelText(/Розкроєно виробів/), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/^Метри/), { target: { value: '12,5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити' }));

    const plan = screen.getByRole('table', { name: 'План і факт' });
    expect(within(plan).getByText('12 м')).toBeTruthy();
    expect(within(plan).getByText('+0,5 м')).toBeTruthy();
    expect(
      within(screen.getByRole('table', { name: 'Залишки до і після' })).getByText('-2,5 м'),
    ).toBeTruthy();
    expect(api.issue).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Записати' }));
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(api.issue).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 5,
        itemId: 3,
        body: expect.objectContaining({
          issuedQuantity: 4,
          planVersion: 0,
          lines: [
            expect.objectContaining({
              meters: 12.5,
              planColorKey: 'темно-сірий',
              expectedVersion: 'v1',
            }),
          ],
        }),
      }),
    );
  });
});
