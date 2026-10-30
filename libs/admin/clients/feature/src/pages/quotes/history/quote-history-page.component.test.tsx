import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import QuoteHistoryPage from './quote-history-page';
import { quoteDetailFixture } from '../../../testing/quotes/quote-detail.fixture';

import type { QuoteVersion } from '@admin/clients/model';

const hooks = vi.hoisted(() => ({
  root: vi.fn(),
  versions: vi.fn(),
  snapshot: vi.fn(),
  events: vi.fn(),
  preview: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetQuoteQuery: hooks.root,
  useGetQuoteVersionsQuery: hooks.versions,
  useGetQuoteVersionQuery: hooks.snapshot,
  useGetQuoteEventsQuery: hooks.events,
}));
vi.mock('../../../components/quotes/lifecycle/quote-lifecycle-panel', () => ({
  QuoteLifecyclePanel: ({ selectedVersionId }: { selectedVersionId: string }) => (
    <p>Версія для копії: {selectedVersionId}</p>
  ),
}));
const detail = quoteDetailFixture();
const older = '88888888-8888-4888-8888-888888888888';
const current: QuoteVersion = {
  publicId: detail.versionId,
  versionNumber: 2,
  action: 'edited',
  actorId: 17,
  createdAt: detail.updatedAt,
  draft: {
    ...detail.draft,
    items: detail.draft.items.map((item) => ({ ...item, publicDescription: 'Новий опис' })),
  },
};
const previous: QuoteVersion = {
  ...current,
  publicId: older,
  versionNumber: 1,
  action: 'created',
  draft: detail.draft,
};
const page = {
  rows: [
    {
      publicId: current.publicId,
      versionNumber: 2,
      action: 'edited',
      actorId: 17,
      createdAt: detail.updatedAt,
      parentVersionId: older,
    },
    {
      publicId: older,
      versionNumber: 1,
      action: 'created',
      actorId: 17,
      createdAt: detail.updatedAt,
      parentVersionId: null,
    },
  ],
  page: 1,
  pageSize: 25,
  total: 2,
  totalPages: 3,
};
function show(search = '') {
  const router = createMemoryRouter(
    [{ path: '/crm/quotes/:quoteId/history', element: <QuoteHistoryPage /> }],
    {
      initialEntries: ['/crm/quotes/' + detail.publicId + '/history' + search],
    },
  );
  render(<RouterProvider router={router} />);
  return router;
}
describe('quote immutable version history route (SC-Q02/05)', () => {
  beforeEach(() => {
    Object.values(hooks).forEach((mock) => mock.mockReset());
    hooks.root.mockReturnValue({
      currentData: { ...detail, versionNumber: 2 },
      isFetching: false,
      refetch: vi.fn(),
    });
    hooks.versions.mockReturnValue({ currentData: page, isFetching: false, refetch: vi.fn() });
    hooks.events.mockReturnValue({
      currentData: { ...page, rows: [] },
      isFetching: false,
      refetch: vi.fn(),
    });
    hooks.snapshot.mockImplementation(
      ({ versionId }: { versionId: string }, { skip }: { skip: boolean }) =>
        skip
          ? {}
          : {
              currentData: versionId === older ? previous : current,
              isFetching: false,
              refetch: vi.fn(),
            },
    );
  });
  afterEach(cleanup);
  it('selects a historical snapshot through URL state and keeps current and old content separate', () => {
    const router = show();
    expect(screen.getByText('Новий опис')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути версію 1' }));
    expect(router.state.location.search).toContain('version=' + older);
    expect(screen.getByText('Збережений опис')).toBeInTheDocument();
    expect(screen.queryByText('Новий опис')).not.toBeInTheDocument();
    expect(screen.getByText('Версія для копії: ' + older)).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox').every((input) => input.hasAttribute('disabled'))).toBe(
      true,
    );
  });
  it('compares typed saved snapshots with the parent only on explicit request', () => {
    const router = show();
    expect(screen.queryByText('Порівняння версій 1 → 2')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Порівняти з попередньою версією' }));
    expect(router.state.location.search).toContain('compare=parent');
    expect(screen.getByText('Порівняння версій 1 → 2')).toBeInTheDocument();
    expect(screen.getByText(/Опис: Збережений опис → Новий опис/)).toBeInTheDocument();
  });
  it('retains independently paged version and action queries in the URL', () => {
    show('?versionPage=2&eventPage=3&version=' + older);
    expect(hooks.versions).toHaveBeenLastCalledWith(
      { quoteId: detail.publicId, page: 2, pageSize: 25 },
      { skip: false },
    );
    expect(hooks.events).toHaveBeenLastCalledWith(
      { quoteId: detail.publicId, page: 3, pageSize: 25 },
      { skip: false },
    );
  });
  it('does not render cached private snapshots after access fails', () => {
    hooks.root.mockReturnValue({
      currentData: detail,
      error: { code: 'NotFound', status: 404, message: 'Not Found', fieldErrors: {} },
      refetch: vi.fn(),
    });
    show();
    expect(screen.getByText('КП або клієнта не знайдено чи доступ обмежено.')).toBeInTheDocument();
    expect(screen.queryByText('Збережений опис')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(hooks.versions.mock.calls.at(-1)?.[1]?.skip).toBe(true);
  });
});
