import { emptyCustomConfiguration, templateSelections } from '@admin/clients/model';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { CustomTemplateSelection } from './custom-template-selection';

import type { CustomDetail, CustomTemplateDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({ apply: vi.fn(), snapshot: null as unknown, fetching: false }));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomTemplateQuery: () => ({
    currentData: api.snapshot,
    isFetching: api.fetching,
    refetch: vi.fn(),
  }),
  useApplyCustomTemplateMutation: () => [api.apply],
  useReviseCustomTemplateMutation: () => [vi.fn()],
  useArchiveCustomTemplateMutation: () => [vi.fn()],
}));
afterEach(cleanup);
it('retains the captured version/request through a background revision change and timeout', async () => {
  const configuration = { ...emptyCustomConfiguration(), name: 'Куртка', productType: 'Куртка' };
  const draft: CustomDetail = {
    id: 'new-root',
    revision: 1,
    ownerId: 1,
    customerId: null,
    quoteId: null,
    configuration,
    currentVersion: null,
    preview: null,
    canEdit: true,
    updatedAt: '2026-10-28T12:00:00Z',
  };
  const template: CustomTemplateDetail = {
    id: 'template',
    revision: 1,
    ownerId: 1,
    archived: false,
    versionId: 'version-one',
    versionNumber: 1,
    introduction: 'Вступ',
    selections: templateSelections(configuration),
    name: 'Куртка',
    productType: 'Куртка',
    season: 'summer',
    updatedAt: draft.updatedAt,
    canEdit: true,
  };
  api.snapshot = template;
  api.fetching = false;
  let reject!: (value: unknown) => void;
  const pending = new Promise<never>((_resolve, failure) => {
    reject = failure;
  });
  api.apply
    .mockReset()
    .mockReturnValueOnce({ unwrap: () => pending })
    .mockReturnValueOnce({ unwrap: () => Promise.resolve({ draft }) });
  const accepted = vi.fn();
  const busy = vi.fn();
  const element = (
    <CustomTemplateSelection
      id="template"
      detail={draft}
      disabled={false}
      onApplied={accepted}
      onBusy={busy}
    />
  );
  const view = render(element);
  await screen.findByRole('button', { name: 'Переглянути й застосувати шаблон' });
  fireEvent.click(screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' }));
  fireEvent.click(screen.getByRole('button', { name: 'Створити нову конфігурацію із шаблону' }));
  await waitFor(() => expect(busy).toHaveBeenLastCalledWith(true));
  api.fetching = true;
  view.rerender(
    <CustomTemplateSelection
      id="template"
      detail={draft}
      disabled={false}
      onApplied={accepted}
      onBusy={busy}
    />,
  );
  api.snapshot = { ...template, revision: 2, versionId: 'version-two', versionNumber: 2 };
  api.fetching = false;
  view.rerender(
    <CustomTemplateSelection
      id="template"
      detail={draft}
      disabled={false}
      onApplied={accepted}
      onBusy={busy}
    />,
  );
  await act(async () => {
    reject({ status: 408, code: 'Timeout', message: 'Timeout', fieldErrors: {} });
    await pending.catch(() => undefined);
  });
  fireEvent.click(await screen.findByRole('button', { name: 'Повторити ту саму дію' }));
  await waitFor(() => expect(accepted).toHaveBeenCalledWith(draft));
  expect(api.apply.mock.calls[1]![0]).toEqual(api.apply.mock.calls[0]![0]);
  expect(api.apply.mock.calls[1]![0]).toMatchObject({ revision: 1, versionId: 'version-one' });
});
