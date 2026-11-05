import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import QuoteSettingsPage from './quote-settings-page';

import type { QuoteSettings, QuoteSettingsDraft } from '@admin/quotes/model';

const settings: QuoteSettings = {
  version: 2,
  updatedByName: 'Віталій',
  updatedAt: '2026-11-04T10:00:00Z',
  company: {
    name: 'ПП «Бреві»',
    edrpou: '35521636',
    taxId: null,
    iban: null,
    address: null,
    phone: null,
    email: null,
    site: 'https://brevi.com.ua/',
    logoUrl: null,
  },
  email: { subject: 'КП № {quoteNumber}', body: 'Добрий день' },
  pdf: {
    title: 'КОМЕРЦІЙНА ПРОПОЗИЦІЯ',
    vatNotice: null,
    ctaTitle: null,
    ctaText: null,
    ctaContactTemplate: null,
    introText: null,
  },
  introduction: {
    logoText: null,
    summerTitle: null,
    winterTitle: null,
    subtitle: null,
    summerBannerUrl: null,
    winterBannerUrl: null,
    modelsTitle: null,
    assortmentLinkText: null,
    assortmentUrl: null,
    productButtonText: null,
    nextStepText: null,
    accentColor: null,
    summerMainCode: null,
    winterMainCode: null,
    advantages: Array.from({ length: 5 }, (_, index) => ({
      title: `Перевага ${index + 1}`,
      text: null,
    })),
  },
  letterVariants: [],
  staffContacts: [
    {
      userId: 7,
      accountName: 'Оля',
      accountEmail: 'olia@brevi.ua',
      name: 'Ольга',
      phone: null,
      email: null,
      mailboxEmail: null,
    },
  ],
};

