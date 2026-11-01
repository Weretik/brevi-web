import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useReminderTaskEditor } from './use-reminder-task-editor';

const api = vi.hoisted(() => ({ previewArgs: [] as unknown[][] }));
vi.mock('@admin/reminders/data-access', () => ({
  usePreviewReminderDueDatesQuery: (...args: unknown[]) => {
    api.previewArgs.push(args);
    return { currentData: [], isFetching: false };
  },
  useCreateReminderTaskMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateReminderTaskMutation: () => [vi.fn(), { isLoading: false }],
}));

describe('useReminderTaskEditor', () => {
  it('skips the preview while the dialog is closed or the schedule is invalid', () => {
    const { result } = renderHook(() => useReminderTaskEditor(vi.fn()));
    expect(api.previewArgs.at(-1)?.[1]).toEqual({ skip: true });
    act(() => result.current.open());
    act(() => result.current.change({ day: '99' }));
    expect(api.previewArgs.at(-1)?.[1]).toEqual({ skip: true });
  });
});
