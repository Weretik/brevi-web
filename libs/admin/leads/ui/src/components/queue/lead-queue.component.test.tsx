import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LeadQueue } from './lead-queue';

import type { LeadSummary } from '@admin/leads/model';

const lead = (id: number, company: string, extra: Partial<LeadSummary> = {}): LeadSummary => ({
  id,
  sourceId: id,
  company,
  category: 'A',
  region: null,
  industry: null,
  callReason: null,
  stage: 'InWork',
  owner: { userId: 5, name: 'Анастасія' },
  lastResultName: null,
  lastCallAt: null,
  nextContactAt: null,
  isOverdue: false,
  callCount: 0,
  addedOn: null,
  inSheet: true,
  version: 1,
  ...extra,
});

afterEach(cleanup);

describe('LeadQueue', () => {
  it('shows the progress, marks the current lead and opens another one', () => {
    const onSelect = vi.fn();
    render(
      <LeadQueue
        day={{
          queue: [
            lead(1, 'L&S Distributions'),
            lead(2, 'Feednova', { lastResultName: 'Не дозвонились', callCount: 2 }),
          ],
          later: [],
          callsToday: 4,
          plannedToday: 6,
          free: 10,
        }}
        currentId={1}
        now={new Date(2026, 10, 9, 10, 0)}
        onSelect={onSelect}
        onFindMore={vi.fn()}
      />,
    );
    expect(screen.getByText('з 6 дзвінків')).toBeVisible();
    expect(screen.getByRole('button', { name: /L&S Distributions/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByText('Не дозвонились · 2-й дзвінок')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Feednova/ }));
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: 'Набрати вільних · 10' })).toBeEnabled();
  });
});
