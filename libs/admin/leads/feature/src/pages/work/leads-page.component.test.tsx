import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LeadsPage from './leads-page';

import type { LeadDetail, LeadSummary } from '@admin/leads/model';

const summary: LeadSummary = {
  id: 1,
  sourceId: 11,
  company: 'L&S Distributions',
  category: 'A',
  region: 'Львівська обл.',
  industry: 'Склад',
  callReason: 'Новий склад',
  stage: 'InWork',
  owner: { userId: 5, name: 'Анастасія' },
  lastResultName: null,
  lastCallAt: null,
  nextContactAt: null,
  isOverdue: false,
  callCount: 0,
  addedOn: null,
  inSheet: true,
  version: 3,
};

const detail: LeadDetail = {
  ...summary,
  categoryDescription: null,
  scale: null,
  signal: 'Відкривають новий склад',
  signalDate: null,
  factOrPlan: null,
  signalUrl: null,
  volumeReason: null,
  offer: 'Жилети',
  website: null,
  contacts: '+380 93 405 94 66',
  whomToCall: null,
  tenderCheck: null,
  reliability: null,
  email: null,
  sheetNotes: null,
  takenAt: null,
  openTaskId: null,
  calls: [],
};

const record = vi.hoisted(() => vi.fn());
const listQuery = vi.hoisted(() => vi.fn());
const idle = vi.hoisted(() => () => [vi.fn(), { isLoading: false }]);

vi.mock('@admin/leads/data-access', () => ({
  useGetLeadMyDayQuery: () => ({
    data: { queue: [summary], later: [], callsToday: 0, plannedToday: 1, free: 4 },
    isLoading: false,
    isError: false,
  }),
  useGetLeadCallResultsQuery: () => ({
    data: [
      { id: 9, name: 'Відмова', outcome: 'Closed', retryDays: null, isActive: true, position: 0 },
    ],
    isLoading: false,
    isError: false,
  }),
  useGetLeadQuery: () => ({ data: detail, isFetching: false, isError: false }),
  useRecordLeadCallMutation: () => [record, { isLoading: false }],
  useListLeadsQuery: listQuery,
  useTakeLeadMutation: idle,
  useReleaseLeadMutation: idle,
}));

afterEach(() => {
  cleanup();
  record.mockReset();
  listQuery.mockReset();
});

function renderPage(path = '/crm/leads') {
  listQuery.mockReturnValue({
    data: { items: [summary], total: 1, mine: 1, free: 4, all: 5 },
    isFetching: false,
    isError: false,
  });
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LeadsPage viewer={{ userId: 5, isAdmin: false, canEdit: true }} />
    </MemoryRouter>,
  );
}

describe('«Ліди»', () => {
  it('opens «Мій день» with the lead to call, its script and the call button', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'L&S Distributions' })).toBeVisible();
    expect(screen.getByText(/Відкривають новий склад/i, { selector: 'p' })).toBeVisible();
    expect(screen.getByRole('link', { name: '+380 93 405 94 66' })).toHaveAttribute(
      'href',
      'tel:+380934059466',
    );
  });

  it('records the call result with the lead version', async () => {
    record.mockReturnValue({ unwrap: () => Promise.resolve(detail) });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Відмова/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти → наступний' }));
    expect(record).toHaveBeenCalledWith({
      id: 1,
      version: 3,
      values: { resultId: 9, nextContactAt: '', comment: '' },
    });
    expect(await screen.findByText('Збережено: L&S Distributions')).toBeVisible();
  });

  it('shows free leads first in «Усі ліди» for a manager', () => {
    renderPage('/crm/leads?tab=all');
    expect(screen.getByRole('tab', { name: 'Усі ліди' })).toHaveAttribute('aria-selected', 'true');
    expect(listQuery).toHaveBeenCalledWith(expect.objectContaining({ scope: 'Free', page: 1 }));
    expect(screen.getByRole('button', { name: 'Вільні 4' })).toBeVisible();
  });
});
