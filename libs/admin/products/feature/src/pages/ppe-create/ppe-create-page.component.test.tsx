import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PpeCreatePage } from './ppe-create-page';
import { render } from '../../test-utils';

const mocks = vi.hoisted(() => ({ create: vi.fn(), preview: vi.fn() }));

vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/products/data-access')>()),
  useCreateCatalogProductMutation: () => [mocks.create, { isLoading: false }],
  useGetProductCodeCheckQuery: (args: { code?: string }, options: { skip: boolean }) => ({
    currentData: options.skip
      ? undefined
      : {
          code: args.code,
          isAvailable: args.code !== '17',
          takenByProductId: args.code === '17' ? 3 : null,
          takenByProductName: args.code === '17' ? 'Рукавиці' : null,
          suggestedCode: null,
        },
    isFetching: false,
    isLoading: false,
    isError: false,
  }),
  usePreviewPpePricesQuery: (args: unknown, options: { skip: boolean }) =>
    mocks.preview(args, options),
}));

const list = <T,>(data: T[]) => ({ data, isLoading: false, error: undefined, refetch: vi.fn() });

vi.mock('@admin/references/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/references/data-access')>()),
  useListProductSectionsQuery: () =>
    list([
      { id: 1, type: 'Sewing', name: 'Одяг ЛІТО', isActive: true, comment: null, sortOrder: 1 },
      { id: 9, type: 'Ppe', name: 'Захист рук', isActive: true, comment: null, sortOrder: 2 },
    ]),
  useListSuppliersQuery: () =>
    list([
      { id: 5, name: 'АВ-Центр', isActive: true },
      { id: 6, name: 'Старий постачальник', isActive: false },
    ]),
  useListPpeMarkupRulesQuery: () =>
    list([
      {
        id: 1,
        name: 'Рукавиці — АВ-Центр',
        retailMarkup: 0.5,
        wholesaleMarkup: 0.3,
        largeWholesaleMarkup: 0.2,
        priceNote: 'Оптова ціна діє від 10 пар.',
        appliesTo: null,
        sortOrder: 1,
      },
    ]),
}));

function CardRoute() {
  const location = useLocation();
  return <p>Картка {JSON.stringify(location.state)}</p>;
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/references/products/new/ppe']}>
      <Routes>
        <Route path="/references/products/new/ppe" element={<PpeCreatePage />} />
        <Route path="/references/products/:id" element={<CardRoute />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function choose(user: ReturnType<typeof userEvent.setup>, field: RegExp, option: RegExp) {
  await user.click(screen.getByRole('combobox', { name: field }));
  await user.click(await screen.findByRole('option', { name: option }));
}

async function fillRequired(user: ReturnType<typeof userEvent.setup>, code = '1017') {
  await user.type(screen.getByRole('textbox', { name: /^Назва/ }), 'Рукавиці нітрилові');
  await user.type(screen.getByRole('textbox', { name: /^Артикул на сайті/ }), code);
  await choose(user, /^Розділ/, /^Захист рук$/);
  await user.type(screen.getByRole('combobox', { name: /^Одиниця/ }), 'пара');
  await choose(user, /^Постачальник/, /^АВ-Центр$/);
  await user.type(
    screen.getByRole('textbox', { name: /^Посилання постачальника/ }),
    'https://avcentr.com.ua/ua/rukavytsi',
  );
  await user.type(screen.getByRole('textbox', { name: /^Ціна постачальника/ }), '42,50');
  await choose(user, /^Правило націнки/, /^Рукавиці — АВ-Центр/);
}

const submitButton = () => screen.getByRole('button', { name: 'Створити ЗІЗ' });

beforeEach(() => {
  mocks.create.mockReset();
  mocks.create.mockResolvedValue({ data: { id: 42, type: 'Ppe', code: '1017', priceSaved: true } });
  mocks.preview.mockImplementation((_args: unknown, options: { skip: boolean }) => ({
    currentData: options.skip
      ? undefined
      : { prices: { retail: 63.75, wholesale: 55.25, largeWholesale: 51 }, blockers: [] },
    isFetching: false,
    isError: false,
  }));
});

afterEach(cleanup);

describe('PpeCreatePage', () => {
  it('offers only PPE sections and active suppliers', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('combobox', { name: /^Розділ/ }));
    expect(screen.queryByRole('option', { name: 'Одяг ЛІТО' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('combobox', { name: /^Постачальник/ }));
    expect(screen.queryByRole('option', { name: /Старий/ })).not.toBeInTheDocument();
  });

  it('enables «Створити ЗІЗ» once required fields are valid and sends the create body', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(submitButton()).toBeDisabled();
    const readiness = screen.getByRole('region', { name: 'Готовність' });
    expect(within(readiness).getByText('0 з 7')).toBeInTheDocument();

    await fillRequired(user);

    await waitFor(() => expect(submitButton()).toBeEnabled());
    expect(within(readiness).getByText('6 з 7')).toBeInTheDocument();
    const prices = screen.getByRole('region', { name: 'Ціни в прайсі' });
    await waitFor(() => expect(within(prices).getByText('Роздріб, від 1 шт.')).toBeInTheDocument());
    expect(
      within(prices).getByText('Примітка в прайсі: Оптова ціна діє від 10 пар.'),
    ).toBeInTheDocument();

    await user.click(submitButton());

    expect(mocks.create).toHaveBeenCalledWith({
      type: 'Ppe',
      code: '1017',
      name: 'Рукавиці нітрилові',
      sectionId: 9,
      season: null,
      isActive: true,
      isVerified: false,
      currentSiteUrl: null,
      quoteDescription: null,
      ppe: {
        supplierId: 5,
        supplierSku: null,
        supplierUrl: 'https://avcentr.com.ua/ua/rukavytsi',
        supplierPrice: 42.5,
        allowManualPrice: false,
        ruleCode: 'Рукавиці — АВ-Центр',
        unit: 'пара',
      },
    });
    expect(await screen.findByText('Картка null')).toBeInTheDocument();
  });

  it('shows a taken code and keeps «Створити ЗІЗ» disabled', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequired(user, '17');

    expect(
      await screen.findByText('Такий артикул уже є: «Рукавиці». Вкажіть інший.'),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('shows a conflict message and server field errors', async () => {
    const user = userEvent.setup();
    mocks.create.mockResolvedValueOnce({
      error: { code: 'Conflict', status: 409, message: 'Назва вже є.', fieldErrors: {} },
    });
    mocks.create.mockResolvedValueOnce({
      error: {
        code: 'Validation',
        status: 400,
        message: 'Перевірте введені дані.',
        fieldErrors: { 'ppe.SupplierId': 'Постачальника не знайдено.' },
      },
    });
    renderPage();
    await fillRequired(user);
    await waitFor(() => expect(submitButton()).toBeEnabled());

    await user.click(submitButton());
    expect(await screen.findByText('Назва вже є.')).toBeInTheDocument();

    await user.click(submitButton());
    expect(await screen.findByText('Постачальника не знайдено.')).toBeInTheDocument();
    expect(screen.queryByText('Назва вже є.')).not.toBeInTheDocument();
  });

  it('tells the card that the first price was not saved', async () => {
    const user = userEvent.setup();
    mocks.create.mockResolvedValueOnce({
      data: { id: 42, type: 'Ppe', code: '1017', priceSaved: false },
    });
    renderPage();
    await fillRequired(user);
    await waitFor(() => expect(submitButton()).toBeEnabled());

    await user.click(submitButton());

    expect(await screen.findByText('Картка {"ppePriceNotSaved":true}')).toBeInTheDocument();
  });
});
