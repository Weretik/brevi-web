import { emptyCustomConfiguration } from '@admin/clients/model';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomEditorForm } from './custom-editor-form';
import { CustomWorkspace } from './custom-workspace';

import type { CustomDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  save: vi.fn(),
  calculate: vi.fn(),
  version: vi.fn(),
}));
const initial: CustomDetail = {
  id: 'root-A',
  revision: 1,
  ownerId: 17,
  quoteId: null,
  customerId: null,
  configuration: {
    ...emptyCustomConfiguration(),
    name: 'Тканина A',
    productType: 'Куртка',
    fabrics: [{ referenceId: 1, quantity: 2, unit: 'Metre' }],
    operations: [{ referenceId: 2, quantity: 1, manualMinutes: null }],
  },
  currentVersion: null,
  preview: null,
  updatedAt: '2026-10-28T10:00:00Z',
  canEdit: true,
};
vi.mock('@admin/clients/data-access', () => ({
  useCreateCustomSewingMutation: () => [api.create],
  useSaveCustomSewingMutation: () => [api.save],
  useCalculateCustomSewingMutation: () => [api.calculate],
  useSaveCustomSewingVersionMutation: () => [api.version],
  useGetCustomSewingQuery: () => ({
    currentData: initial,
    refetch: () => ({ unwrap: () => Promise.resolve(initial) }),
  }),
  useGetCustomSewingVersionsQuery: () => ({ currentData: { rows: [], page: 1, totalPages: 0 } }),
  useGetCustomSewingVersionQuery: () => ({}),
}));
vi.mock('@admin/references/data-access', () => ({
  useListFabricsQuery: () => ({
    currentData: [
      { id: 1, name: 'Тканина A' },
      { id: 3, name: 'Тканина B' },
    ],
  }),
  useListGarmentAccessoriesQuery: () => ({ currentData: [] }),
  useListGarmentPartOperationsQuery: () => ({
    currentData: [{ id: 2, name: 'Шов', garmentPartName: 'Рукав' }],
  }),
}));
vi.mock('../../custom-suggestions/custom-suggestions-panel', () => ({
  CustomSuggestionsPanel: ({
    disabled,
    onApply,
  }: {
    disabled: boolean;
    onApply: (configuration: CustomDetail['configuration']) => void;
  }) => (
    <button
      disabled={disabled}
      onClick={() => onApply({ ...initial.configuration, name: 'Suggested fresh draft' })}
    >
      Create suggested draft
    </button>
  ),
}));
vi.mock('../../custom-files/custom-artwork-picker', () => ({ CustomArtworkPicker: () => null }));
vi.mock('../../custom-files/custom-files-panel', () => ({
  CustomFilesPanel: ({
    disabled,
    onState,
    onAccepted,
    detail,
    onAccessLost,
  }: {
    disabled: boolean;
    onState: (dirty: boolean, locked: boolean) => void;
    onAccepted: (value: CustomDetail) => void;
    detail: CustomDetail;
    onAccessLost: () => void;
  }) => (
    <>
      <button disabled={disabled} onClick={() => onState(true, false)}>
        Stage file flags
      </button>
      <button disabled={disabled} onClick={() => onState(true, true)}>
        Unknown file result
      </button>
      <button
        disabled={disabled}
        onClick={() => {
          onState(false, false);
          onAccepted({ ...detail, revision: detail.revision + 1 });
        }}
      >
        Accept file links
      </button>
      <button onClick={onAccessLost}>Deny file access</button>
    </>
  ),
}));
vi.mock('../../custom-templates/custom-templates-panel', () => ({
  CustomTemplatesPanel: ({
    disabled,
    onApplied,
  }: {
    disabled: boolean;
    onApplied: (detail: CustomDetail) => void;
  }) => (
    <button
      disabled={disabled}
      onClick={() =>
        onApplied({
          ...initial,
          id: 'new-template-root',
          configuration: { ...initial.configuration, name: 'New template draft' },
        })
      }
    >
      Apply template to new draft
    </button>
  ),
}));
beforeEach(() => Object.values(api).forEach((mock) => mock.mockReset()));
afterEach(cleanup);
describe('private custom editor interactions', () => {
  it('blocks competing config writes while file flags are unsaved and adopts new revision after finalize', async () => {
    const onAccepted = vi.fn();
    const onState = vi.fn();
    render(<CustomEditorForm initial={initial} onAccepted={onAccepted} onState={onState} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stage file flags' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Зберегти конфігурацію' })).toBeDisabled();
    expect(onState).toHaveBeenLastCalledWith(true, false);
    fireEvent.click(screen.getByRole('button', { name: 'Accept file links' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toBeEnabled();
    expect(screen.getByText(/Приватна конфігурація · зміна 2/)).toBeInTheDocument();
    expect(onAccepted).toHaveBeenCalledWith(expect.objectContaining({ revision: 2 }));
    expect(api.save).not.toHaveBeenCalled();
    expect(api.calculate).not.toHaveBeenCalled();
  });

  it('uses a new alternative for template application and preserves the original draft', () => {
    render(
      <MemoryRouter>
        <CustomWorkspace initialId={initial.id} onState={vi.fn()} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Apply template to new draft' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue('New template draft');
    fireEvent.click(screen.getByRole('tab', { name: 'Тканина 1' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue(initial.configuration.name);
    expect(api.save).not.toHaveBeenCalled();
  });

  it('starts suggestions as an independent unsaved configuration and retains source', () => {
    render(
      <MemoryRouter>
        <CustomWorkspace initialId={initial.id} onState={vi.fn()} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Create suggested draft' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue('Suggested fresh draft');
    expect(screen.getByText('Нова приватна конфігурація')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Тканина 1' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue(initial.configuration.name);
    expect(api.create).not.toHaveBeenCalled();
    expect(api.calculate).not.toHaveBeenCalled();
  });

  it('hides the entire cached workspace after file access loss', () => {
    render(
      <MemoryRouter>
        <CustomWorkspace initialId={initial.id} onState={vi.fn()} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Deny file access' }));
    expect(screen.queryByLabelText(/Назва конфігурації/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Створити альтернативу з іншою тканиною' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('доступ обмежено');
  });

  it('replaces input only after confirmed reload and does not start pricing or writes', async () => {
    const reload = vi.fn(async () => initial);
    render(
      <CustomEditorForm initial={initial} onAccepted={vi.fn()} onState={vi.fn()} reload={reload} />,
    );
    fireEvent.change(screen.getByLabelText(/Назва конфігурації/), {
      target: { value: 'Unsaved input' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Оновити конфігурацію із сервера' }));
    expect(reload).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Прийняти дані сервера' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue(initial.configuration.name);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(api.save).not.toHaveBeenCalled();
    expect(api.calculate).not.toHaveBeenCalled();
    expect(api.version).not.toHaveBeenCalled();
  });

  it('keeps blocker input editable and does not silently save a version', async () => {
    api.calculate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          ...initial,
          preview: {
            token: 'token',
            calculatedAt: initial.updatedAt,
            expiresAt: Date.now() + 60000,
            formulaVersion: 'custom-sewing-sheet-v1',
            internalCost: null,
            retail: null,
            wholesale: null,
            largeWholesale: null,
            blockers: ['ApplicationSaleNotApproved'],
            isCalculated: false,
          },
        }),
    });
    render(<CustomEditorForm initial={initial} onAccepted={vi.fn()} onState={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати на сервері' }));
    expect(await screen.findByText('Погодьте продажну суму нанесення.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Назва конфігурації/)).not.toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Назва конфігурації/), {
      target: { value: 'Уточнено' },
    });
    expect(screen.getByRole('button', { name: 'Зберегти незмінну версію' })).toBeDisabled();
    expect(api.version).not.toHaveBeenCalled();
  });
  it('creates a second independent fabric draft and never copies a price basis', async () => {
    api.create.mockImplementation((args) => ({
      unwrap: () =>
        Promise.resolve({ ...initial, id: 'root-B', configuration: args.configuration }),
    }));
    render(
      <MemoryRouter>
        <CustomWorkspace initialId="root-A" onState={vi.fn()} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Створити альтернативу з іншою тканиною' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue('Тканина A — інша тканина');
    expect(screen.getByRole('button', { name: 'Розрахувати на сервері' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти конфігурацію' }));
    await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
    expect(api.create.mock.calls[0]![0]).not.toHaveProperty('basisToken');
    expect(initial.configuration.name).toBe('Тканина A');
    expect(api.calculate).not.toHaveBeenCalled();
  });
  it('asks before replacing dirty input with server state', async () => {
    const reload = vi.fn(async () => initial);
    render(
      <CustomEditorForm initial={initial} onAccepted={vi.fn()} onState={vi.fn()} reload={reload} />,
    );
    fireEvent.change(screen.getByLabelText(/Назва конфігурації/), {
      target: { value: 'Keep input' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Оновити конфігурацію із сервера' }));
    expect(reload).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Залишити введення' }));
    expect(screen.getByLabelText(/Назва конфігурації/)).toHaveValue('Keep input');
  });
});
