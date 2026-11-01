import { formatReminderDate } from '@admin/reminders/model';
import { Box, Stack, Typography } from '@mui/material';

import type { DueDatePreview } from '@admin/reminders/model';

interface Props {
  previews: readonly DueDatePreview[];
  loading?: boolean;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** Next deadlines of a task with the day reminders start. */
export function DueDatePreviewList({ previews, loading }: Props) {
  if (loading) return <Typography variant="body2">Рахуємо терміни…</Typography>;
  if (!previews.length)
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Немає найближчих термінів.
      </Typography>
    );
  return (
    <Stack component="ul" spacing={0.5} sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {previews.map((preview) => (
        <Box
          component="li"
          key={preview.period}
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
        >
          <Typography variant="body2">{preview.period}</Typography>
          <Typography variant="body2" sx={mono}>
            до {formatReminderDate(preview.dueDate)} · з {formatReminderDate(preview.remindFrom)}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
