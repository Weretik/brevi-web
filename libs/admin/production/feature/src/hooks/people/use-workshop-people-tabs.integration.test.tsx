import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { useWorkshopPeopleTabs } from './use-workshop-people-tabs';

import type { WorkshopPeopleAccess } from '@admin/production/model';
import type { ReactNode } from 'react';

const all: WorkshopPeopleAccess = { staff: true, timesheet: true, payroll: true };

const render = (access: WorkshopPeopleAccess, url = '/production/people') =>
  renderHook(() => useWorkshopPeopleTabs(access), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  });

describe('useWorkshopPeopleTabs', () => {
  it('gives the pay pulse tabs with «Зарплата» and opens the month', () => {
    const { result } = render(all);

    expect(result.current.tabs.map((x) => x.value)).toEqual(['month', 'payments', 'year', 'staff']);
    expect(result.current.current?.value).toBe('month');
  });

  it('keeps «Робочий час» as its own tab without «Зарплата»', () => {
    const { result } = render({ staff: false, timesheet: true, payroll: false });

    expect(result.current.tabs.map((x) => x.value)).toEqual(['timesheet']);
  });

  it('opens an old «Робочий час» address as the month with the day panel', () => {
    const { result } = render(all, '/production/people?tab=timesheet');

    expect(result.current.current?.value).toBe('month');
    expect(result.current.markDayOnOpen).toBe(true);
  });

  it('switches the tab in the address', () => {
    const { result } = render(all);

    act(() => result.current.select('year'));

    expect(result.current.current?.value).toBe('year');
  });
});