const api = vi.hoisted(() => ({
  save: vi.fn(),
  refetch: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('@admin/quotes/data-access', () => ({
  useGetQuoteSettingsQuery: () => ({
    data: settings,
    isLoading: false,
    isError: false,
    refetch: api.refetch,
  }),
  useSaveQuoteSettingsMutation: () => [
    (draft: unknown) => ({ unwrap: () => api.save(draft) }),
    { isLoading: false },
  ],
  useConnectMailboxMutation: () => [
    (args: unknown) => ({ unwrap: () => api.connect(args) }),
    { isLoading: false },
  ],
  useSearchQuoteCatalogQuery: () => ({ data: undefined, isFetching: false }),
  useDisconnectMailboxMutation: () => [
    (userId: unknown) => ({ unwrap: () => api.disconnect(userId) }),
    { isLoading: false },
  ],
}));
vi.mock('@admin/media/feature', () => ({ MediaPickerDrawer: () => null }));

const renderPage = () =>
  render(
    <MemoryRouter>
      <QuoteSettingsPage />
    </MemoryRouter>,
  );

const section = (name: string) => within(screen.getByRole('region', { name }));

beforeEach(() => {
  api.save.mockReset();
  api.refetch.mockReset();
  api.connect.mockReset();
  api.disconnect.mockReset();
});
afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('«Налаштування КП»', () => {
  it('saves the manager contact from the side panel and a new letter template', async () => {
    api.save.mockResolvedValue({ ...settings, version: 3 });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Змінити контакт: Оля' }));
    const panel = within(screen.getByRole('dialog', { name: 'Оля у КП' }));
    fireEvent.change(panel.getByLabelText('Телефон'), { target: { value: '+380 50 111 22 33' } });
    fireEvent.click(panel.getByRole('button', { name: 'Готово' }));

    fireEvent.click(screen.getByRole('button', { name: 'Додати шаблон' }));
    const letters = section('Лист клієнту');
    fireEvent.change(letters.getByRole('textbox', { name: /Назва/ }), {
      target: { value: 'Короткий' },
    });
    fireEvent.change(letters.getByRole('textbox', { name: /Тема листа/ }), {
      target: { value: 'КП Brevi' },
    });
    fireEvent.change(letters.getByRole('textbox', { name: /Текст листа/ }), {
      target: { value: 'Надсилаю КП' },
    });

    expect(screen.getByText('Лист клієнту, Менеджери і Gmail')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as QuoteSettingsDraft;
    expect(sent.version).toBe(2);
    expect(sent.staffContacts[0]?.phone).toBe('+380 50 111 22 33');
    expect(sent.letterVariants[0]).toMatchObject({ name: 'Короткий', subject: 'КП Brevi' });
  });

  it('shows the rules next to the field and which section has them, and does not save', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('ЄДРПОУ'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('ЄДРПОУ — 8 цифр.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Компанія — 1 помилка' })).toBeVisible();
    expect(api.save).not.toHaveBeenCalled();
  });

  it('inserts a mark with a button, shows it filled in the preview and stops a typo', async () => {
    renderPage();
    const pdf = section('PDF КП під запит');
    const contact = pdf.getByLabelText('Контакт менеджера');
    fireEvent.change(contact, { target: { value: 'Ваш менеджер: ' } });
    fireEvent.click(
      pdf.getByRole('button', { name: 'Вставити «Менеджер» у поле «Контакт менеджера»' }),
    );

    expect(contact).toHaveValue('Ваш менеджер: {managerName}');
    fireEvent.click(screen.getByRole('button', { name: 'Перегляд' }));
    // The note fills the mark; the footer names the same manager.
    expect(
      within(screen.getByRole('img', { name: 'Перегляд PDF КП' })).getAllByText('Ольга'),
    ).toHaveLength(2);
    fireEvent.keyDown(screen.getByRole('img', { name: 'Перегляд PDF КП' }), { key: 'Escape' });

    fireEvent.change(contact, { target: { value: 'Ваш менеджер: {managerNmae}' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Зберегти' }));
    expect(
      await screen.findByText('Невідома мітка {managerNmae}. Вставте мітку кнопкою під полем.'),
    ).toBeVisible();
    expect(api.save).not.toHaveBeenCalled();
  });

  it('puts back the saved text of a field and of the whole page', () => {
    renderPage();
    const title = screen.getByRole('textbox', { name: /Заголовок документа/ });
    fireEvent.change(title, { target: { value: 'КП' } });
    fireEvent.click(screen.getByRole('button', { name: 'Повернути як було: Заголовок документа' }));
    expect(title).toHaveValue('КОМЕРЦІЙНА ПРОПОЗИЦІЯ');

    fireEvent.change(title, { target: { value: 'КП' } });
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати зміни' }));
    expect(title).toHaveValue('КОМЕРЦІЙНА ПРОПОЗИЦІЯ');
    expect(screen.getByText('Змін немає')).toBeVisible();
  });

  it('offers «Оновити» when someone saved the settings in another window', async () => {
    api.save.mockRejectedValue({
      status: 409,
      message: 'Налаштування змінили в іншому вікні. Оновіть сторінку.',
    });
    api.refetch.mockResolvedValue({ data: settings });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Змінити: Основний лист' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Тема листа/ }), {
      target: { value: 'Нова тема' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(
      await screen.findByText('Налаштування змінили в іншому вікні. Оновіть сторінку.'),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Оновити' }));
    await waitFor(() => expect(api.refetch).toHaveBeenCalledTimes(1));
  });

  it('connects Gmail without saving first and keeps the unsaved changes for the way back', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign, search: '' });
    api.connect.mockResolvedValue('https://accounts.google.com/o/oauth2/v2/auth?x=1');
    renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /Заголовок документа/ }), {
      target: { value: 'КП' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Підключити Gmail: Оля' }));

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith('https://accounts.google.com/o/oauth2/v2/auth?x=1'),
    );
    expect(api.connect).toHaveBeenCalledWith({ userId: 7, returnPath: '/crm/quote-settings' });
    vi.unstubAllGlobals();

    cleanup();
    renderPage();
    expect(screen.getByRole('textbox', { name: /Заголовок документа/ })).toHaveValue('КП');
    expect(screen.getByText(/Повернули ваші незбережені зміни/)).toBeVisible();
  });
});
