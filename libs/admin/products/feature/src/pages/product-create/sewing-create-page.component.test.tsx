import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SewingCreatePage } from './sewing-create-page';
import { render } from '../../test-utils';

const mocks = vi.hoisted(() => ({
  codeCheck: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  draft: vi.fn(),
  requestModel: vi.fn(),
}));

vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useGetProductCodeCheckQuery: mocks.codeCheck,
  useCreateCatalogProductMutation: () => [mocks.create, { isLoading: false }],
  useUpdateProductOverviewMutation: () => [mocks.update, { isLoading: false }],
}));

vi.mock('@admin/references/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useListProductSectionsQuery: () => ({
    data: [
      { id: 4, type: 'Sewing', name: 'Одяг ЛІТО', isActive: true, comment: null, sortOrder: 0 },
      { id: 9, type: 'Ppe', name: 'Захист рук', isActive: true, comment: null, sortOrder: 1 },
    ],
    isError: false,
  }),
}));

vi.mock('../../hooks/sewing-create/use-sewing-create-draft', () => ({
  useSewingCreateDraft: mocks.draft,
}));
vi.mock('../../components/sewing-composition/sewing-composition-screen', () => ({
  SewingCompositionScreen: () => null,
}));
vi.mock('../../components/sewing-pricing/sewing-pricing-feature', () => ({
  SewingPricingFeature: () => null,
}));

const row = {
  id: 42,
  type: 'Sewing' as const,
  code: 'MOD-025',
  name: 'Костюм «Верде»',
  sectionId: 4,
  season: 'Літо' as const,
  isActive: false,
  isVerified: false,
  verifiedOn: null,
  currentSiteUrl: null,
  quoteDescription: 'Легкий костюм',
  updatedAtUtc: '2026-11-03T00:00:00Z',
};

function draft() {
  return {
    card: {
      row,
      sectionNames: new Map([[4, 'Одяг ЛІТО']]),
      overviewLoading: false,
      articles: [],
      summaryLoading: false,
      summaryError: null,
      reloadSummary: vi.fn(),
      totals: {
        articles: 0,
        ready: 0,
        minutes: null,
        fullCost: null,
        retail: null,
        unpublished: 0,
      },
      seamstressPerMinute: null,
    },
    controller: {
      queries: { articles: { data: { version: 3, modelCode: 'MOD-025', articles: [] } } },
      canManage: true,
      articleCreation: { state: { isLoading: false }, error: null },
      selection: {
        scope: 'Model',
        requestModel: mocks.requestModel,
        requestArticle: vi.fn(),
        requestCreateArticle: vi.fn(),
      },
      drafts: { dirty: false },
      busy: false,
    },
    labour: [],
    labourMinutes: 54,
    checks: [
      { key: 'article', label: 'Немає артикула', state: 'blocking' },
      { key: 'labour', label: 'Немає трудовитрат', state: 'ok' },
    ],
    ready: false,
    done: [1],
    labourSummary: { minutes: 54, piecesPerShift: 8 },
  };
}

function Location() {
  const location = useLocation();
  return <output aria-label="Адреса">{`${location.pathname}${location.search}`}</output>;
}

function renderPage(entry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/references/products/new/sewing',
        element: (
          <>
            <SewingCreatePage />
            <Location />
          </>
        ),
      },
      { path: '/references/products/:id', element: <Location /> },
      { path: '/references/products', element: <Location /> },
    ],
    { initialEntries: [entry] },
  );
  render(<RouterProvider router={router} />);
}

