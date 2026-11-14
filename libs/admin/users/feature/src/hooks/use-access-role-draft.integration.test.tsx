import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useAccessRoleDraft } from './use-access-role-draft';

import type { AccessArea, AccessRole } from '@admin/users/model';
import type { ReactNode } from 'react';

const areas: AccessArea[] = [
  { key: 'quotes', group: 'Продажі', title: 'КП', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'leads', group: 'Продажі', title: 'Ліди', actions: ['view', 'edit'] },
];

const role = (name: string, patch: Partial<AccessRole> = {}): AccessRole => ({
  name,
  title: name,
  locked: false,
  builtIn: true,
  userCount: 0,
  version: 1,
  updatedByName: null,
  updatedAt: null,
  grants: { quotes: ['view'] },
  ...patch,
});

const roles = [role('Director', { locked: true }), role('Manager'), role('Accountant')];

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

    act(() => result.current.changeView('leads', true));
    expect(result.current.grants).toEqual({ quotes: ['view'], leads: ['view'] });
    expect(result.current.dirty).toBe(true);

    act(() => result.current.changeView('leads', false));
    expect(result.current.dirty).toBe(false);
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
