import { formatHours, formatWorkMonth, shiftDay, workMonth } from '@admin/production/model';
import { TimesheetDayTable, TimesheetHistory, TimesheetMonthSummary } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { useTimesheetDay } from '../../hooks/timesheet/use-timesheet-day';

/** «Швейний цех › Робочий час»: hours of each worker per day and the month in totals. */
export function TimesheetPage() {
  const [message, setMessage] = useState<string | null>(null);
  const sheet = useTimesheetDay(setMessage);
  const data = sheet.day.data;
  const canEdit = data?.canEdit ?? false;
  const marked = sheet.rows.filter((row) => row.minutes !== null);
  const markedMinutes = marked.reduce((sum, row) => sum + (row.minutes ?? 0), 0);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Робочий час"
        subtitle={
          data
            ? `${marked.length} з ${sheet.rows.length} відмічено · ${formatHours(markedMinutes)} год`
            : 'Фактично відпрацьовані години. 0 — відсутність, порожньо — ще не відмічено.'
        }
        actions={null}
      />
      <ReferenceListAlerts
        error={
          sheet.day.error
            ? adminApiErrorMessage(sheet.day.error, 'Не вдалося завантажити робочий час.')
            : null
        }
        loading={sheet.day.isFetching}
        onRetry={() => void sheet.day.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
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
      {data?.isMonthClosed && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Місяць зарплати закрито: години за цей день змінювати не можна.
        </Alert>
      )}
      {sheet.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {sheet.error}
        </Alert>
      )}
      <TimesheetDayTable
        rows={sheet.rows}
        draft={sheet.draft}
        invalid={sheet.invalid}
        changed={sheet.changed}
        canEdit={canEdit}
        busy={sheet.saving}
        onChange={sheet.change}
      />
      {canEdit && (
        <Paper
          variant="outlined"
          sx={{
            mt: 1.5,
            p: 1.5,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color={sheet.invalid.size > 0 ? 'error' : 'text.secondary'}>
            {sheet.invalid.size > 0
              ? 'Години від 0 до 24 з кроком 0,25. Для відсутності вкажіть 0.'
              : sheet.pending > 0
                ? `Незбережених змін: ${sheet.pending}`
                : 'Змін немає'}
          </Typography>
          <Button
            variant="contained"
            disabled={!sheet.canSave || sheet.saving}
            onClick={() => void sheet.save()}
          >
            {sheet.saving ? 'Зберігаємо…' : 'Зберегти день'}
          </Button>
        </Paper>
      )}
      <Box sx={{ mt: 2 }}>
        <TimesheetHistory changes={data?.changes ?? []} />
      </Box>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        {formatWorkMonth(workMonth(sheet.date))}
      </Typography>
      {data && (
        <TimesheetMonthSummary month={data.month} selected={sheet.date} onPick={sheet.choose} />
      )}
    </Box>
  );
}

export default TimesheetPage;
