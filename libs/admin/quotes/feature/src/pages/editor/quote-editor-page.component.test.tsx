import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import QuoteEditorPage from './quote-editor-page';

import type { Quote, QuoteDraft } from '@admin/quotes/model';

const price = (amount: number) => ({ amount, source: amount, isManual: false, shown: true });

const quote: Quote = {
  id: 4,
  number: '1-11-2026',
  kind: 'Request',
  status: 'Draft',
  internalName: 'Агро база',
  customerId: null,
  recipientName: null,
  companyName: null,
  clientComment: null,
  managerNote: null,
  author: { userId: 2, name: 'Олена' },
  responsible: { userId: 2, name: 'Олена' },
  createdAt: '2026-11-04T10:00:00Z',
  updatedAt: '2026-11-04T10:00:00Z',
  lastSentAt: null,
  version: 3,
  introduction: null,
  items: [
    {
      id: 10,
      kind: 'Ppe',
      productId: 7,
      code: 'Z-1',
      name: 'Рукавиці',
      subtitle: 'ЗІЗ · готовий товар',
      description: null,
      siteUrl: null,
      photoUrl: null,
      season: null,
      supplierUrl: null,
      options: [
        {
          id: 20,
          articleId: null,
          fabricId: null,
          title: 'Ціна',
          details: null,
          isRecommended: false,
          prices: { retail: price(100), wholesale: price(90), large: price(80) },
          manualReason: null,
          manualByName: null,
          manualAt: null,
          pricesTakenAt: null,
        },
      ],
    },
  ],
};

const api = vi.hoisted(() => ({
  save: vi.fn(),
  refetch: vi.fn(),
  download: vi.fn(),
  send: vi.fn(),
  connect: vi.fn(),
  draft: { current: null as unknown },
  mutation: (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => fn(arg) }),
    { isLoading: false },
  ],
}));

vi.mock('@admin/quotes/data-access', () => ({
  useGetQuoteQuery: () => ({ data: quote, isLoading: false, isError: false, refetch: api.refetch }),
  useCreateQuoteMutation: api.mutation(vi.fn()),
  useSaveQuoteMutation: api.mutation(api.save),
  useDeleteQuoteMutation: api.mutation(vi.fn()),
  downloadQuotePdf: api.download,
  useGetQuoteSendDraftQuery: () => ({ data: api.draft.current, isLoading: false, isError: false }),
  useSendQuoteMutation: api.mutation(api.send),
  useConnectMailboxMutation: api.mutation(api.connect),
  useDisconnectMailboxMutation: api.mutation(vi.fn()),
}));

const sendDraft = {
  fromEmail: 'olena.brevi@gmail.com',
  fromName: 'Олена',
  gmailConfigured: true,
  fileName: 'КП 1-11-2026.pdf',
  letters: [{ name: 'Стандартний лист', subject: 'КП № 1-11-2026', body: 'Добрий день' }],
  to: null,
};
vi.mock('@admin/clients/data-access', () => ({
  useListCustomersQuery: () => ({ data: undefined }),
}));

