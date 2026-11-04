import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PriceImportPage } from './price-import-page';
import { render } from '../../test-utils';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const source = (overrides: Record<string, unknown> = {}) => ({
  key: 'cemto',
  title: 'СЕМТО',
  method: 'File',
  schedule: 'Коли приходить новий прайс',
  logic: 'Ціна з PDF без знижки.',
  discountPercent: 0,
  defaultDiscountPercent: 0,
  supplierId: 5,
  supplierName: 'СЕМТО',
  productCount: 10,
  manualPriceCount: 0,
  fileKind: 'CemtoPdf',
  fileCount: 1,
  automaticUpdateConnected: false,
  settingsUpdatedAt: null,
  settingsUpdatedBy: null,
  lastRun: null,
  ...overrides,
});

const importRow = (overrides: Record<string, unknown>) => ({
  productId: 1,
  code: '1003',
  name: 'Черевики 8011',
  status: 'Changed',
  oldPrice: 600,
  newPrice: 620.22,
  oldWholesale: null,
  newWholesale: null,
  oldRetail: null,
  newRetail: null,
  message: null,
  ...overrides,
});

function stubApi(canChangeDiscounts: boolean) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    if (path.includes('/import') || path.includes('/refresh')) {
      const applied = path.includes('dryRun=false');
      return {
        ok: true,
        json: async () => ({
          sourceKey: 'cemto',
          applied,
          discountPercent: 0,
          checked: 2,
          changed: 1,
          unchanged: 0,
          skipped: 0,
          rows: [
            importRow({
              productId: 2,
              code: '1009',
              status: 'NotInFile',
              newPrice: null,
              message: 'Товар не знайдено у файлі.',
            }),
            importRow({}),
          ],
        }),
      };
    }
    if (init?.method === 'PUT') return { ok: true, status: 204, json: async () => null };
    return {
      ok: true,
      json: async () => ({
        canChangeDiscounts,
        sources: [
          source(),
          source({
            key: 'av-center',
            title: 'АВ-Центр',
            method: 'Website',
            fileKind: 'None',
            fileCount: 0,
            discountPercent: 20,
            defaultDiscountPercent: 20,
            supplierName: 'АВ-Центр',
            automaticUpdateConnected: true,
          }),
        ],
      }),
    };
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

function openPage() {
  render(
    <MemoryRouter initialEntries={['/references/price-import']}>
      <PriceImportPage />
    </MemoryRouter>,
  );
}

describe('price import page', () => {
  it('previews a СЕМТО PDF and applies the changed prices', async () => {
    const user = userEvent.setup();
    const fetcher = stubApi(false);
    openPage();

    expect(screen.getByRole('heading', { name: 'Імпорт цін' })).toBeVisible();
    const row = await screen.findByRole('row', { name: /АВ-Центр/ });
    expect(within(row).getByText('20%')).toBeVisible();

    await user.click(screen.getByRole('row', { name: /СЕМТО/ }));
    const panel = await screen.findByRole('dialog', { name: 'СЕМТО' });
    expect(within(panel).queryByRole('button', { name: 'Змінити знижку' })).toBeNull();

    await user.upload(
      within(panel).getByLabelText('Файли прайсу СЕМТО'),
      new File(['%PDF'], 'cemto.pdf', { type: 'application/pdf' }),
    );
    await user.click(within(panel).getByRole('button', { name: 'Перевірити' }));
    const changed = await within(panel).findByRole('row', { name: /1003/ });
    expect(within(changed).getByText('Зміниться')).toBeVisible();
    expect(within(panel).getByText('Товар не знайдено у файлі.')).toBeVisible();
    const problemRow = within(panel).getByRole('row', { name: /1009/ });
    expect(panel.querySelector('tbody tr')).toBe(changed.closest('tr'));
    expect(problemRow).toBeVisible();

    await user.click(within(panel).getByRole('button', { name: 'Застосувати (1)' }));
    expect(await screen.findByText('Ціни «СЕМТО» оновлено: змінено 1.')).toBeVisible();
    expect(
      fetcher.mock.calls.some(([path]) => String(path).includes('/cemto/import?dryRun=false')),
    ).toBe(true);
  });

  it('refreshes a website supplier now: preview, then apply', async () => {
    const user = userEvent.setup();
    const fetcher = stubApi(false);
    openPage();

    await user.click(await screen.findByRole('row', { name: /АВ-Центр/ }));
    const panel = await screen.findByRole('dialog', { name: 'АВ-Центр' });
    expect(within(panel).queryByLabelText('Файли прайсу АВ-Центр')).toBeNull();
    expect(within(panel).queryByText(/ще не підключено/)).toBeNull();

    await user.click(within(panel).getByRole('button', { name: 'Перевірити' }));
    expect(await within(panel).findByRole('row', { name: /1003/ })).toBeVisible();
    expect(
      fetcher.mock.calls.some(([path]) => String(path).includes('/av-center/refresh?dryRun=true')),
    ).toBe(true);

    await user.click(within(panel).getByRole('button', { name: 'Застосувати (1)' }));
    expect(await screen.findByText('Ціни «АВ-Центр» оновлено: змінено 1.')).toBeVisible();
    expect(
      fetcher.mock.calls.some(([path]) => String(path).includes('/av-center/refresh?dryRun=false')),
    ).toBe(true);
  });

  it('lets an administrator change a discount', async () => {
    const user = userEvent.setup();
    const fetcher = stubApi(true);
    openPage();

    await user.click(await screen.findByRole('row', { name: /АВ-Центр/ }));
    const panel = await screen.findByRole('dialog', { name: 'АВ-Центр' });
    await user.click(within(panel).getByRole('button', { name: 'Змінити знижку' }));
    const input = within(panel).getByLabelText(/Знижка від ціни постачальника/);
    await user.clear(input);
    await user.type(input, '95');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(within(panel).getByText('Знижка — від 0 до 90%.')).toBeVisible();

    await user.clear(input);
    await user.type(input, '18,5');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Знижку «АВ-Центр» збережено.')).toBeVisible();
    const put = fetcher.mock.calls.find(
      ([, init]) => (init as RequestInit | undefined)?.method === 'PUT',
    );
    expect(JSON.parse(String((put?.[1] as RequestInit).body))).toEqual({
      discountPercent: 18.5,
      supplierId: 5,
    });
  });
});
