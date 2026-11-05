import { formatLedgerDate } from '@admin/accounting/model';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { Button, Stack, Typography } from '@mui/material';

import type { FinanceJournalFilter } from '@admin/accounting/model';

interface Props {
  applied: FinanceJournalFilter;
  activeCount: number;
  open: boolean;
  total: number;
  onToggle: () => void;
}

/** «Фільтри» button with the applied period and the number of rows found. */
export function FinanceJournalToolbar({ applied, activeCount, open, total, onToggle }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        mb: 2,
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Button
        variant={open ? 'contained' : 'outlined'}
        startIcon={<FilterListOutlinedIcon />}
        aria-expanded={open}
        onClick={onToggle}
      >
        {activeCount ? `Фільтри · ${activeCount}` : 'Фільтри'}
      </Button>
      <Typography variant="body2" color="text.secondary">
        {applied.from && applied.to
          ? `${formatLedgerDate(applied.from)} – ${formatLedgerDate(applied.to)}`
          : 'Увесь період'}
        {' · '}
        Знайдено: {total}
      </Typography>
    </Stack>
  );
}
