import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SiteRequestsPage from './site-requests-page';

import type { SiteRequest, SiteRequestPage } from '@admin/leads/model';

const request: SiteRequest = {
  id: 9,
  phone: '0504698675',
  workwear: 'Куртки робочі',
  quantity: '40 шт',
  comment: 'З логотипом',
  locale: 'uk',
  fileName: 'logo.pdf',
  fileUrl: 'https://cdn.example.com/site-requests/2026-11/a.pdf',
  status: 'New',
  ownerUserId: null,
  ownerName: null,
  takenAt: null,
  closedAt: null,
  note: null,
  createdAt: '2026-11-11T10:00:00Z',
  notifyError: 'Не вибрано групу Telegram.',
  version: 1,
};

const page: SiteRequestPage = {
  items: [request],
  total: 1,
  counts: { new: 1, inWork: 2, mine: 0, closed: 4 },
};

const change = vi.hoisted(() => vi.fn());

vi.mock('@admin/leads/data-access', () => ({
  useListSiteRequestsQuery: () => ({ data: page, isFetching: false, isError: false }),
  useChangeSiteRequestMutation: () => [change, { isLoading: false }],
}));

afterEach(() => {
  cleanup();
  change.mockReset();
});

const renderPage = (canEdit = true) =>
  render(
    <MemoryRouter>
      <SiteRequestsPage viewer={{ userId: 7, isAdmin: false, canEdit }} />
    </MemoryRouter>,
  );

describe('SiteRequestsPage', () => {
  it('lists requests with tab counts and marks a Telegram failure', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Заявки з сайту' })).toBeTruthy();
    expect(screen.getByText('Нові та в роботі 3')).toBeTruthy();
    expect(screen.getByText('050 469 86 75')).toBeTruthy();
    expect(screen.getByText('Не надіслано в Telegram')).toBeTruthy();
  });

  it('takes a request from the side panel', async () => {
    change.mockReturnValue({ unwrap: () => Promise.resolve(request) });
    renderPage();

    fireEvent.click(screen.getByText('050 469 86 75'));
    const panel = screen.getByRole('dialog');
    expect(within(panel).getByRole('link', { name: 'logo.pdf' })).toBeTruthy();
    fireEvent.click(within(panel).getByRole('button', { name: 'Беру' }));

    expect(change).toHaveBeenCalledWith({ id: 9, action: 'Take', version: 1, note: null });
  });

  it('shows no actions without edit rights', () => {
    renderPage(false);

    fireEvent.click(screen.getByText('050 469 86 75'));
    expect(within(screen.getByRole('dialog')).queryByRole('button', { name: 'Беру' })).toBeNull();
  });
});
