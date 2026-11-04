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
afterEach(cleanup);

describe('«Налаштування КП»', () => {
  it('saves the edited contact and a new letter variant', async () => {
    api.save.mockResolvedValue({ ...settings, version: 3 });
    renderPage();

    fireEvent.change(section('Контакти менеджерів у КП').getByLabelText('Телефон'), {
      target: { value: '+380 50 111 22 33' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Додати варіант' }));
    const letters = section('Варіанти листа');
    fireEvent.change(letters.getByLabelText(/Назва варіанта 1/), { target: { value: 'Короткий' } });
    fireEvent.change(letters.getByLabelText(/Тема/), { target: { value: 'КП Brevi' } });
    fireEvent.change(letters.getByLabelText(/Текст/), { target: { value: 'Надсилаю КП' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as QuoteSettingsDraft;
    expect(sent.version).toBe(2);
    expect(sent.staffContacts[0]?.phone).toBe('+380 50 111 22 33');
    expect(sent.letterVariants[0]).toMatchObject({ name: 'Короткий', subject: 'КП Brevi' });
  });

  it('shows the rules next to the field and does not save', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('ЄДРПОУ'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    expect(await screen.findByText('ЄДРПОУ — 8 цифр.')).toBeVisible();
    expect(screen.getByText('Виправте позначені поля.')).toBeVisible();
    expect(api.save).not.toHaveBeenCalled();
  });

  it('offers «Оновити» when someone saved the settings in another window', async () => {
    api.save.mockRejectedValue({
      status: 409,
      message: 'Налаштування змінили в іншому вікні. Оновіть сторінку.',
    });
    api.refetch.mockResolvedValue({ data: settings });
    renderPage();
    fireEvent.change(screen.getByLabelText(/Тема листа/), { target: { value: 'Нова тема' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    expect(
      await screen.findByText('Налаштування змінили в іншому вікні. Оновіть сторінку.'),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Оновити' }));
    await waitFor(() => expect(api.refetch).toHaveBeenCalledTimes(1));
  });

  it('opens the Google page for the person whose Gmail is connected', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign, search: '' });
    api.connect.mockResolvedValue('https://accounts.google.com/o/oauth2/v2/auth?x=1');
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Підключити Gmail: Оля' }));

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith('https://accounts.google.com/o/oauth2/v2/auth?x=1'),
    );
    expect(api.connect).toHaveBeenCalledWith({ userId: 7, returnPath: '/crm/quote-settings' });
    vi.unstubAllGlobals();
  });

  it('asks to save the page before connecting Gmail', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/Тема листа/), { target: { value: 'Нова тема' } });

    expect(screen.getByRole('button', { name: 'Підключити Gmail: Оля' })).toBeDisabled();
    expect(screen.getByText('Спочатку збережіть зміни на сторінці.')).toBeVisible();
  });
});
