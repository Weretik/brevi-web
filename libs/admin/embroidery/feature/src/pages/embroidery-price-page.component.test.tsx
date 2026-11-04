import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EmbroideryPricePage from './embroidery-price-page';
import { embroideryCalculationDelayMs } from '../hooks/calculation/use-embroidery-calculation';

import type {
  EmbroideryCalculation,
  EmbroideryFormSetup,
  EmbroiderySettings,
} from '@admin/embroidery/model';

const setup: EmbroideryFormSetup = {
  seesCost: false,
  hoops: [
    { id: '15', label: '15 см', blankWidthCm: 18, blankLengthCm: 18 },
    { id: '18', label: '18 см', blankWidthCm: 22, blankLengthCm: 22 },
  ],
  expenses: [
    { id: 'glue', name: 'Клей', basis: 'Hoop', mode: 'All', enabled: true, hasRate: true },
    {
      id: 'edge',
      name: 'Обробка краю',
      basis: 'Unit',
      mode: 'ChevronOnly',
      enabled: true,
      hasRate: false,
    },
  ],
  markupNames: ['Опт', 'Стандарт', 'Терміново'],
  settingsUpdatedAt: null,
};

const calculation: EmbroideryCalculation = {
  error: null,
  missing: [],
  hoopings: 50,
  fullHoopings: 50,
  lastHoopUnits: 1,
  freeInLastHoop: 0,
  prices: [
    { name: 'Опт', markupPercent: null, unit: 81.54, total: 4077, repeatUnit: 69.64 },
    { name: 'Стандарт', markupPercent: null, unit: 96.83, total: 4841.5, repeatUnit: 82.7 },
    { name: 'Терміново', markupPercent: null, unit: 112.12, total: 5606, repeatUnit: 95.75 },
  ],
  cost: null,
  stabilizer: null,
  fabric: null,
};

const settings: EmbroiderySettings = {
  version: 0,
  updatedByName: null,
  updatedAt: null,
  stitchRate: { value: 1, updatedOn: null },
  rates: { threadRate: 0.3, hoopingRate: 10, programHourRate: 300, taxPercent: 24 },
  markups: [
    { name: 'Опт', percent: 60 },
    { name: 'Стандарт', percent: 90 },
    { name: 'Терміново', percent: 120 },
  ],
  stabilizer: { pricePerMetre: 20, widthCm: 90 },
  fabric: { pricePerMetre: 80, widthCm: 150 },
  fabricIncreasePercent: 40,
  hoops: [{ id: '15', label: '15 см', blankWidthCm: 18, blankLengthCm: 18, glueRate: null }],
  expenses: [{ id: 'glue', name: 'Клей', basis: 'Hoop', rate: 4, enabled: true, mode: 'All' }],
};

const formQuery = vi.hoisted(() => vi.fn());
const calculateQuery = vi.hoisted(() => vi.fn());
const save = vi.hoisted(() => vi.fn());

vi.mock('@admin/embroidery/data-access', () => ({
  useGetEmbroideryFormQuery: formQuery,
  useCalculateEmbroideryQuery: calculateQuery,
  useGetEmbroiderySettingsQuery: () => ({
    data: settings,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useSaveEmbroiderySettingsMutation: () => [save, { isLoading: false }],
}));

beforeEach(() => {
  vi.useFakeTimers();
  calculateQuery.mockImplementation((request: unknown) => ({
    data: request === Symbol.for('skip') || typeof request !== 'object' ? undefined : calculation,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  formQuery.mockReset();
  calculateQuery.mockReset();
  save.mockReset();
});

function renderPage(isAdmin: boolean, url = '/crm/embroidery') {
  formQuery.mockReturnValue({ data: { ...setup, seesCost: isAdmin }, isLoading: false });
  const router = createMemoryRouter(
    [
      {
        path: '/crm/embroidery',
        element: <EmbroideryPricePage viewer={{ canEditSettings: isAdmin }} />,
      },
    ],
    { initialEntries: [url] },
  );
  return render(<RouterProvider router={router} />);
}

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('«Ціна вишивки»', () => {
  it('lets a Manager calculate without the settings tab', () => {
    renderPage(false);
    expect(screen.queryByRole('tab', { name: 'Налаштування' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Вкажіть кількість і стежки — ціна з’явиться тут.'),
    ).toBeInTheDocument();

    type('Кількість, шт', '50');
    type('Стежків на одиницю', '10000');
    act(() => {
      vi.advanceTimersByTime(embroideryCalculationDelayMs);
    });

    expect(calculateQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ quantity: 50, stitchesPerUnit: 10_000, hoopId: '15' }),
    );
    const prices = screen.getByRole('region', { name: 'Ціна' });
    expect(within(prices).getByText('81,54')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Собівартість' })).not.toBeInTheDocument();
  });

  it('shows chevron fields and costs only for chevrons', () => {
    renderPage(false);
    expect(screen.queryByText('Обробка краю')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Шеврони' }));
    expect(screen.getByLabelText('Шевронів в одних п’яльцях')).toBeInTheDocument();
    expect(screen.getByText('Обробка краю')).toBeInTheDocument();
    expect(screen.getByText(/ставку не задано/)).toBeInTheDocument();
  });

  it('marks prices «Орієнтовна» while a ticked cost has no rate', () => {
    calculateQuery.mockReturnValue({
      data: { ...calculation, missing: ['Обробка краю'] },
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
    renderPage(false);
    type('Кількість, шт', '5');
    type('Стежків на одиницю', '100');
    act(() => {
      vi.advanceTimersByTime(embroideryCalculationDelayMs);
    });
    expect(screen.getByText('Орієнтовна ціна.')).toBeInTheDocument();
    expect(screen.getByText(/Попросіть директора/)).toBeInTheDocument();
  });

  it('lets Director and Admin save «Налаштування» and offers «Оновити» on a conflict', async () => {
    save.mockReturnValue({
      unwrap: () => Promise.reject({ status: 409, message: 'Хтось зберіг раніше.' }),
    });
    renderPage(true, '/crm/embroidery?tab=settings');
    expect(screen.getByRole('tab', { name: 'Налаштування', selected: true })).toBeInTheDocument();
    expect(screen.getByText(/Ставки перенесено зі старого сайту/)).toBeInTheDocument();

    type('Одне зап’ялювання', '12');
    expect(screen.getByText(/Змінено:/)).toHaveTextContent('Змінено: Ставки');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    });
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        version: 0,
        settings: expect.objectContaining({
          rates: expect.objectContaining({ hoopingRate: 12 }),
        }),
      }),
    );
    expect(screen.getByText('Хтось зберіг раніше.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Оновити' })).toBeInTheDocument();
  });

  it('does not save a page with problems', async () => {
    renderPage(true, '/crm/embroidery?tab=settings');
    type('Податкове навантаження', '-1');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    });
    expect(save).not.toHaveBeenCalled();
    expect(screen.getByText(/Виправте:/)).toBeInTheDocument();
  });
});
