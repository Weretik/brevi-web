import { financePeriodChoices } from '@admin/accounting/model';
import { FinanceSegmentedButtons } from '@admin/accounting/ui';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Box, Button, InputAdornment, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { useFinanceJournal } from '../../hooks/journal/use-finance-journal';
import type {
  CategoryDirection,
  FinanceJournalFilter,
  FinancePeriodKey,
  LedgerScope,
} from '@admin/accounting/model';
import type { ReactNode } from 'react';

type Journal = ReturnType<typeof useFinanceJournal>;
type TypeChoice = CategoryDirection | 'All';

interface Props {
  journal: Journal;
  scope: LedgerScope;
  cutoverDate: string;
  today: string;
  /** Operations add «Надходження» / «Витрати». */
  kind: 'transactions' | 'transfers';
  searchPlaceholder: string;
  /** The one-line totals shown on the right. */
  totals: ReactNode;
}

/** Filters of «Ще фільтри» that the quick bar does not show. */
const panelKeys: (keyof FinanceJournalFilter)[] = [
  'accountId',
  'categoryId',
  'min',
  'max',
  'includeVoided',
];

const searchDelayMs = 350;

/**
 * Search, quick periods, the type and «Ще фільтри» in one place above a journal. Quick choices
 * apply at once; the panel applies on «Застосувати».
 */
export function FinanceJournalQuickBar({
  journal,
  scope,
  cutoverDate,
  today,
  kind,
  searchPlaceholder,
  totals,
}: Props) {
  const { applied, applyNow } = journal;
  const choices = useMemo(
    () => financePeriodChoices(scope, cutoverDate, today),
    [scope, cutoverDate, today],
  );
  const period: FinancePeriodKey =
    choices.find((choice) => choice.from === applied.from && choice.to === applied.to)?.key ??
    'custom';
  const [text, setText] = useState(applied.search);
  const panelCount = panelKeys.filter((key) => applied[key] !== journal.defaults[key]).length;

  // The latest applyNow, so a typed search applies against the current filters.
  const apply = useRef(applyNow);
  useEffect(() => {
    apply.current = applyNow;
  });

  useEffect(() => setText(applied.search), [applied.search]);
  useEffect(() => {
    if (text.trim() === applied.search.trim()) return undefined;
    const timer = setTimeout(() => apply.current({ search: text }), searchDelayMs);
    return () => clearTimeout(timer);
  }, [text, applied.search]);

  return (
    <Stack sx={{ gap: 1.5, mb: 2 }}>
      <TextField
        type="search"
        value={text}
        placeholder={searchPlaceholder}
        onChange={(event) => setText(event.target.value)}
        slotProps={{
          htmlInput: { 'aria-label': 'Пошук' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ bgcolor: 'background.paper' }}
        fullWidth
      />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 1.5, alignItems: { md: 'center' }, justifyContent: 'space-between' }}
      >
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <FinanceSegmentedButtons
            label="Період"
            segments={[
              ...choices.map((choice) => ({ value: choice.key, label: choice.label })),
              { value: 'custom' as const, label: 'Свій період…' },
            ]}
            value={period}
            onChange={(next: FinancePeriodKey) => {
              const choice = choices.find((item) => item.key === next);
              if (choice) applyNow({ from: choice.from, to: choice.to });
              else if (!journal.open) journal.toggle();
            }}
          />
          {kind === 'transactions' && (
            <FinanceSegmentedButtons<TypeChoice>
              label="Тип"
              segments={[
                { value: 'All', label: 'Усі' },
                { value: 'Income', label: 'Надходження' },
                { value: 'Expense', label: 'Витрати' },
              ]}
              value={applied.type || 'All'}
              onChange={(next) =>
                applyNow({
                  type: next === 'All' ? '' : next,
                  categoryId: '',
                  subcategoryId: '',
                })
              }
            />
          )}
          <Button
            variant={journal.open ? 'contained' : 'outlined'}
            color={journal.open ? 'secondary' : 'inherit'}
            startIcon={<TuneOutlinedIcon />}
            aria-expanded={journal.open}
            onClick={journal.toggle}
          >
            {panelCount ? `Ще фільтри · ${panelCount}` : 'Ще фільтри'}
          </Button>
        </Stack>
        <Box sx={{ minWidth: 0 }}>{totals}</Box>
      </Stack>
    </Stack>
  );
}
