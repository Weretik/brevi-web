import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PpePricingFeature } from './ppe-pricing-feature';

import type { PpeProductPricing } from '@admin/products/model';

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  access: vi.fn(),
  offer: vi.fn(),
  rule: vi.fn(),
  reload: vi.fn(),
}));
vi.mock('@admin/products/data-access', () => ({
  useGetPpeProductPricesQuery: mocks.query,
  useGetProductAccessQuery: mocks.access,
  useCreatePpeOfferVersionMutation: () => [mocks.offer, { isLoading: false }],
  useCreatePpeRuleVersionMutation: () => [mocks.rule, { isLoading: false }],
}));
const pricing: PpeProductPricing = {
  productId: 42,
  isEnrolled: true,
  offer: {
    id: '11111111-1111-4111-8111-111111111111',
    productId: 42,
    values: {
      ruleCode: 'Rule',
      supplierCost: 100,
      externalRetail: null,
      externalWholesale: null,
      source: 'test',
      sourceDate: '2026-10-25',
      sourceReviewed: true,
    },
    isApproved: false,
    approvedAt: null,
  },
  rule: {
    id: '22222222-2222-4222-8222-222222222222',
    values: {
      code: 'Rule',
      markups: { retail: 0.5, wholesale: 0.36, largeWholesale: 0.3 },
      source: 'test',
      sourceDate: '2026-10-25',
    },
    isApproved: false,
    approvedAt: null,
  },
  prices: null,
  blockers: ['UnapprovedOffer', 'MissingRule'],
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.reload.mockResolvedValue({});
  mocks.query.mockReturnValue({
    currentData: [pricing],
    isFetching: false,
    isError: false,
    refetch: mocks.reload,
  });
  mocks.access.mockReturnValue({
    currentData: { canManage: true },
    isError: false,
    isFetching: false,
  });
  mocks.offer.mockReturnValue({ unwrap: async () => pricing.offer });
  mocks.rule.mockReturnValue({ unwrap: async () => pricing.rule });
});
afterEach(cleanup);
describe('PPE pricing approval workflow', () => {
  it('shows three server tiers to readers without approval controls', () => {
    mocks.query.mockReturnValue({
      currentData: [
        { ...pricing, prices: { retail: 150, wholesale: 136, largeWholesale: 130 }, blockers: [] },
      ],
      isFetching: false,
      isError: false,
    });
    mocks.access.mockReturnValue({ currentData: { canManage: false } });
    render(<PpePricingFeature productId={42} />);
    expect(screen.getByText('Роздріб')).toBeTruthy();
    expect(screen.getByText('Великий опт')).toBeTruthy();
    expect(screen.getByText(/136/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Зберегти й підтвердити ціни' })).toBeNull();
    expect(mocks.offer).not.toHaveBeenCalled();
  });
  it('retains source review as separate evidence and only approves after explicit action', async () => {
    render(<PpePricingFeature productId={42} />);
    expect(screen.getByText(/У джерелі: перевірено/)).toBeTruthy();
    expect(
      screen.getByText('Перевірте та підтвердьте ціну постачальника й зовнішні ціни.'),
    ).toBeTruthy();
    expect(mocks.offer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await waitFor(() =>
      expect(mocks.offer).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 42,
          expectedVersionId: pricing.offer!.id,
          values: pricing.offer!.values,
        }),
      ),
    );
    expect(mocks.offer.mock.calls[0]![0]).not.toHaveProperty('actor');
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Роздрібна націнка (0.5 = 50%)' }), {
      target: { value: '.7' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити правило' }));
    await waitFor(() =>
      expect(mocks.rule).toHaveBeenCalledWith(
        expect.objectContaining({
          expectedVersionId: pricing.rule!.id,
          values: expect.objectContaining({ markups: expect.objectContaining({ retail: 0.7 }) }),
        }),
      ),
    );
  });
  it('reuses an unchanged failed request UUID and does not expose raw network text', async () => {
    mocks.offer.mockReturnValueOnce({
      unwrap: async () => {
        throw new Error('private-network-detail');
      },
    });
    render(<PpePricingFeature productId={42} />);
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await screen.findByText('Не вдалося зберегти ціни ЗІЗ. Спробуйте ще раз.');
    expect(screen.queryByText('private-network-detail')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await waitFor(() => expect(mocks.offer).toHaveBeenCalledTimes(2));
    expect(mocks.offer.mock.calls[1]![0].requestId).toBe(mocks.offer.mock.calls[0]![0].requestId);
  });
  it('uses a new request UUID after editing a failed payload', async () => {
    mocks.offer.mockReturnValueOnce({
      unwrap: async () => {
        throw new Error('network');
      },
    });
    render(<PpePricingFeature productId={42} />);
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await screen.findByText('Не вдалося зберегти ціни ЗІЗ. Спробуйте ще раз.');
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Ціна постачальника, грн' }), {
      target: { value: '120' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await waitFor(() => expect(mocks.offer).toHaveBeenCalledTimes(2));
    expect(mocks.offer.mock.calls[1]![0].requestId).not.toBe(
      mocks.offer.mock.calls[0]![0].requestId,
    );
  });
  it('locks stale writes until current inputs are explicitly reloaded', async () => {
    mocks.offer.mockReturnValue({
      unwrap: async () => {
        throw { status: 409, code: 'Conflict', message: 'Оновіть дані.', fieldErrors: {} };
      },
    });
    render(<PpePricingFeature productId={42} />);
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await screen.findByRole('button', { name: 'Оновити вхідні дані' });
    expect(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Оновити вхідні дані' }));
    await waitFor(() => expect(mocks.reload).toHaveBeenCalled());
  });
  it('hides stale access permissions and supports loading/error retry', () => {
    mocks.access.mockReturnValue({
      currentData: { canManage: true },
      isError: true,
      refetch: vi.fn(),
    });
    const view = render(<PpePricingFeature productId={42} />);
    expect(screen.queryByRole('button', { name: 'Зберегти й підтвердити ціни' })).toBeNull();
    mocks.query.mockReturnValue({ isFetching: true });
    view.rerender(<PpePricingFeature productId={42} />);
    expect(screen.getByLabelText('Завантаження цін ЗІЗ')).toBeTruthy();
    mocks.query.mockReturnValue({
      isFetching: false,
      isError: true,
      error: new Error('private'),
      refetch: mocks.reload,
    });
    view.rerender(<PpePricingFeature productId={42} />);
    expect(screen.getByRole('button', { name: 'Повторити' })).toBeTruthy();
    expect(screen.queryByText('private')).toBeNull();
  });
  it('retains an unsaved rule draft when only the offer refreshes', () => {
    const view = render(<PpePricingFeature productId={42} />);
    const label = 'Роздрібна націнка (0.5 = 50%)';
    fireEvent.change(screen.getByRole('spinbutton', { name: label }), { target: { value: '.7' } });
    mocks.query.mockReturnValue({ currentData: [pricing], isFetching: true, isError: false });
    view.rerender(<PpePricingFeature productId={42} />);
    expect(screen.getByRole('spinbutton', { name: label })).toHaveValue(0.7);
    expect(screen.getByRole('button', { name: 'Зберегти й підтвердити правило' })).toBeDisabled();
    mocks.query.mockReturnValue({
      currentData: [
        { ...pricing, offer: { ...pricing.offer!, id: '33333333-3333-4333-8333-333333333333' } },
      ],
      isFetching: false,
      isError: false,
    });
    view.rerender(<PpePricingFeature productId={42} />);
    expect(screen.getByRole('spinbutton', { name: label })).toHaveValue(0.7);
  });
  it('keeps an emptied markup field blank and never submits it as zero', () => {
    render(<PpePricingFeature productId={42} />);
    const field = screen.getByRole('spinbutton', { name: 'Роздрібна націнка (0.5 = 50%)' });
    fireEvent.change(field, { target: { value: '' } });
    expect(field).toHaveValue(null);
    fireEvent.submit(
      screen.getByRole('button', { name: 'Зберегти й підтвердити правило' }).closest('form')!,
    );
    expect(mocks.rule).not.toHaveBeenCalled();
    expect(
      screen.getByText('Заповніть три невід’ємні націнки з точністю до 8 знаків.'),
    ).toBeTruthy();
  });
  it('prefills only an unapproved onboarding draft from initial Product metadata', async () => {
    mocks.query.mockReturnValue({
      currentData: [
        {
          productId: 42,
          isEnrolled: false,
          offer: null,
          rule: null,
          prices: null,
          blockers: ['MissingOffer'],
        },
      ],
      isFetching: false,
      isError: false,
    });
    render(<PpePricingFeature productId={42} initialSupplierCost={100} />);
    expect(screen.getByRole('spinbutton', { name: 'Ціна постачальника, грн' })).toHaveValue(100);
    expect(mocks.offer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти й підтвердити ціни' }));
    await waitFor(() =>
      expect(mocks.offer).toHaveBeenCalledWith(
        expect.objectContaining({
          expectedVersionId: null,
          values: expect.objectContaining({ supplierCost: 100, sourceReviewed: false }),
        }),
      ),
    );
  });
});
