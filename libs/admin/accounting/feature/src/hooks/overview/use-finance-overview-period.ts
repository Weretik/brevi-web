import { financePeriodCaption, financePeriodChoices } from '@admin/accounting/model';
import { useMemo, useState } from 'react';

import type { FinancePeriod, FinancePeriodKey, LedgerScope } from '@admin/accounting/model';

/**
 * Books and period of «Бухгалтерія → Огляд»: a ready period or an applied «Свій період…», and the current books or
 * «Домашня бухгалтерія» (shown for all time).
 */
export function useFinanceOverviewPeriod(cutoverDate: string, today: string) {
  const [scope, setScope] = useState<LedgerScope>('Current');
  const [key, setKey] = useState<FinancePeriodKey>('month');
  const [custom, setCustom] = useState<FinancePeriod | null>(null);
  const [draft, setDraft] = useState<FinancePeriod | null>(null);
  const choices = useMemo(
    () => financePeriodChoices(scope, cutoverDate, today),
    [scope, cutoverDate, today],
  );
  const choice = choices.find((item) => item.key === key) ?? choices[0];
  const period = key === 'custom' && custom ? custom : (choice ?? { from: today, to: today });
  const caption =
    key === 'custom' && custom ? financePeriodCaption(custom) : (choice?.caption ?? '');
  const archive = scope === 'LegacyArchive';

  return {
    scope,
    archive,
    choices,
    key,
    period,
    caption,
    /** What the custom period form shows: the typed draft or the period in use. */
    typed: draft ?? period,
    choose: (next: FinancePeriodKey) => {
      setKey(next);
      setDraft(null);
    },
    setDraft,
    applyCustom: setCustom,
    switchScope: () => {
      setScope(archive ? 'Current' : 'LegacyArchive');
      setKey(archive ? 'month' : 'all');
      setCustom(null);
      setDraft(null);
    },
  };
}
