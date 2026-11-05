import {
  useGetFinanceAccountsQuery,
  useGetFinanceOverviewQuery,
} from '@admin/accounting/data-access';
import { defaultFinanceJournalFilter, legacyArchiveStart } from '@admin/accounting/model';
import { FinanceBalancesTable, FinanceOverviewSummary } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { financeReviewPath } from '../../accounting.routes';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';

import type { LedgerScope } from '@admin/accounting/model';

type OverviewScope = LedgerScope | 'All';

const scopeLabels: Record<OverviewScope, string> = {
  Current: 'Поточний облік',
  LegacyArchive: 'Домашня бухгалтерія',
  All: 'Усе разом',
};

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function periodOf(scope: OverviewScope, cutoverDate: string, today: string) {
  if (scope === 'All') return { from: legacyArchiveStart, to: today };
  const { from, to } = defaultFinanceJournalFilter(scope, cutoverDate, today);
  return { from, to };
}

/** «Бухгалтерія → Огляд»: balances, income and expense of a period per currency. */
export function FinanceOverviewPage() {
  const { cutoverDate, today } = useAccountingSettings();
  const [scope, setScope] = useState<OverviewScope>('Current');
  const [draft, setDraft] = useState<{ from: string; to: string } | null>(null);
  const [applied, setApplied] = useState<{ from: string; to: string } | null>(null);
  const period = applied ?? periodOf(scope, cutoverDate, today);
  const typed = draft ?? period;
  const problem = typed.to < typed.from ? 'Кінець періоду раніший за початок.' : null;
  const query = useGetFinanceOverviewQuery({
    ...period,
    scope: scope === 'All' ? null : scope,
  });
  const accountsQuery = useGetFinanceAccountsQuery();
  const accounts = useMemo(
    () => (accountsQuery.data ?? []).filter((account) => account.active),
    [accountsQuery.data],
  );
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити огляд.')
    : null;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Огляд"
        subtitle="Залишки рахунків рахуються від початку обліку; доходи й витрати — за обраний період"
        actions={null}
      />
      <Paper
        component="form"
        variant="outlined"
        aria-label="Період огляду"
        onSubmit={(event) => {
          event.preventDefault();
          if (!problem) setApplied(typed);
        }}
        sx={{ p: 2, mb: 3 }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{ gap: 2, alignItems: { md: 'center' } }}
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={scope}
            aria-label="Область обліку"
            onChange={(_, next: OverviewScope | null) => {
              if (!next) return;
              setScope(next);
              setDraft(null);
              setApplied(null);
            }}
          >
            {(Object.keys(scopeLabels) as OverviewScope[]).map((value) => (
              <ToggleButton key={value} value={value}>
                {scopeLabels[value]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField
            label="Від"
            type="date"
            size="small"
            value={typed.from}
            onChange={(event) => setDraft({ ...typed, from: event.target.value })}
            error={Boolean(problem)}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
          />
          <TextField
            label="До"
            type="date"
            size="small"
            value={typed.to}
            onChange={(event) => setDraft({ ...typed, to: event.target.value })}
            error={Boolean(problem)}
            helperText={problem}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
          />
          <Button type="submit" variant="contained" disabled={Boolean(problem)}>
            Показати
          </Button>
        </Stack>
      </Paper>
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void query.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {query.data && query.data.needsReviewCount > 0 && scope !== 'LegacyArchive' && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" component={RouterLink} to={financeReviewPath}>
              Перевірити
            </Button>
          }
        >
          Потребують перевірки: {query.data.needsReviewCount} операцій поточного обліку.
        </Alert>
      )}
      {query.data && (
        <FinanceOverviewSummary
          currencies={query.data.currencies}
          currentBooks={scope === 'Current'}
        />
      )}
      <FinanceBalancesTable accounts={accounts} cutoverDate={cutoverDate} />
    </Box>
  );
}

export default FinanceOverviewPage;
