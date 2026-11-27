import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useAccessRoleDraft } from './use-access-role-draft';

import type { AccessArea, AccessRole } from '@admin/users/model';
import type { ReactNode } from 'react';

const areas: AccessArea[] = [
  {
    key: 'quotes',
    group: 'Продажі',
    title: 'КП',
    actions: ['view', 'create', 'edit', 'delete'],
    actionLabels: {},
  },
  { key: 'leads', group: 'Продажі', title: 'Ліди', actions: ['view', 'edit'], actionLabels: {} },
];

const role = (name: string, patch: Partial<AccessRole> = {}): AccessRole => ({
  name,
  title: name,
  locked: false,
  builtIn: true,
  userCount: 0,
  userNames: [],
  version: 1,
  updatedByName: null,
  updatedAt: null,
  grants: { quotes: ['view'] },
  ...patch,
});

const roles = [
  role('Director', { locked: true }),
  role('Manager'),
  role('Accountant', { grants: { leads: ['view', 'edit'] } }),
];

function render(initialUrl = '/access', onTabChange = vi.fn()) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>
  );
  return renderHook(() => useAccessRoleDraft({ roles, areas, onTabChange }), { wrapper });
}

describe('useAccessRoleDraft', () => {
  it('opens the first editable role when the URL names none', () => {
    const { result } = render();

    expect(result.current.selectedRole?.name).toBe('Manager');
    expect(result.current.dirty).toBe(false);
    expect(result.current.grants).toEqual({ quotes: ['view'] });
  });

  it('opens the role named in the URL', () => {
    const { result } = render('/access?role=Accountant');

    expect(result.current.selectedRole?.name).toBe('Accountant');
  });

  it('marks the role changed after a switch and back to clean when undone', () => {
    const { result } = render();

    act(() => result.current.changeLevel(areas[1], 'view'));
    expect(result.current.grants).toEqual({ quotes: ['view'], leads: ['view'] });
    expect(result.current.dirty).toBe(true);
    expect(result.current.changedAreas.map((area) => area.title)).toEqual(['Ліди']);

    act(() => result.current.changeLevel(areas[1], 'none'));
    expect(result.current.dirty).toBe(false);
    expect(result.current.changedKeys.size).toBe(0);
  });

  it('gives a whole group one level and copies another role into the draft', () => {
    const { result } = render();

    act(() => result.current.changeGroupLevel({ title: 'Продажі', areas }, 'all'));
    expect(result.current.grants).toEqual({
      quotes: ['view', 'create', 'edit', 'delete'],
      leads: ['view', 'edit'],
    });

    act(() => result.current.copyFrom('Accountant'));
    expect(result.current.grants).toEqual({ leads: ['view', 'edit'] });
    expect(result.current.selectedRole?.name).toBe('Manager');
    expect(result.current.changedAreas.map((area) => area.key)).toEqual(['quotes', 'leads']);
  });

  it('asks before leaving a changed role and drops the changes when confirmed', () => {
    const onTabChange = vi.fn();
    const { result } = render('/access', onTabChange);

    act(() => result.current.changeAction('quotes', 'edit', true));
    act(() => result.current.requestTab('Accountant'));

    expect(result.current.pendingTab).toBe('Accountant');
    expect(result.current.selectedRole?.name).toBe('Manager');

    act(() => result.current.confirmPendingTab());

    expect(result.current.selectedRole?.name).toBe('Accountant');
    expect(result.current.pendingTab).toBeNull();
    expect(result.current.dirty).toBe(false);
    expect(onTabChange).toHaveBeenCalled();
  });

  it('switches at once when nothing changed', () => {
    const { result } = render();

    act(() => result.current.requestTab('Accountant'));

    expect(result.current.pendingTab).toBeNull();
    expect(result.current.selectedRole?.name).toBe('Accountant');
  });
});
