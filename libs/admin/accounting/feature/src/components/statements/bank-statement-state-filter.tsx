import { bankLineStateLabels, bankLineStates } from '@admin/accounting/model';
import { FinanceSegmentedButtons } from '@admin/accounting/ui';
import { Box } from '@mui/material';

import type { useBankStatement } from '../../hooks/statements/use-bank-statement';
import type { BankLineState } from '@admin/accounting/model';

type Filter = BankLineState | 'All';

/** Line states of the statement with their counts; a state without lines is hidden unless chosen. */
export function BankStatementStateFilter({ view }: { view: ReturnType<typeof useBankStatement> }) {
  const details = view.details;
  const all = details?.states.reduce((sum, row) => sum + row.count, 0) ?? 0;
  const countOf = (state: BankLineState) =>
    details?.states.find((row) => row.state === state)?.count ?? 0;
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <FinanceSegmentedButtons<Filter>
        label="Стан рядків"
        value={view.state ?? 'All'}
        onChange={(next) => view.setState(next === 'All' ? null : next)}
        segments={[
          { value: 'All', label: `Усі ${all}` },
          ...bankLineStates
            .filter((state) => countOf(state) > 0 || view.state === state)
            .map((state) => ({
              value: state,
              label: `${bankLineStateLabels[state]} ${countOf(state)}`,
            })),
        ]}
      />
    </Box>
  );
}
