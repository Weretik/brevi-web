import { nonWorkingDayNoteMaxLength } from '@admin/reminders/model';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { NonWorkingDay } from '@admin/reminders/model';

interface Props {
  saving: boolean;
  onAdd: (day: NonWorkingDay) => Promise<boolean>;
}

/** Adds one extra day off; clears itself after a successful save. */
export function NonWorkingDayForm({ saving, onAdd }: Props) {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  return (
    <Box
      component="form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!date) return;
        if (await onAdd({ date, note: note.trim() || null })) {
          setDate('');
          setNote('');
        }
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          type="date"
          label="Дата"
          required
          value={date}
          disabled={saving}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => setDate(event.target.value)}
        />
        <TextField
          label="Примітка"
          value={note}
          disabled={saving}
          sx={{ flex: 1 }}
          slotProps={{ htmlInput: { maxLength: nonWorkingDayNoteMaxLength } }}
          onChange={(event) => setNote(event.target.value)}
        />
        <Button type="submit" variant="contained" disabled={saving || !date}>
          Додати
        </Button>
      </Stack>
    </Box>
  );
}
