import { emptyCustomConfiguration } from '@admin/clients/model';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomTemplateActions } from './custom-template-actions';

import type { CustomDetail, CustomTemplateDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({ apply: vi.fn(), revise: vi.fn(), archive: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  useApplyCustomTemplateMutation: () => [api.apply],
  useReviseCustomTemplateMutation: () => [api.revise],
  useArchiveCustomTemplateMutation: () => [api.archive],
}));
const configuration = {
  ...emptyCustomConfiguration(),
  name: 'Куртка',
  productType: 'Куртка',
  internalNote: 'private',
  fabrics: [{ referenceId: 1, quantity: 2, unit: 'Metre' }],
};
const draft: CustomDetail = {
  id: 'new-draft',
  revision: 1,
  ownerId: 17,
  customerId: null,
  quoteId: null,
  configuration,
  currentVersion: null,
  preview: null,
  canEdit: true,
  updatedAt: '2026-10-28T10:00:00Z',
};
const template: CustomTemplateDetail = {
  id: 'template',
  ownerId: 17,
  revision: 3,
  archived: false,
  versionId: 'immutable-v2',
  versionNumber: 2,
  introduction: 'Вступ',
  selections: { ...configuration, applications: [] },
  name: 'Куртка',
  productType: 'Куртка',
  season: 'winter',
  updatedAt: draft.updatedAt,
  canEdit: true,
};
afterEach(cleanup);
beforeEach(() => Object.values(api).forEach((mock) => mock.mockReset()));
describe('template explicit actions', () => {
  it('does not activate a late applied draft after the template view unmounts', async () => {
    let finish!: (value: { draft: CustomDetail }) => void;
    const pending = new Promise<{ draft: CustomDetail }>((resolve) => {
      finish = resolve;
    });
    api.apply.mockReturnValue({ unwrap: () => pending });
    const accepted = vi.fn();
    const view = render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={accepted}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' }));
    fireEvent.click(screen.getByRole('button', { name: 'Створити нову конфігурацію із шаблону' }));
    view.unmount();
    await act(async () => {
      finish({ draft });
      await pending;
    });
    expect(accepted).not.toHaveBeenCalled();
  });
  it('preserves introduction after revision conflict and reloads only explicitly', async () => {
    const refresh = vi.fn();
    api.revise.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 409,
          code: 'Conflict',
          message: 'Конфлікт версії',
          fieldErrors: {},
        }),
    });
    render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={vi.fn()}
        onRefresh={refresh}
      />,
    );
    fireEvent.change(screen.getByLabelText('Вступ шаблону для клієнта'), {
      target: { value: 'Незбережений вступ' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Зберегти поточний склад як нову версію шаблону' }),
    );
    await screen.findByText('Конфлікт версії');
    expect(screen.getByLabelText('Вступ шаблону для клієнта')).toHaveValue('Незбережений вступ');
    expect(refresh).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Оновити шаблон із сервера' }));
    expect(refresh).toHaveBeenCalledOnce();
  });
  it('reviews immutable selections and applies only after confirmation, returning a new draft', async () => {
    const accepted = vi.fn();
    api.apply.mockReturnValue({ unwrap: () => Promise.resolve({ draft }) });
    render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={accepted}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' }));
    expect(api.apply).not.toHaveBeenCalled();
    expect(screen.getByText(/Поточна конфігурація не зміниться/)).toBeInTheDocument();
    expect(screen.getByText('Довідник №1: 2 Metre')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Створити нову конфігурацію із шаблону' }));
    await waitFor(() => expect(accepted).toHaveBeenCalledWith(draft));
    expect(api.apply.mock.calls[0]![0]).toMatchObject({
      id: 'template',
      revision: 3,
      versionId: 'immutable-v2',
    });
    expect(api.revise).not.toHaveBeenCalled();
  });
  it('cancels review without a write', async () => {
    render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' }));
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(api.apply).not.toHaveBeenCalled();
  });
  it('shows apply but removes management actions when server denies editing', () => {
    render(
      <CustomTemplateActions
        value={{ ...template, canEdit: false }}
        detail={draft}
        disabled={false}
        onApplied={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Архівувати шаблон' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Зберегти поточний склад як нову версію шаблону' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' }),
    ).not.toBeDisabled();
  });
  it('revises from saved selections excluding private costs and flags', async () => {
    api.revise.mockReturnValue({ unwrap: () => Promise.resolve(template) });
    render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={vi.fn()}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Зберегти поточний склад як нову версію шаблону' }),
    );
    await screen.findByText(/Нову версію шаблону збережено/);
    expect(api.revise.mock.calls[0]![0].selections).not.toHaveProperty('internalNote');
  });
  it('retries uncertain apply with exactly the captured request and blocks competing edits', async () => {
    const accepted = vi.fn();
    api.apply
      .mockReturnValueOnce({
        unwrap: () =>
          Promise.reject({ status: 0, code: 'Network', message: 'Unknown', fieldErrors: {} }),
      })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve({ draft }) });
    render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={accepted}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' }));
    fireEvent.click(screen.getByRole('button', { name: 'Створити нову конфігурацію із шаблону' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Повторити ту саму дію' }));
    await waitFor(() => expect(accepted).toHaveBeenCalledTimes(1));
    expect(api.apply.mock.calls[1]![0]).toEqual(api.apply.mock.calls[0]![0]);
  });
  it('clears protected template content on denied write', async () => {
    const lost = vi.fn();
    api.archive.mockReturnValue({
      unwrap: () =>
        Promise.reject({ status: 403, code: 'Forbidden', message: 'Denied', fieldErrors: {} }),
    });
    render(
      <CustomTemplateActions
        value={template}
        detail={draft}
        disabled={false}
        onApplied={vi.fn()}
        onAccessLost={lost}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Архівувати шаблон' }));
    await screen.findByText('Шаблон не знайдено або доступ обмежено.');
    expect(lost).toHaveBeenCalledOnce();
    expect(screen.queryByLabelText('Вступ шаблону для клієнта')).not.toBeInTheDocument();
  });
  it('blocks applying archived templates and management during unsaved parent changes', () => {
    render(
      <CustomTemplateActions
        value={{ ...template, archived: true }}
        detail={draft}
        disabled
        onApplied={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Переглянути й застосувати шаблон' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Відновити шаблон' })).toBeDisabled();
  });
});