function renderEditor() {
  return render(
    <MemoryRouter initialEntries={['/crm/quotes/4']}>
      <Routes>
        <Route
          path="/crm/quotes/:quoteId"
          element={<QuoteEditorPage actor={{ userId: 2, canSeeAll: false }} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

const typeRetail = (value: string) =>
  fireEvent.change(screen.getByLabelText('Ціна: Рукавиці, Ціна, до 9 шт.'), {
    target: { value },
  });

beforeEach(() => {
  api.save.mockReset();
  api.refetch.mockReset();
  api.download.mockReset();
  api.send.mockReset();
  api.connect.mockReset();
  api.draft.current = sendDraft;
});
afterEach(cleanup);

describe('КП editor', () => {
  it('adds more products from the products block, not the page header', async () => {
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Додати товар' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Додати ще товар' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Додати ще разовий ЗІЗ' }));
    expect(await screen.findByText('2 товари у пропозиції')).toBeVisible();
  });

  it('asks a reason for a manual PPE price before saving', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();

    typeRetail('95');
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    expect(await screen.findByText('Вкажіть причину ручної ціни.')).toBeVisible();
    expect(api.save).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Причина ручної ціни/), {
      target: { value: 'Знижка' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { id: number; draft: QuoteDraft };
    expect(sent.id).toBe(4);
    expect(sent.draft.items[0].options[0].prices.retail.manual).toBe('95');
  });

  it('hides a price from the client', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    fireEvent.click(await screen.findByLabelText('Показати в КП: Рукавиці, Ціна, до 9 шт.'));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { draft: QuoteDraft };
    expect(sent.draft.items[0].options[0].prices.retail.shown).toBe(false);
  });

  it('offers to reload when the КП was saved in another window', async () => {
    api.save.mockRejectedValue({
      status: 409,
      message: 'КП змінили в іншому вікні. Оновіть сторінку.',
    });
    api.refetch.mockResolvedValue({ data: quote });
    renderEditor();
    fireEvent.change(await screen.findByLabelText("Ім'я отримувача"), {
      target: { value: 'Петро' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    expect(await screen.findByText('КП змінили в іншому вікні. Оновіть сторінку.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Оновити' }));
    await waitFor(() => expect(api.refetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByLabelText("Ім'я отримувача")).toHaveValue(''));
  });

  it('«Сформувати КП» downloads the saved КП at once', async () => {
    api.download.mockResolvedValue(undefined);
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Сформувати КП' }));
    await waitFor(() => expect(api.download).toHaveBeenCalledWith(4, '1-11-2026'));
    expect(api.save).not.toHaveBeenCalled();
  });

  it('«Сформувати КП» saves unsaved changes first and builds the PDF from the saved version', async () => {
    const saved = { ...quote, version: 4 };
    api.save.mockResolvedValue(saved);
    api.download.mockResolvedValue(undefined);
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Коментар для клієнта'), {
      target: { value: 'Доставка за наш рахунок' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Сформувати КП' }));
    await waitFor(() => expect(api.download).toHaveBeenCalledWith(4, '1-11-2026'));
    expect(api.save).toHaveBeenCalledTimes(1);
    expect(api.save.mock.invocationCallOrder[0]).toBeLessThan(
      api.download.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it('does not build the PDF when saving fails', async () => {
    api.save.mockRejectedValue({
      status: 409,
      message: 'КП змінили в іншому вікні. Оновіть сторінку.',
    });
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Коментар для клієнта'), { target: { value: 'Інше' } });

    fireEvent.click(screen.getByRole('button', { name: 'Сформувати КП' }));
    expect(await screen.findByText('КП змінили в іншому вікні. Оновіть сторінку.')).toBeVisible();
    expect(api.download).not.toHaveBeenCalled();
  });

  it('«Надіслати КП» saves first, sends the letter and marks the КП sent', async () => {
    const saved = { ...quote, version: 4 };
    api.save.mockResolvedValue(saved);
    api.send.mockResolvedValue({
      ...saved,
      version: 5,
      status: 'Sent',
      lastSentAt: '2026-11-04T12:00:00Z',
    });
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Коментар для клієнта'), { target: { value: 'Інше' } });

    fireEvent.click(screen.getByRole('button', { name: 'Надіслати КП' }));
    const to = await screen.findByLabelText(/Кому/);
    expect(api.save).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/Тема/)).toHaveValue('КП № 1-11-2026');
    fireEvent.change(to, { target: { value: 'client@agro.ua' } });
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати' }));

    expect(await screen.findByText('КП 1-11-2026 надіслано.')).toBeVisible();
    expect(api.send).toHaveBeenCalledWith({
      id: 4,
      version: 4,
      form: { to: 'client@agro.ua', subject: 'КП № 1-11-2026', body: 'Добрий день' },
    });
  });

  it('shows why Gmail refused and keeps the panel open', async () => {
    api.send.mockRejectedValue({
      status: 409,
      message: 'Google не прийняв лист: перевірте адресу.',
    });
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Надіслати КП' }));
    fireEvent.change(await screen.findByLabelText(/Кому/), { target: { value: 'client@agro.ua' } });
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати' }));

    expect(await screen.findByText('Google не прийняв лист: перевірте адресу.')).toBeVisible();
    expect(screen.queryByText('КП 1-11-2026 надіслано.')).toBeNull();
    expect(api.save).not.toHaveBeenCalled();
  });

  it('does not send without a recipient', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Надіслати КП' }));
    await screen.findByLabelText(/Кому/);
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати' }));

    expect(await screen.findByText('Вкажіть email отримувача.')).toBeVisible();
    expect(api.send).not.toHaveBeenCalled();
  });

  it('offers to connect the own Gmail when it is not connected yet', async () => {
    api.draft.current = { ...sendDraft, fromEmail: null };
    api.connect.mockRejectedValue({ message: 'Підключати Gmail інших може лише директор.' });
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Надіслати КП' }));

    expect(await screen.findByText(/Ваш Gmail ще не підключено/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Надіслати' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Підключити мій Gmail' }));
    await waitFor(() =>
      expect(api.connect).toHaveBeenCalledWith({ userId: 2, returnPath: '/crm/quotes/4' }),
    );
  });
});
