import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PricingParametersPage } from './pricing-parameters-page';
import { render } from '../../test-utils';
import { ppeMarkupRuleRow, pricingParameterRow } from '../../testing/reference-fixtures';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function openPage(url = '/references/pricing-parameters') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <PricingParametersPage />
    </MemoryRouter>,
  );
}

function stubApi(write?: (path: string, init: RequestInit) => unknown) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    if (init?.method && init.method !== 'GET' && write) return write(path, init);
    if (path.endsWith('/ppe-markup-rules'))
      return { ok: true, json: async () => [ppeMarkupRuleRow()] };
    return {
      ok: true,
      json: async () => [
        pricingParameterRow(),
        pricingParameterRow({
          id: 1,
          code: 'SALARY_SEAMSTRESS',
          group: 'Оплата праці',
          name: 'Зарплата швачки',
          value: 17500,
          unit: 'грн/міс.',
          sortOrder: 1,
        }),
        pricingParameterRow({
          id: 3,
          code: 'MINUTE_COST_SEAMSTRESS',
          group: 'Оплата праці',
          name: 'Вартість 1 хвилини',
          value: 1.7785,
          unit: 'грн/хв',
          isCalculated: true,
          sortOrder: 3,
        }),
      ],
    };
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

describe('pricing parameters page', () => {
  it('shows sheet parameters with percents and filters them by section', async () => {
    const user = userEvent.setup();
    stubApi();
    openPage();

    expect(screen.getByRole('heading', { name: 'Параметри ціноутворення' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Параметри' })).toHaveAttribute('aria-selected', 'true');
    const row = await screen.findByRole('row', { name: /ASSEMBLY_RATE/ });
    expect(within(row).getByText('25 %')).toBeVisible();
    expect(screen.getByText('Вартість 1 хвилини')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Оплата праці 2' }));
    expect(screen.queryByText('Доплата на збирання виробу')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Кількість параметрів' })).toHaveTextContent(
      'Знайдено: 2 із 3',
    );
  });

  it('edits a percent value and sends it as a fraction', async () => {
    const user = userEvent.setup();
    const writes: { path: string; body: unknown }[] = [];
    stubApi((path, init) => {
      writes.push({ path, body: JSON.parse(String(init.body)) });
      return { ok: true };
    });
    openPage();

    fireEvent.contextMenu(await screen.findByRole('row', { name: /ASSEMBLY_RATE/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Редагувати' }));
    const value = screen.getByRole('textbox', { name: 'Значення' });
    expect(value).toHaveValue('25');
    await user.clear(value);
    await user.type(value, '30');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Параметр збережено.')).toBeVisible();
    expect(writes[0]?.path).toMatch(/\/api\/reference\/pricing-parameters\/7$/);
    expect(writes[0]?.body).toMatchObject({ value: 0.3, isCalculated: false });
  });

  it('opens the PPE markup tab from the URL', async () => {
    stubApi();
    openPage('/references/pricing-parameters?tab=ppe');

    expect(screen.getByRole('tab', { name: 'Націнки ЗІЗ' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    const row = await screen.findByRole('row', { name: /Взуття/ });
    expect(within(row).getByText('45 %')).toBeVisible();
    expect(within(row).getByText('37 %')).toBeVisible();
  });
});
