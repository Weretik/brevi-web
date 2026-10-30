import { emptyCustomConfiguration } from '@admin/clients/model';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomTemplatesPanel } from './custom-templates-panel';

import type { CustomDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  list: vi.fn(),
  detail: vi.fn(),
  error: null as unknown,
  fetching: false,
  snapshot: { id: 'selected', revision: 1 },
}));
vi.mock('@admin/clients/data-access', () => ({
  useCreateCustomTemplateMutation: () => [api.create],
  useGetCustomTemplatesQuery: (params: unknown) => {
    api.list(params);
    return {
      currentData: { rows: [], page: 1, totalPages: 0 },
      error: api.error,
      refetch: vi.fn(),
    };
  },
  useGetCustomTemplateQuery: (params: unknown, options: unknown) => {
    api.detail(params, options);
    return { currentData: api.snapshot, isFetching: api.fetching };
  },
}));
vi.mock('./custom-template-actions', () => ({
  CustomTemplateActions: function Actions() {
    const [value, setValue] = useState('');
    return (
      <input
        aria-label="Selected template input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
}));
const draft: CustomDetail = {
  id: 'draft',
  revision: 1,
  ownerId: 17,
  customerId: null,
  quoteId: null,
  configuration: {
    ...emptyCustomConfiguration(),
    name: 'Куртка',
    productType: 'Куртка',
    internalNote: 'private',
  },
  currentVersion: null,
  preview: null,
  canEdit: true,
  updatedAt: '2026-10-28T10:00:00Z',
};
beforeEach(() => {
  api.create.mockReset();
  api.list.mockClear();
  api.detail.mockClear();
  api.error = null;
  api.fetching = false;
});
afterEach(cleanup);
describe('template panel creation and query states', () => {
  it('retains selected action state during a background template refresh', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 'selected' }) });
    const view = render(
      <CustomTemplatesPanel detail={draft} disabled={false} onApplied={vi.fn()} />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Створити шаблон зі збереженої конфігурації' }),
    );
    await screen.findByLabelText('Selected template input');
    fireEvent.change(screen.getByLabelText('Selected template input'), {
      target: { value: 'Unsaved introduction' },
    });
    api.fetching = true;
    view.rerender(<CustomTemplatesPanel detail={draft} disabled={false} onApplied={vi.fn()} />);
    expect(screen.getByLabelText('Selected template input')).toHaveValue('Unsaved introduction');
  });
  it('creates from the saved configuration with a separate customer introduction', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 'created-template' }) });
    render(<CustomTemplatesPanel detail={draft} disabled={false} onApplied={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Вступ нового шаблону для клієнта'), {
      target: { value: 'Добрий день' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Створити шаблон зі збереженої конфігурації' }),
    );
    await waitFor(() =>
      expect(api.detail).toHaveBeenCalledWith({ id: 'created-template' }, { skip: false }),
    );
    expect(api.create.mock.calls[0]![0]).toMatchObject({
      introduction: 'Добрий день',
      selections: { name: 'Куртка' },
    });
    expect(api.create.mock.calls[0]![0].selections).not.toHaveProperty('internalNote');
  });
  it('blocks creation while parent input is dirty and lists empty state honestly', () => {
    render(<CustomTemplatesPanel detail={draft} disabled onApplied={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Створити шаблон зі збереженої конфігурації' }),
    ).toBeDisabled();
    expect(screen.getByText('Шаблонів немає.')).toBeInTheDocument();
  });
  it('requests archived templates explicitly', async () => {
    render(<CustomTemplatesPanel detail={draft} disabled={false} onApplied={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Показати архівні шаблони' }));
    await waitFor(() =>
      expect(api.list).toHaveBeenLastCalledWith({ page: 1, includeArchived: true }),
    );
  });
  it('hides cached content and clears parent access after a denied query', async () => {
    const lost = vi.fn();
    api.error = { status: 403, code: 'Forbidden', message: 'Denied', fieldErrors: {} };
    render(
      <CustomTemplatesPanel
        detail={draft}
        disabled={false}
        onApplied={vi.fn()}
        onAccessLost={lost}
      />,
    );
    expect(screen.getByText('Шаблони недоступні.')).toBeInTheDocument();
    expect(screen.queryByLabelText('Вступ нового шаблону для клієнта')).not.toBeInTheDocument();
    await waitFor(() => expect(lost).toHaveBeenCalled());
  });
});
