import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuoteDeliveryPanel } from './delivery/quote-delivery-panel';
import { QuoteProductionPanel } from './production/quote-production-panel';
import { quoteDetailFixture } from '../../testing/quotes/quote-detail.fixture';

import type { QuoteDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  enqueue: vi.fn(),
  export: vi.fn(),
  download: vi.fn(),
  refresh: vi.fn(),
  dispatch: vi.fn(),
  save: vi.fn(),
  active: null as null | { id: string; label: string; number: number },
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetActiveQuoteEmailTemplateQuery: () => ({
    currentData: api.active,
    isLoading: false,
    isError: false,
    refetch: api.refresh,
  }),
  useGetQuoteDeliveriesQuery: () => ({
    currentData: { rows: [], page: 1, pageSize: 25, totalPages: 0, total: 0 },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: api.refresh,
  }),
  useEnqueueQuoteDeliveryMutation: () => [api.enqueue],
  useExportQuoteProductionMutation: () => [api.export],
  downloadProductionPackage: api.download,
}));
vi.mock('react-redux', () => ({ useDispatch: () => api.dispatch }));
vi.mock('../../hooks/documents/save-private-document', () => ({ savePrivateDocument: api.save }));
const base = quoteDetailFixture();
const item = base.draft.items[0]!;
const variant = item.variants[0]!;
const detail: QuoteDetail = {
  ...base,
  publicId: 'quote',
  versionId: 'version',
  revision: 2,
  versionNumber: 1,
  number: '10/10/2026',
  canEdit: true,
  archived: false,
  state: 'ready',
  ownerId: 17,
  draft: {
    ...base.draft,
    items: [
      {
        ...item,
        included: true,
        variants: [
          {
            ...variant,
            key: 'custom',
            publicId: 'custom',
            title: 'Куртка',
            visible: true,
            basis: null,
            selection: { kind: 'customSewing', versionId: 'custom-version' },
          },
          {
            ...variant,
            key: 'hidden',
            publicId: 'hidden',
            title: 'Прихована',
            visible: false,
            basis: null,
            selection: { kind: 'customSewing', versionId: 'hidden-version' },
          },
          {
            ...variant,
            key: 'catalog',
            publicId: 'catalog',
            title: 'Каталог',
            visible: true,
            selection: { kind: 'sewing', productId: 1, articleId: 1 },
          },
        ],
      },
    ],
  },
};
const pdf = {
  artifactId: 'pdf',
  status: 'succeeded',
  sha256: 'a'.repeat(64),
  length: 50,
  errorCode: null,
} as const;
const queued = {
  id: 'delivery',
  quoteId: 'quote',
  versionId: 'version',
  state: 'queued',
  recipient: 'sandbox@example.test',
  attempt: 0,
};
const artifact = {
  id: 'package',
  quoteId: 'quote',
  versionId: 'version',
  sha256: 'b'.repeat(64),
  bytes: 100,
  createdAt: '2026-10-30T12:00:00Z',
};
function showDelivery() {
  return render(<QuoteDeliveryPanel detail={detail} pdf={pdf} disabled={false} onLock={vi.fn()} />);
}
function confirm() {
  fireEvent.change(screen.getByLabelText('Email одержувача'), {
    target: { value: 'sandbox@example.test' },
  });
  fireEvent.change(screen.getByLabelText('Ім’я менеджера'), { target: { value: 'Manager' } });
  fireEvent.click(screen.getByRole('button', { name: 'Підготувати надсилання' }));
  fireEvent.click(screen.getByRole('button', { name: 'Підтвердити надсилання' }));
}
describe('P6 quote panels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.active = { id: 'template', label: 'Лист', number: 1 };
    api.enqueue.mockReturnValue({ unwrap: () => Promise.resolve(queued) });
    api.export.mockReturnValue({ unwrap: () => Promise.resolve(artifact) });
    api.download.mockResolvedValue(new Blob(['PK'], { type: 'application/zip' }));
  });
  afterEach(cleanup);
  it('uses Enter in recipient fields to open confirmation without submitting the parent quote', () => {
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <QuoteDeliveryPanel detail={detail} pdf={pdf} disabled={false} onLock={vi.fn()} />
      </form>,
    );
    fireEvent.change(screen.getByLabelText('Email одержувача'), {
      target: { value: 'sandbox@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Ім’я менеджера'), { target: { value: 'Manager' } });
    fireEvent.keyDown(screen.getByLabelText('Email одержувача'), { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(api.enqueue).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it('never sends on mount and requires explicit recipient/version/PDF confirmation', async () => {
    showDelivery();
    expect(api.enqueue).not.toHaveBeenCalled();
    confirm();
    await waitFor(() => expect(api.enqueue).toHaveBeenCalledTimes(1));
    expect(api.enqueue.mock.calls[0]![0]).toMatchObject({
      quoteId: 'quote',
      versionId: 'version',
      pdfId: 'pdf',
      templateId: 'template',
      recipient: 'sandbox@example.test',
    });
    expect(await screen.findByText(/Лист поставлено в чергу/)).toBeVisible();
    expect(screen.queryByText('КП надіслано')).not.toBeInTheDocument();
  });
  it('captures one request ID and freezes inputs during uncertain enqueue', async () => {
    api.enqueue.mockReturnValueOnce({
      unwrap: () =>
        Promise.reject({ status: 0, code: 'Network', message: 'Мережа', fieldErrors: {} }),
    });
    const view = showDelivery();
    confirm();
    const retry = await screen.findByRole('button', { name: 'Повторити той самий запит' });
    expect(screen.getByLabelText('Email одержувача')).toBeDisabled();
    api.active = { id: 'changed-template', label: 'Новий лист', number: 2 };
    view.rerender(
      <QuoteDeliveryPanel detail={detail} pdf={pdf} disabled={false} onLock={vi.fn()} />,
    );
    expect(screen.getByText(/Шаблон листа: Лист/)).toBeVisible();
    expect(screen.queryByText(/Шаблон листа: Новий лист/)).not.toBeInTheDocument();

    fireEvent.click(retry);
    await waitFor(() => expect(api.enqueue).toHaveBeenCalledTimes(2));
    expect(api.enqueue.mock.calls[1]![0]).toEqual(api.enqueue.mock.calls[0]![0]);
  });
  it('blocks sending without a verified active email template', () => {
    api.active = null;
    showDelivery();
    expect(screen.getByText(/Немає активного шаблону листа/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Підготувати надсилання' })).toBeDisabled();
  });
  it('keeps a reconciled unknown outcome visibly unknown rather than queued or sent', async () => {
    api.enqueue.mockReturnValue({ unwrap: () => Promise.resolve({ ...queued, state: 'unknown' }) });
    showDelivery();
    confirm();
    expect(
      await screen.findByText('Результат надсилання невідомий. Очікуйте перевірки в історії.'),
    ).toBeVisible();
    expect(screen.queryByText(/Лист поставлено в чергу/)).not.toBeInTheDocument();
  });
  it('suppresses a double confirmation while the original request is pending', async () => {
    let resolve!: (value: typeof queued) => void;
    api.enqueue.mockReturnValue({
      unwrap: () =>
        new Promise<typeof queued>((done) => {
          resolve = done;
        }),
    });
    showDelivery();
    fireEvent.change(screen.getByLabelText('Email одержувача'), {
      target: { value: 'sandbox@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Ім’я менеджера'), { target: { value: 'Manager' } });
    fireEvent.click(screen.getByRole('button', { name: 'Підготувати надсилання' }));
    const button = screen.getByRole('button', { name: 'Підтвердити надсилання' });
    act(() => {
      fireEvent.click(button);
      fireEvent.click(button);
    });
    expect(api.enqueue).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve(queued);
    });
  });
  it('exports only explicit visible custom selection and downloads stored ZIP', async () => {
    render(<QuoteProductionPanel detail={detail} disabled={false} onLock={vi.fn()} />);
    expect(api.export).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('Виробництво: Прихована')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Виробництво: Каталог')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Виробництво: Куртка'));
    fireEvent.click(screen.getByRole('button', { name: 'Створити виробничий ZIP' }));
    await waitFor(() => expect(api.export).toHaveBeenCalledTimes(1));
    expect(api.export.mock.calls[0]![0].selectedVariantIds).toEqual(['custom']);
    fireEvent.click(await screen.findByRole('button', { name: 'Завантажити виробничий ZIP' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    expect(api.enqueue).not.toHaveBeenCalled();
  });
  it('clears stored archive on access loss', async () => {
    api.download.mockRejectedValue({
      status: 403,
      code: 'Forbidden',
      message: 'Немає доступу',
      fieldErrors: {},
    });
    render(<QuoteProductionPanel detail={detail} disabled={false} onLock={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Виробництво: Куртка'));
    fireEvent.click(screen.getByRole('button', { name: 'Створити виробничий ZIP' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Завантажити виробничий ZIP' }));
    await waitFor(() => expect(api.dispatch).toHaveBeenCalled());
    expect(
      screen.queryByRole('button', { name: 'Завантажити виробничий ZIP' }),
    ).not.toBeInTheDocument();
  });
  it('ignores late export after changing the quote version scope', async () => {
    let resolve!: (value: typeof artifact) => void;
    api.export.mockReturnValue({
      unwrap: () =>
        new Promise<typeof artifact>((done) => {
          resolve = done;
        }),
    });
    const view = render(
      <QuoteProductionPanel key="v1" detail={detail} disabled={false} onLock={vi.fn()} />,
    );
    fireEvent.click(screen.getByLabelText('Виробництво: Куртка'));
    fireEvent.click(screen.getByRole('button', { name: 'Створити виробничий ZIP' }));
    view.rerender(
      <QuoteProductionPanel
        key="v2"
        detail={{ ...detail, versionId: 'version2' }}
        disabled={false}
        onLock={vi.fn()}
      />,
    );
    await act(async () => {
      resolve(artifact);
    });
    expect(
      screen.queryByRole('button', { name: 'Завантажити виробничий ZIP' }),
    ).not.toBeInTheDocument();
  });
});
