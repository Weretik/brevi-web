import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuoteDeliveryPanel } from './quote-delivery-panel';
import { quoteDetailFixture } from '../../../testing/quotes/quote-detail.fixture';

import type { QuoteDeliveryView } from '@admin/clients/model';

const api = vi.hoisted(() => ({ rows: [] as QuoteDeliveryView[], resolve: vi.fn(), enqueue: vi.fn(), refresh: vi.fn(), dispatch: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  useGetActiveQuoteEmailTemplateQuery: () => ({ currentData: null, isLoading: false, isError: false, refetch: api.refresh }),
  useGetQuoteDeliveriesQuery: () => ({ currentData: { rows: api.rows, page: 1, pageSize: 25, total: 1, totalPages: 1 }, isLoading: false, isError: false, isFetching: false, refetch: api.refresh }),
  useEnqueueQuoteDeliveryMutation: () => [api.enqueue],
  useResolveQuoteDeliveryMutation: () => [api.resolve],
  useLazyGetQuoteDeliveryQuery: () => [vi.fn()],
}));
vi.mock('react-redux', () => ({ useDispatch: () => api.dispatch }));
const detail = { ...quoteDetailFixture(), publicId: 'quote', versionId: 'version', revision: 2, versionNumber: 1,
  number: '10/10/2026', canEdit: true, archived: false, state: 'ready' as const, ownerId: 17 };
const pdf = { artifactId: 'pdf', status: 'succeeded' as const, sha256: 'a'.repeat(64), length: 50, errorCode: null };
const showDelivery = () => render(<QuoteDeliveryPanel detail={detail} pdf={pdf} disabled={false} onLock={vi.fn()} />);
beforeEach(() => { vi.clearAllMocks(); api.rows = []; });
afterEach(cleanup);
describe('manual delivery confirmation UI', () => {
  it('records manual proof from history without a new email and labels it distinctly', async () => {
    const row: QuoteDeliveryView = {
      id: 'delivery',
      quoteId: 'quote',
      versionId: 'version',
      pdfId: 'pdf',
      templateId: 'template',
      recipient: 'sandbox@example.test',
      state: 'unknown',
      attempt: 1,
      error: null,
      confirmedAt: null,
      createdAt: '2026-11-01T12:00:00Z',
      updatedAt: '2026-11-01T12:00:00Z',
      canResolveManually: true,
    };
    api.rows = [row];
    api.resolve.mockReturnValue({
      unwrap: async () => ({
        ...row,
        state: 'succeeded',
        canResolveManually: false,
        manualResolution: {
          outcome: 'sent',
          actorId: 18,
          attempt: 1,
          evidenceNote: 'Перевірено точний лист',
          createdAt: row.createdAt,
        },
      }),
    });
    showDelivery();
    fireEvent.click(screen.getByRole('button', { name: 'Зафіксувати перевірений результат' }));
    expect(screen.getByText('Версія: version')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Підтвердити результат перевірки' })).toBeDisabled();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Перевірений результат' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Підтверджено надсилання' }));
    fireEvent.change(screen.getByLabelText('Що перевірено'), {
      target: { value: 'Перевірено точний лист' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Підтвердити результат перевірки' }));
    expect(
      await screen.findByText('Надсилання підтверджено вручну. Підстава збережена в історії.'),
    ).toBeVisible();
    expect(screen.queryByText(/Прийняття листа підтверджено провайдером/)).not.toBeInTheDocument();
    expect(api.enqueue).not.toHaveBeenCalled();
    expect(api.resolve).toHaveBeenCalledOnce();
  });
  it('allows the captured manual retry when the parent editor mirrors the uncertain lock', async () => {
    const row: QuoteDeliveryView = {
      id: 'delivery',
      quoteId: 'quote',
      versionId: 'version',
      pdfId: 'pdf',
      templateId: 'template',
      recipient: 'sandbox@example.test',
      state: 'unknown',
      attempt: 1,
      error: null,
      confirmedAt: null,
      createdAt: '2026-11-01T12:00:00Z',
      updatedAt: '2026-11-01T12:00:00Z',
      canResolveManually: true,
    };
    api.rows = [row];
    api.resolve.mockReturnValueOnce({
      unwrap: async () => {
        throw { status: 0, code: 'Network', message: 'Мережа', fieldErrors: {} };
      },
    });
    api.resolve.mockReturnValue({
      unwrap: async () => ({
        ...row,
        state: 'failed',
        canResolveManually: false,
        manualResolution: {
          outcome: 'not_sent',
          actorId: 18,
          attempt: 1,
          evidenceNote: 'Підтверджено відхилення',
          createdAt: row.createdAt,
        },
      }),
    });
    function ParentEditor() {
      const [lock, setLock] = useState(false);
      return (
        <QuoteDeliveryPanel
          detail={detail}
          pdf={pdf}
          disabled={lock}
          onLock={(pending, uncertain) => setLock(pending || uncertain)}
        />
      );
    }
    render(<ParentEditor />);
    fireEvent.click(screen.getByRole('button', { name: 'Зафіксувати перевірений результат' }));
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Перевірений результат' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Підтверджено ненадсилання' }));
    fireEvent.change(screen.getByLabelText('Що перевірено'), {
      target: { value: 'Підтверджено відхилення' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Підтвердити результат перевірки' }));
    const retry = await screen.findByRole('button', { name: 'Повторити той самий запит' });
    expect(retry).toBeEnabled();
    expect(screen.getByLabelText('Що перевірено')).toBeDisabled();
    fireEvent.click(retry);
    await waitFor(() => expect(api.resolve).toHaveBeenCalledTimes(2));
    expect(api.resolve.mock.calls[1]![0]).toEqual(api.resolve.mock.calls[0]![0]);
  });
});
