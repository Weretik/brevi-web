import {
  useGetTimesheetDayQuery,
  useSaveTimesheetDayMutation,
} from '@admin/production/data-access';
import { fillUnmarked, timesheetDraftState, todayIso } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';

import type { TimesheetDraft } from '@admin/production/model';

/** A day of «Робочий час»: the typed hours, what changed and saving the day. */
export function useTimesheetDay(onSaved: (message: string) => void) {
  const today = todayIso();
  const [date, setDate] = useState(today);
  const [draft, setDraft] = useState<TimesheetDraft>({});
  const [error, setError] = useState<string | null>(null);
  const day = useGetTimesheetDayQuery(date);
  const [saveDay, saving] = useSaveTimesheetDayMutation();
  const rows = useMemo(() => day.data?.rows ?? [], [day.data]);
  const state = useMemo(() => timesheetDraftState(rows, draft), [rows, draft]);
  const changed = useMemo(() => new Set(state.entries.map((x) => x.employeeId)), [state.entries]);
  const invalid = useMemo(() => new Set(state.invalid), [state.invalid]);
  const pending = state.entries.length + state.invalid.length;

  function choose(next: string) {
    if (!next || next === date) return;
    if (
      pending > 0 &&
      !window.confirm('Є незбережені години. Перейти до іншої дати без збереження?')
    )
      return;
    setDraft({});
    setError(null);
    setDate(next > today ? today : next);
  }

  async function save() {
    if (state.entries.length === 0 || state.invalid.length > 0) return;
    setError(null);
    try {
      await saveDay({ date, entries: state.entries }).unwrap();
      setDraft({});
      onSaved(`Години збережено: ${state.entries.length}.`);
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося зберегти години.'));
    }
  }

  return {
    today,
    date,
    day,
    rows,
    draft,
    changed,
    invalid,
    pending,
    error,
    saving: saving.isLoading,
    canSave: state.entries.length > 0 && state.invalid.length === 0,
    choose,
    save,
    change: (employeeId: number, value: string) => {
      setDraft((current) => ({ ...current, [employeeId]: value }));
      setError(null);
    },
    fill: (value: string) => setDraft((current) => fillUnmarked(rows, current, value)),
  };
}
