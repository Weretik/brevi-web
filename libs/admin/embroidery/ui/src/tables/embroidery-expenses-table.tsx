import {
  embroideryBasisLabels,
  embroideryExpenseModeLabels,
  formatEmbroideryMoney,
} from '@admin/embroidery/model';
import { Typography } from '@mui/material';

import { EmbroiderySettingsTable } from './embroidery-settings-table';

import type { EmbroiderySettingsColumn } from './embroidery-settings-table';
import type { EmbroideryExpenseDraft } from '@admin/embroidery/model';

interface Props {
  expenses: readonly EmbroideryExpenseDraft[];
  error?: string;
  rowsWithErrors: ReadonlySet<string>;
  onOpen: (expense: EmbroideryExpenseDraft) => void;
  onAdd: () => void;
}

const columns: EmbroiderySettingsColumn<EmbroideryExpenseDraft>[] = [
  { title: 'Стаття', cell: (expense) => expense.name || '—' },
  { title: 'Рахується', cell: (expense) => embroideryBasisLabels[expense.basis] },
  {
    title: 'Ставка, грн',
    numeric: true,
    cell: (expense) =>
      expense.rate === null ? (
        <Typography component="span" variant="body2" color="warning.main">
          не задано
        </Typography>
      ) : (
        formatEmbroideryMoney(expense.rate)
      ),
  },
  { title: 'Де діє', cell: (expense) => embroideryExpenseModeLabels[expense.mode] },
  {
    title: 'Відмічено',
    cell: (expense) =>
      expense.enabled ? (
        'так'
      ) : (
        <Typography component="span" variant="body2" color="text.secondary">
          ні
        </Typography>
      ),
  },
];

/** «Додаткові витрати»: name, base, rate, where it applies and whether it is ticked at the start. */
export function EmbroideryExpensesTable(props: Props) {
  return (
    <EmbroiderySettingsTable
      id="embroidery-settings-expenses"
      title="Додаткові витрати"
      addLabel="Додати статтю"
      rows={props.expenses}
      columns={columns}
      {...props}
    />
  );
}
