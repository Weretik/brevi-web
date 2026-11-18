import { shiftDay } from '@admin/production/model';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Button, IconButton, Stack, TextField, Typography } from '@mui/material';

import type { useTimesheetDay } from '../../hooks/timesheet/use-timesheet-day';

interface Props {
  sheet: ReturnType<typeof useTimesheetDay>;
  canEdit: boolean;
}

/** The day picker with arrows and «Сьогодні», and «8 год усім» / «0 год усім» for the unmarked. */
export function TimesheetDayToolbar({ sheet, canEdit }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 1.5, mb: 2, alignItems: { md: 'center' } }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
        <IconButton
          aria-label="Попередній день"
          onClick={() => sheet.choose(shiftDay(sheet.date, -1))}
        >
          <ChevronLeftOutlinedIcon />
        </IconButton>
        <TextField
          size="small"
          type="date"
          label="Дата"
          value={sheet.date}
          onChange={(event) => sheet.choose(event.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: sheet.today } }}
        />
        <IconButton
          aria-label="Наступний день"
          disabled={sheet.date >= sheet.today}
          onClick={() => sheet.choose(shiftDay(sheet.date, 1))}
        >
          <ChevronRightOutlinedIcon />
        </IconButton>
        {sheet.date !== sheet.today && (
          <Button size="small" onClick={() => sheet.choose(sheet.today)}>
            Сьогодні
          </Button>
        )}
      </Stack>
      {canEdit && (
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Невідміченим:
          </Typography>
          <Button
            size="small"
            variant="outlined"
            disabled={sheet.saving}
            onClick={() => sheet.fill('8')}
          >
            8 год усім
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={sheet.saving}
            onClick={() => sheet.fill('0')}
          >
            0 год усім
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
