import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuoteVariantEditor } from '../editor/quote-variant-editor';

import type { CustomVersion, QuoteVariantDraft } from '@admin/clients/model';

const preview = vi.fn();
vi.mock('@admin/products/data-access', () => ({
  useListProductsQuery: () => ({ currentData: { value: [], pagedInfo: { totalPages: 0 } } }),
  useListSewingArticlesQuery: () => ({ currentData: { articles: [] } }),
}));
vi.mock('../../custom-sewing/editor/custom-workspace', () => ({
  CustomWorkspace: ({
    onPin,
    onState,
    initialId,
  }: {
    onPin: (value: CustomVersion, draftId: string) => void;
    onState: (dirty: boolean, busy: boolean) => void;
    initialId?: string;
  }) => (
    <>
      <span data-testid="opened-custom-root">{initialId ?? 'new'}</span>
      <button onClick={() => onState(true, false)}>Змінити склад у діалозі</button>
      <button
        onClick={() =>
          onPin(
            { id: '22222222-2222-4222-8222-222222222222' } as CustomVersion,
            '11111111-1111-4111-8111-111111111111',
          )
        }
      >
        Закріпити тестову версію
      </button>
    </>
  ),
}));
function Harness() {
  const [variant, setVariant] = useState<QuoteVariantDraft>({
    key: 'local',
    title: 'Варіант КП',
    visible: true,
    selection: { kind: 'customSewing', versionId: '' },
    basis: null,
    tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
  });
  return (
    <MemoryRouter>
      <QuoteVariantEditor
        variant={variant}
        disabled={false}
        now={Date.now()}
        onChange={setVariant}
        onPreview={preview}
        onMove={vi.fn()}
        onRemove={vi.fn()}
      />
      {variant.selection.kind === 'customSewing' && variant.selection.versionId && (
        <p>Вибрана V1</p>
      )}
    </MemoryRouter>
  );
}
afterEach(() => {
  cleanup();
  preview.mockReset();
});
describe('pin custom version into existing quote variant', () => {
  it('opens the new draft after the same quote variant receives a different server selection', async () => {
    const view = (draftId: string) => (
      <MemoryRouter>
        <QuoteVariantEditor
          variant={{
            key: 'same-variant',
            title: 'Stable quote variant',
            visible: true,
            selection: { kind: 'customSewing', versionId: 'version', draftId },
            basis: null,
            tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
          }}
          disabled={false}
          now={Date.now()}
          onChange={vi.fn()}
          onPreview={preview}
          onMove={vi.fn()}
          onRemove={vi.fn()}
        />
      </MemoryRouter>
    );
    const rendered = render(view('root-A'));
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити конфігурацію та версії' }));
    expect(screen.getByTestId('opened-custom-root')).toHaveTextContent('root-A');
    fireEvent.click(screen.getByRole('button', { name: 'Закрити редактор пошиття' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    rendered.rerender(view('root-B'));
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити конфігурацію та версії' }));
    expect(screen.getByTestId('opened-custom-root')).toHaveTextContent('root-B');
  });
  it('preserves unsaved quote text and still requires explicit quote server preview', async () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText(/Назва варіанта/), {
      target: { value: 'Keep quote input' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Створити конфігурацію пошиття' }));
    fireEvent.click(screen.getByRole('button', { name: 'Закріпити тестову версію' }));
    await screen.findByText('Вибрана V1');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText(/Назва варіанта/)).toHaveValue('Keep quote input');
    expect(preview).not.toHaveBeenCalled();
    expect(screen.getByText('Потрібен серверний розрахунок.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати вибір' }));
    expect(preview).toHaveBeenCalledTimes(1);
  });
  it('asks before discarding modal edits and returns to the unchanged quote', async () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Створити конфігурацію пошиття' }));
    fireEvent.click(screen.getByRole('button', { name: 'Змінити склад у діалозі' }));
    fireEvent.click(screen.getByRole('button', { name: 'Закрити редактор пошиття' }));
    expect(await screen.findByText('Незбережені зміни пошиття')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Відхилити й закрити' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText(/Назва варіанта/)).toHaveValue('Варіант КП');
    expect(screen.queryByText('Вибрана V1')).not.toBeInTheDocument();
  });
});
