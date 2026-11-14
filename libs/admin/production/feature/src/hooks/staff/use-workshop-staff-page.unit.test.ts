import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useWorkshopStaffPage } from './use-workshop-staff-page';

const rows = [
  { id: 1, fullName: 'Олена Коваль', position: 'Швачка', isActive: true },
  { id: 2, fullName: 'Ірина Бондар', position: 'Закрійниця', isActive: true },
  { id: 3, fullName: 'Марія Мельник', position: 'Швачка', isActive: false },
];

vi.mock('@admin/production/data-access', () => ({
  useImportWorkshopStaffMutation: () => [vi.fn()],
}));
vi.mock('./use-workshop-staff', () => ({
  useWorkshopStaff: () => ({ rows, loading: false, error: null, reload: vi.fn() }),
}));
vi.mock('./use-workshop-employee-activation', () => ({
  useWorkshopEmployeeActivation: () => ({}),
}));

describe('useWorkshopStaffPage', () => {
  it('shows working people, then narrows by position, search and status', () => {
    const { result } = renderHook(() => useWorkshopStaffPage());
    expect(result.current.filtered.map((row) => row.id)).toEqual([1, 2]);
    expect(result.current.activeCount).toBe(2);

    act(() => result.current.setPosition('Швачка'));
    expect(result.current.filtered.map((row) => row.id)).toEqual([1]);

    act(() => {
      result.current.setPosition(null);
      result.current.setStatus('archived');
    });
    expect(result.current.filtered.map((row) => row.id)).toEqual([3]);
    expect(result.current.inStatus).toBe(1);
  });
});
