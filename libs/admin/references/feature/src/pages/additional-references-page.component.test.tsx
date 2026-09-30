import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdditionalReferencesPage } from './additional-references-page';

const row = { id: 3, name: 'Знижка', key: 'discount', value: 5, unit: '%', description: null };
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('additional references page', () => {
  it('shows an empty list without create or delete actions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 })),
    );
    render(<AdditionalReferencesPage />);
    expect(await screen.findByText('Додаткових довідників поки немає')).toBeVisible();
    expect(screen.queryByRole('button', { name: /створити|видалити/i })).not.toBeInTheDocument();
  });

  it('keeps the dialog and draft after a failed save, then refreshes after success', async () => {
    const user = userEvent.setup();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([row]), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ ...row, name: 'Нова знижка' }]), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetcher);
    render(<AdditionalReferencesPage />);
    await user.click(await screen.findByRole('button', { name: 'Редагувати' }));
    const dialog = screen.getByRole('dialog', { name: 'Редагування додаткового довідника' });
    await user.clear(within(dialog).getByRole('textbox', { name: 'Назва' }));
    await user.type(within(dialog).getByRole('textbox', { name: 'Назва' }), 'Нова знижка');
    await user.click(within(dialog).getByRole('button', { name: 'Зберегти' }));
    expect(await within(dialog).findByText('Назва вже існує.')).toBeVisible();
    expect(within(dialog).getByRole('textbox', { name: 'Назва' })).toHaveValue('Нова знижка');
    await user.click(within(dialog).getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Запис збережено.')).toBeVisible();
    expect(await screen.findByText('Нова знижка')).toBeVisible();
    expect(fetcher).toHaveBeenCalledTimes(4);
  }, 15000);
});
