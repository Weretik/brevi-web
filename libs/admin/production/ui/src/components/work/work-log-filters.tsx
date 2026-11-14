import { formatWorkMonth } from '@admin/production/model';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Autocomplete, IconButton, Stack, TextField, Typography } from '@mui/material';

import type { WorkEmployeeChoice } from '@admin/production/model';

interface Props {
  /** yyyy-mm of the shown month. */
  month: string;
  canGoForward: boolean;
  onShiftMonth: (step: number) => void;
  employees: readonly WorkEmployeeChoice[];
  employeeId: number | null;
  onEmployeeChange: (id: number | null) => void;
  orders: readonly { id: number; label: string }[];
  orderId: number | null;
  onOrderChange: (id: number | null) => void;
}

/** «Журнал робіт»: the month switch and the employee and order filters. */
export function WorkLogFilters({
  month,
  canGoForward,
  onShiftMonth,
  employees,
  employeeId,
  onEmployeeChange,
  orders,
  orderId,
  onOrderChange,
}: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 1.5, mb: 2, alignItems: { md: 'center' } }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
        <IconButton aria-label="Попередній місяць" onClick={() => onShiftMonth(-1)}>
          <ChevronLeftOutlinedIcon />
        </IconButton>
        <Typography sx={{ minWidth: 140, textAlign: 'center', fontWeight: 600 }}>
          {formatWorkMonth(month)}
        </Typography>
        <IconButton
          aria-label="Наступний місяць"
          disabled={!canGoForward}
          onClick={() => onShiftMonth(1)}
        >
          <ChevronRightOutlinedIcon />
        </IconButton>
      </Stack>
      <Autocomplete
        size="small"
        sx={{ minWidth: 240 }}
        options={employees}
        value={employees.find((x) => x.id === employeeId) ?? null}
        getOptionLabel={(option) => option.fullName}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, value) => onEmployeeChange(value?.id ?? null)}
        renderInput={(params) => <TextField {...params} label="Працівник" />}
      />
      <Autocomplete
        size="small"
        sx={{ minWidth: 280 }}
        options={orders}
        value={orders.find((x) => x.id === orderId) ?? null}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, value) => onOrderChange(value?.id ?? null)}
        renderInput={(params) => <TextField {...params} label="Завдання" />}
      />
    </Stack>
  );
}
