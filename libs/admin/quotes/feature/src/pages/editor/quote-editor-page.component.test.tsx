import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
  archivedAt: null,
  archivedByName: null,
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
          fabricMeters: null,
          fabrics: [],
        },
      ],
      lines: [],
    },
  ],
};

const api = vi.hoisted(() => ({
  save: vi.fn(),
  refetch: vi.fn(),
  fetchPdf: vi.fn(),
  savePdf: vi.fn(),
  send: vi.fn(),
  connect: vi.fn(),
  archive: vi.fn(),
  copy: vi.fn(),
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
  fetchQuotePdf: api.fetchPdf,
  saveQuotePdf: api.savePdf,
  useGetQuoteSendDraftQuery: () => ({ data: api.draft.current, isLoading: false, isError: false }),
  useSendQuoteMutation: api.mutation(api.send),
  useConnectMailboxMutation: api.mutation(api.connect),
  useDisconnectMailboxMutation: api.mutation(vi.fn()),
  useCalculateQuoteCustomSewingMutation: api.mutation(vi.fn()),
  useSetQuoteArchivedMutation: api.mutation(api.archive),
  useCopyQuoteMutation: api.mutation(api.copy),
  useGetQuoteHistoryQuery: () => ({
    data: [
      {
        id: 2,
        kind: 'ResponsibleChanged',
        at: '2026-11-04T12:00:00Z',
        actor: { userId: 1, name: 'Директор' },
        details: 'Петро → Олена',
      },
      {
        id: 1,
        kind: 'Created',
        at: '2026-11-04T10:00:00Z',
        actor: { userId: 2, name: 'Олена' },
        details: null,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

const sendDraft = {
  fromEmail: 'olena.brevi@gmail.com',
  fromName: 'Олена',
  gmailConfigured: true,
  fileName: 'КП 1-11-2026.pdf',
  letters: [{ name: 'Стандартний лист', subject: 'КП № 1-11-2026', body: 'Добрий день' }],
  to: null,
};
vi.mock('@admin/references/data-access', () => ({
  useListFabricsQuery: () => ({ data: [], isLoading: false, isError: false }),
  useListGarmentAccessoriesQuery: () => ({ data: [], isLoading: false, isError: false }),
  useListGarmentPartOperationsQuery: () => ({ data: [], isLoading: false, isError: false }),
}));
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

const pdfBlob = new Blob(['%PDF-'], { type: 'application/pdf' });

/** «Надіслати КП» opens the preview first; the letter panel opens from its own «Надіслати КП». */
async function sendFromPreview() {
  const preview = await screen.findByRole('dialog', { name: /Перегляд КП/ });
  await within(preview).findByTitle(/PDF КП/);
  fireEvent.click(within(preview).getByRole('button', { name: 'Надіслати КП' }));
}

beforeEach(() => {
  api.save.mockReset();
  api.refetch.mockReset();
  api.fetchPdf.mockReset();
  api.fetchPdf.mockResolvedValue(pdfBlob);
  api.savePdf.mockReset();
  URL.createObjectURL = vi.fn(() => 'blob:quote-pdf');
  URL.revokeObjectURL = vi.fn();
  api.send.mockReset();
  api.connect.mockReset();
  api.archive.mockReset();
  api.copy.mockReset();
  api.draft.current = sendDraft;
});
afterEach(cleanup);

describe('КП editor', () => {
  it('shows «Історія змін» in the side panel', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Історія' }));
    const panel = await screen.findByRole('dialog', { name: 'Історія змін' });
    expect(panel).toHaveTextContent('Передано іншому менеджеру');
    expect(panel).toHaveTextContent('Петро → Олена');
    expect(panel).toHaveTextContent('Створено');
  });

  it('moves the КП to the archive and locks saving until it is restored', async () => {
    api.archive.mockImplementation(({ archived }: { archived: boolean }) =>
      Promise.resolve({
        ...quote,
        version: archived ? 4 : 5,
        archivedAt: archived ? '2026-11-04T12:00:00Z' : null,
        archivedByName: archived ? 'Олена' : null,
      }),
    );
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Ще' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /В архів/ }));

    expect(await screen.findByText(/КП в архіві з/)).toBeVisible();
    expect(api.archive).toHaveBeenCalledWith({ id: 4, version: 3, archived: true });
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Надіслати КП' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Повернути з архіву' }));
    await waitFor(() => expect(screen.queryByText(/КП в архіві з/)).not.toBeInTheDocument());
    expect(api.archive).toHaveBeenLastCalledWith({ id: 4, version: 4, archived: false });
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeEnabled();
  });

  it('copies the КП and opens the copy', async () => {
    api.copy.mockResolvedValue({ ...quote, id: 9, number: '2-11-2026' });
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Ще' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /Копіювати/ }));

    expect(await screen.findByText('Створено КП 2-11-2026 — копію КП 1-11-2026.')).toBeVisible();
    expect(api.copy).toHaveBeenCalledWith(4);
  });

  it('shows the client as the title, with the number and the status', async () => {
    renderEditor();
    expect(await screen.findByRole('heading', { level: 1, name: 'Агро база' })).toBeVisible();
    expect(screen.getByText('КП 1-11-2026')).toBeVisible();
    expect(screen.getByText('Чернетка')).toBeVisible();
  });

  it('adds a one-off PPE from the «Додати позицію» tiles and names the problem', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Разовий товар ЗІЗ' }));
    expect(await screen.findByLabelText('Позиція 2: Разова позиція')).toBeVisible();
    const problems = screen.getByLabelText('Перед надсиланням');
    expect(problems).toHaveTextContent('02 Без назви: Вкажіть назву разової позиції.');
  });

  it('opens the «Виріб з нуля» panel from the «Новий виріб» tile', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Новий виріб' }));
    expect(await screen.findByRole('dialog', { name: 'Виріб з нуля' })).toBeVisible();
  });

  it('asks a reason for a manual PPE price before saving', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();

    typeRetail('95');
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Вкажіть причину ручної ціни.')).toBeVisible();
    expect(api.save).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Причина ручної ціни/), {
      target: { value: 'Знижка' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { id: number; draft: QuoteDraft };
    expect(sent.id).toBe(4);
    expect(sent.draft.items[0].options[0].prices.retail.manual).toBe('95');
  });

  it('hides a price from the client', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Дії з рядком: Рукавиці, Ціна' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Показати в КП: до 9 шт.' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { draft: QuoteDraft };
    expect(sent.draft.items[0].options[0].prices.retail.shown).toBe(false);
  });

  it('hides one quantity tier in the whole КП with the «Підсумок» switch', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    const summary = await screen.findByLabelText('Підсумок');
    expect(summary).toHaveTextContent('Цін у КП3');
    fireEvent.click(screen.getByRole('switch', { name: 'Показувати ціни від 41 шт.' }));
    expect(summary).toHaveTextContent('Цін у КП2');
    expect(screen.getByText('від 41 шт. · не в КП')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { draft: QuoteDraft };
    expect(sent.draft.items[0].options[0].prices.large.shown).toBe(false);
  });

  it('offers to reload when the КП was saved in another window', async () => {
    api.save.mockRejectedValue({
      status: 409,
      message: 'КП змінили в іншому вікні. Оновіть сторінку.',
    });
    api.refetch.mockResolvedValue({ data: quote });
    renderEditor();
    fireEvent.change(await screen.findByLabelText('Отримувач'), {
      target: { value: 'Петро' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('КП змінили в іншому вікні. Оновіть сторінку.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Оновити' }));
    await waitFor(() => expect(api.refetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByLabelText('Отримувач')).toHaveValue(''));
  });

  it('«Переглянути PDF» shows the PDF of the saved КП and downloads it from the preview', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Переглянути PDF' }));
    const preview = await screen.findByRole('dialog', { name: 'Перегляд КП № 1-11-2026' });
    expect(await within(preview).findByTitle('PDF КП № 1-11-2026')).toHaveAttribute(
      'src',
      'blob:quote-pdf',
    );
    expect(api.fetchPdf).toHaveBeenCalledWith(4);
    expect(api.save).not.toHaveBeenCalled();

    fireEvent.click(within(preview).getByRole('button', { name: 'Завантажити' }));
    expect(api.savePdf).toHaveBeenCalledWith(pdfBlob, '1-11-2026');
    fireEvent.click(within(preview).getByRole('button', { name: 'Повернутися до редагування' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:quote-pdf');
  });

  it('«Переглянути PDF» saves unsaved changes first and builds the PDF from the saved version', async () => {
    const saved = { ...quote, version: 4 };
    api.save.mockResolvedValue(saved);
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Коментар для клієнта'), {
      target: { value: 'Доставка за наш рахунок' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Переглянути PDF' }));
    await waitFor(() => expect(api.fetchPdf).toHaveBeenCalledWith(4));
    expect(api.save).toHaveBeenCalledTimes(1);
    expect(api.save.mock.invocationCallOrder[0]).toBeLessThan(
      api.fetchPdf.mock.invocationCallOrder[0] ?? 0,
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

    fireEvent.click(screen.getByRole('button', { name: 'Переглянути PDF' }));
    expect(await screen.findByText('КП змінили в іншому вікні. Оновіть сторінку.')).toBeVisible();
    expect(api.fetchPdf).not.toHaveBeenCalled();
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
    await sendFromPreview();
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
    await sendFromPreview();
    fireEvent.change(await screen.findByLabelText(/Кому/), { target: { value: 'client@agro.ua' } });
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати' }));

    expect(await screen.findByText('Google не прийняв лист: перевірте адресу.')).toBeVisible();
    expect(screen.queryByText('КП 1-11-2026 надіслано.')).toBeNull();
    expect(api.save).not.toHaveBeenCalled();
  });

  it('does not send without a recipient', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: 'Надіслати КП' }));
    await sendFromPreview();
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
    await sendFromPreview();

    expect(await screen.findByText(/Ваш Gmail ще не підключено/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Надіслати' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Підключити мій Gmail' }));
    await waitFor(() =>
      expect(api.connect).toHaveBeenCalledWith({ userId: 2, returnPath: '/crm/quotes/4' }),
    );
  });
});
