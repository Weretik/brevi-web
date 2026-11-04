import { quoteTextMaxLength } from '@admin/quotes/model';
import { Box, Card, TextField, Typography } from '@mui/material';

interface Props {
  clientComment: string;
  managerNote: string;
  onChange: (patch: { clientComment?: string; managerNote?: string }) => void;
}

/** The comment the client reads and the note only staff see. */
export function QuoteNotesCard({ clientComment, managerNote, onChange }: Props) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Card variant="outlined" sx={{ p: 2, bgcolor: 'success.light' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Коментар для клієнта
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Клієнт побачить у КП.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          size="small"
          value={clientComment}
          onChange={(event) => onChange({ clientComment: event.target.value })}
          slotProps={{
            htmlInput: { maxLength: quoteTextMaxLength, 'aria-label': 'Коментар для клієнта' },
          }}
          sx={{ mt: 1, bgcolor: 'background.paper' }}
        />
      </Card>
      <Card variant="outlined" sx={{ p: 2, bgcolor: 'warning.light' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Нотатки менеджера до КП
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Клієнт цього не побачить.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          size="small"
          value={managerNote}
          onChange={(event) => onChange({ managerNote: event.target.value })}
          slotProps={{
            htmlInput: { maxLength: quoteTextMaxLength, 'aria-label': 'Нотатки менеджера до КП' },
          }}
          sx={{ mt: 1, bgcolor: 'background.paper' }}
        />
      </Card>
    </Box>
  );
}
