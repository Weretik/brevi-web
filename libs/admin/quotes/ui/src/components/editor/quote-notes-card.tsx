import { quoteTextMaxLength } from '@admin/quotes/model';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Card, Stack, TextField, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  clientComment: string;
  managerNote: string;
  onChange: (patch: { clientComment?: string; managerNote?: string }) => void;
}

const Note = ({
  title,
  hint,
  icon,
  value,
  onChange,
}: {
  title: string;
  hint: string;
  icon?: ReactNode;
  value: string;
  onChange: (value: string) => void;
}) => (
  <Card variant="outlined" sx={{ p: 2 }}>
    <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
      {icon}
      <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Stack>
    <Typography variant="caption" color="text.secondary">
      {hint}
    </Typography>
    <TextField
      fullWidth
      multiline
      minRows={3}
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ htmlInput: { maxLength: quoteTextMaxLength, 'aria-label': title } }}
      sx={{ mt: 1 }}
    />
  </Card>
);

/** The comment the client reads and the note only staff see; plain cards, no status colours. */
export function QuoteNotesCard({ clientComment, managerNote, onChange }: Props) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Note
        title="Коментар для клієнта"
        hint="Буде в КП під позиціями."
        value={clientComment}
        onChange={(value) => onChange({ clientComment: value })}
      />
      <Note
        title="Нотатка для себе"
        hint="Клієнт її не побачить."
        icon={<LockOutlinedIcon sx={{ fontSize: 16 }} aria-hidden />}
        value={managerNote}
        onChange={(value) => onChange({ managerNote: value })}
      />
    </Box>
  );
}
