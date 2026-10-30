import { introductionLayout } from '@admin/clients/model';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import IntroductionsPage from './introductions-page';

const mocks = vi.hoisted(() => ({
  open: vi.fn(),
  check: vi.fn(),
  apply: vi.fn(),
  archive: vi.fn(),
}));
vi.mock('@admin/products/data-access', () => ({
  useListProductsQuery: () => ({ currentData: { value: [], pagedInfo: { totalPages: 1 } } }),
  useGetProductQuery: () => ({}),
  useListSewingArticlesQuery: () => ({}),
}));
vi.mock('../../hooks/introductions/use-introduction-editor', () => ({
  useIntroductionEditor: () => ({
    draft: {
      values: { name: 'Літня добірка', format: 'summer', emailTemplateVersionId: 'email' },
      slots: [],
      source: { id: 'saved', versionId: 'version', revision: 1, archived: false },
      dirty: false,
      change: vi.fn(),
      selectProduct: vi.fn(),
      selectArticle: vi.fn(),
    },
    page: 1,
    setPage: vi.fn(),
    includeArchived: false,
    setIncludeArchived: vi.fn(),
    recipientName: 'ТОВ Замовник',
    setRecipientName: vi.fn(),
    list: {
      currentData: {
        rows: [{ id: 'saved', name: 'Збережена добірка', revision: 1, archived: false }],
        totalPages: 1,
      },
      refetch: vi.fn(),
    },
    mapping: { currentData: { versionId: 'mapping', summerProductId: 1, winterProductId: 10 } },
    action: { uncertain: false, pending: false, error: '', execute: vi.fn() },
    busy: false,
    readError: '',
    open: mocks.open,
    save: vi.fn(),
    setArchived: mocks.archive,
    checkSelection: mocks.check,
    applySelection: mocks.apply,
    reset: vi.fn(),
    selectionToken: 'saved:version:1',
    slotViews: introductionLayout('summer').map((slot) => ({
      slot,
      productLabel: 'Модель',
      fabricLabel: 'Тканина',
      blockers: [],
    })),
  }),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('introduction route composition', () => {
  it('opens an owned template and requires explicit current server approval before creating a quote', async () => {
    mocks.check.mockResolvedValue({ approved: true, blockers: [] });
    mocks.apply.mockResolvedValue(undefined);
    render(
      <MemoryRouter>
        <IntroductionsPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Добірки для першого знайомства' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(mocks.open).toHaveBeenCalledWith('saved');
    expect(screen.getByRole('button', { name: 'Застосувати як нову чернетку' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити добірку' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Застосувати як нову чернетку' })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Застосувати як нову чернетку' }));
    await waitFor(() => expect(mocks.apply).toHaveBeenCalled());
    expect(mocks.check).toHaveBeenCalledWith('saved:version:1');
  });
});