beforeEach(() => {
  mocks.draft.mockImplementation(draft);
  mocks.codeCheck.mockImplementation((args: { code?: string }) => ({
    data: args.code
      ? {
          code: args.code,
          isAvailable: true,
          takenByProductId: null,
          takenByProductName: null,
          suggestedCode: null,
        }
      : {
          code: null,
          isAvailable: null,
          takenByProductId: null,
          takenByProductName: null,
          suggestedCode: 'MOD-031',
        },
    isFetching: false,
  }));
  mocks.create.mockReturnValue({
    unwrap: () => Promise.resolve({ id: 77, type: 'Sewing', code: 'MOD-031', priceSaved: true }),
  });
  mocks.update.mockReturnValue({ unwrap: () => Promise.resolve(undefined) });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SewingCreatePage («Нова модель»)', () => {
  it('prefills the suggested code and saves step 1 as an inactive draft', async () => {
    const user = userEvent.setup();
    renderPage('/references/products/new/sewing');

    expect(screen.getByRole('heading', { name: 'Нова модель' })).toBeVisible();
    expect(screen.getByText('Нова модель · крок 1 з 5')).toBeVisible();
    expect(screen.getByLabelText(/Код моделі/)).toHaveValue('MOD-031');
    expect(screen.getByText('Код MOD-XXX має бути унікальним.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Артикули' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Далі' }));
    expect(screen.getByText('Вкажіть назву моделі.')).toBeVisible();
    expect(mocks.create).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/Назва/), 'Халат «Мед»');
    await user.click(screen.getByRole('combobox', { name: /Розділ/ }));
    const options = within(screen.getByRole('listbox'));
    expect(options.queryByText('Захист рук')).toBeNull();
    await user.click(options.getByText('Одяг ЛІТО'));
    await user.click(screen.getByRole('button', { name: 'Далі' }));

    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Sewing',
        code: 'MOD-031',
        name: 'Халат «Мед»',
        sectionId: 4,
        isActive: false,
        isVerified: false,
        ppe: null,
      }),
    );
    await waitFor(() =>
      expect(screen.getByLabelText('Адреса')).toHaveTextContent(
        '/references/products/new/sewing?id=77&step=2',
      ),
    );
    expect(mocks.draft).toHaveBeenCalledWith(77);
  });

  it('opens a saved draft on step 2 with its name, code and the readiness checklist', async () => {
    const user = userEvent.setup();
    renderPage('/references/products/new/sewing?id=42');

    expect(screen.getByRole('heading', { name: 'Костюм «Верде»' })).toBeVisible();
    expect(screen.getByText('MOD-025')).toBeVisible();
    expect(screen.getByText('Чернетка збережена · крок 2 з 5')).toBeVisible();
    expect(screen.getByText('Не готово до розрахунку')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Новий артикул' })).toBeVisible();
    const checklist = screen.getByRole('list', { name: 'Що заважає розрахунку' });
    expect(within(checklist).getByText('Немає артикула')).toBeVisible();
    expect(screen.getByText('Кожен артикул — свій колір або тканина.')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Модель/ }));
    expect(screen.getByRole('link', { name: 'Змінити в картці' })).toHaveAttribute(
      'href',
      '/references/products/42',
    );
    expect(screen.getByText('Легкий костюм')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: /Операції/ }));
    expect(screen.getByLabelText('Адреса')).toHaveTextContent('step=4');
    await user.click(screen.getByRole('switch', { name: 'Перевірено та підтверджено' }));
    expect(mocks.update).toHaveBeenCalledWith({
      id: 42,
      body: expect.objectContaining({ isVerified: true, isActive: false, code: 'MOD-025' }),
    });
  });

  it('launches the model on the last step and opens its card', async () => {
    const user = userEvent.setup();
    renderPage('/references/products/new/sewing?id=42&step=5');

    expect(
      screen.getByText(
        'Кожна ціна має бути вища за повну собівартість, перевірте назву і тканину.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('switch', { name: 'Активна · показувати в прайсі' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Запустити модель' }));

    expect(mocks.update).toHaveBeenCalledWith({
      id: 42,
      body: {
        code: 'MOD-025',
        sectionId: 4,
        season: 'Літо',
        isActive: true,
        isVerified: false,
        verifiedOn: null,
        currentSiteUrl: null,
        quoteDescription: 'Легкий костюм',
      },
    });
    await waitFor(() =>
      expect(screen.getByLabelText('Адреса')).toHaveTextContent(/^\/references\/products\/42$/),
    );
  });
});
