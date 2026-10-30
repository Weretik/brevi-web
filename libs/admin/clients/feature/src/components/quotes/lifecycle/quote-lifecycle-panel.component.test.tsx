import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuoteLifecyclePanel } from './quote-lifecycle-panel';
import { quoteDetailFixture } from '../../../testing/quotes/quote-detail.fixture';

import type { QuoteDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  copy: vi.fn(),
  transfer: vi.fn(),
  archive: vi.fn(),
  reprice: vi.fn(),
  preview: vi.fn(),
  assignees: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useCopyQuoteMutation: () => [api.copy],
  useTransferQuoteMutation: () => [api.transfer],
  useArchiveQuoteMutation: () => [api.archive],
  useRepriceQuoteMutation: () => [api.reprice],
  usePreviewQuotePricesMutation: () => [api.preview],
  useGetQuoteAssigneesQuery: api.assignees,
}));
const nextId = '99999999-9999-4999-8999-999999999999';
const complete = (value: QuoteDetail) => ({ unwrap: () => Promise.resolve(value) });
function show(detail = quoteDetailFixture(), disabled = false, selectedVersionId?: string) {
  const onAccepted = vi.fn();
  const onLock = vi.fn();
  const router = createMemoryRouter(
    [
      {
        path: '/start',
        element: (
          <QuoteLifecyclePanel
            detail={detail}
            disabled={disabled}
            selectedVersionId={selectedVersionId}
            selectedVersionNumber={selectedVersionId ? 1 : undefined}
            onAccepted={onAccepted}
            onLock={onLock}
            onNavigate={(path) => void router.navigate(path)}
          />
        ),
      },
      { path: '/crm/quotes/:quoteId', element: <p>Нова чернетка</p> },
      { path: '/crm/quotes', element: <p>Список КП</p> },
    ],
    { initialEntries: ['/start'] },
  );
  render(<RouterProvider router={router} />);
  return { router, onAccepted, onLock };
}
describe('quote lifecycle confirmation dialogs (SC-Q02/04/05)', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    api.assignees.mockReturnValue({
      currentData: { rows: [{ userId: 18, displayName: 'Другий менеджер' }], totalPages: 1 },
      isFetching: false,
    });
  });
  afterEach(cleanup);
  it('copies the selected historical version only after confirmation and opens the new root', async () => {
    const detail = { ...quoteDetailFixture(), versionNumber: 2 };
    api.copy.mockReturnValue(complete({ ...detail, publicId: nextId }));
    const { router } = show(detail, false, 'historical-version');
    expect(api.copy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Скопіювати КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Скопіювати КП' });
    expect(within(dialog).getByText(/вибраної версії 1/)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Скопіювати КП' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/crm/quotes/' + nextId));
    expect(api.copy.mock.calls[0][0]).toMatchObject({
      versionId: 'historical-version',
      revision: detail.revision,
    });
  });
  it('requires a reason for archive and accepts the saved server result', async () => {
    const detail = quoteDetailFixture();
    api.archive.mockReturnValue(complete({ ...detail, archived: true, revision: 2 }));
    const { onAccepted } = show(detail);
    fireEvent.click(screen.getByRole('button', { name: 'Архівувати КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Архівувати КП' });
    expect(within(dialog).getByRole('button', { name: 'Архівувати КП' })).toBeDisabled();
    fireEvent.change(within(dialog).getByLabelText(/Причина/), {
      target: { value: ' Завершено ' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Архівувати КП' }));
    await waitFor(() =>
      expect(onAccepted).toHaveBeenCalledWith(
        expect.objectContaining({ archived: true, revision: 2 }),
      ),
    );
    expect(api.archive.mock.calls[0][0]).toMatchObject({ archived: true, reason: 'Завершено' });
  });
  it('restores an archived quote without offering repricing while archived', async () => {
    const detail = { ...quoteDetailFixture(), archived: true };
    api.archive.mockReturnValue(complete({ ...detail, archived: false, revision: 2 }));
    show(detail);
    expect(screen.getByRole('button', { name: 'Перерахувати ціни' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Відновити КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Відновити КП' });
    fireEvent.change(within(dialog).getByLabelText(/Причина/), { target: { value: 'Продовжити' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Відновити КП' }));
    await waitFor(() =>
      expect(api.archive).toHaveBeenCalledWith(expect.objectContaining({ archived: false })),
    );
  });
  it('selects an eligible responsible by name and leaves the quote after losing access', async () => {
    const detail = quoteDetailFixture();
    api.transfer.mockReturnValue(complete({ ...detail, ownerId: 18, canEdit: false, revision: 2 }));
    const { router } = show(detail);
    fireEvent.click(screen.getByRole('button', { name: 'Передати КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Передати КП' });
    fireEvent.change(within(dialog).getByLabelText(/Причина/), {
      target: { value: 'Перерозподіл' },
    });
    fireEvent.mouseDown(within(dialog).getByRole('combobox', { name: 'Відповідальний' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Другий менеджер' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Передати КП' }));
    await waitFor(() => expect(router.state.location.search).toBe('?notice=transferred'));
    expect(api.transfer.mock.calls[0][0]).toMatchObject({
      ownerId: 18,
      reason: 'Перерозподіл',
      revision: 1,
    });
  });
  it('keeps the entered reason on conflict and never accepts an uncommitted result', async () => {
    api.archive.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Conflict', status: 409, message: 'Conflict', fieldErrors: {} }),
    });
    const { onAccepted } = show();
    fireEvent.click(screen.getByRole('button', { name: 'Архівувати КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Архівувати КП' });
    fireEvent.change(within(dialog).getByLabelText(/Причина/), {
      target: { value: 'Зберегти причину' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Архівувати КП' }));
    await screen.findByText(/КП або джерело ціни змінилися/);
    expect(within(dialog).getByLabelText(/Причина/)).toHaveValue('Зберегти причину');
    expect(onAccepted).not.toHaveBeenCalled();
  });
  it('locks inputs on timeout and retries the exact original action and key', async () => {
    api.archive
      .mockReturnValueOnce({
        unwrap: () =>
          Promise.reject({ code: 'Network', status: 0, message: 'Network', fieldErrors: {} }),
      })
      .mockReturnValueOnce(complete({ ...quoteDetailFixture(), archived: true, revision: 2 }));
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Архівувати КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Архівувати КП' });
    fireEvent.change(within(dialog).getByLabelText(/Причина/), {
      target: { value: 'Початкове рішення' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Архівувати КП' }));
    const retry = await within(dialog).findByRole('button', {
      name: 'Перевірити результат повтором',
    });
    expect(within(dialog).getByLabelText(/Причина/)).toBeDisabled();
    fireEvent.click(retry);
    await waitFor(() => expect(api.archive).toHaveBeenCalledTimes(2));
    expect(api.archive.mock.calls[1][0]).toEqual(api.archive.mock.calls[0][0]);
  });
  it('prices explicitly, shows comparison and posts only confirmed version/basis identities', async () => {
    const detail = quoteDetailFixture();
    const saved = detail.draft.items[0].variants[0].basis!.value;
    api.preview.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          ...saved,
          token: 'fresh-token',
          expiresAt: Date.now() + 60000,
          retail: 150,
        }),
      abort: vi.fn(),
    });
    api.reprice.mockReturnValue(
      complete({ ...detail, revision: 2, versionNumber: 2, versionId: nextId }),
    );
    const { onAccepted } = show(detail);
    fireEvent.click(screen.getByRole('button', { name: 'Перерахувати ціни' }));
    const dialog = screen.getByRole('dialog', { name: 'Перерахувати ціни КП' });
    expect(api.preview).not.toHaveBeenCalled();
    expect(within(dialog).getByRole('button', { name: 'Підтвердити нову версію' })).toBeDisabled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Оновити порівняння' }));
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: 'Підтвердити нову версію' })).toBeEnabled(),
    );
    expect(within(dialog).getByRole('table', { name: /Порівняння цін/ })).toBeInTheDocument();
    expect(api.reprice).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Підтвердити нову версію' }));
    await waitFor(() =>
      expect(onAccepted).toHaveBeenCalledWith(expect.objectContaining({ versionNumber: 2 })),
    );
    expect(api.reprice.mock.calls[0][0]).toMatchObject({
      versionId: detail.versionId,
      revision: 1,
      bases: [{ variantId: detail.draft.items[0].variants[0].publicId, basisToken: 'fresh-token' }],
    });
    expect(detail.draft.items[0].variants[0].basis!.value.retail).toBe(100);
  });
  it('blocks every lifecycle action while the editor has unsaved changes', () => {
    show(quoteDetailFixture(), true);
    expect(screen.getByRole('button', { name: 'Скопіювати КП' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Передати КП' })).toBeDisabled();
    expect(api.copy).not.toHaveBeenCalled();
  });
});
