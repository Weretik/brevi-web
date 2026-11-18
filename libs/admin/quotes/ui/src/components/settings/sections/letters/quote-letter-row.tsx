import { Box, Button, Chip, Stack, Typography } from '@mui/material';

import { quoteSettingsProblemsLabel } from '../../form/quote-settings-layout';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  subject: string;
  problems: number;
  tag: string | null;
  open: boolean;
  onToggle: () => void;
  /** The letter fields, shown while the row is open. */
  children: ReactNode;
}

/** A letter of «Лист клієнту»: name, subject, problems and «Змінити» that opens its fields in place. */
export function QuoteLetterRow({
  title,
  subject,
  problems,
  tag,
  open: isOpen,
  onToggle,
  children,
}: Props) {
  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        '&:first-of-type': { borderTop: 0 },
        ...(isOpen && { bgcolor: 'action.hover' }),
      }}
    >
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', px: 2, py: 1.25 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 700 }}>{title || 'Без назви'}</Typography>
            {tag && <Chip size="small" label={tag} />}
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>
            {subject || 'Тема не вказана'}
          </Typography>
        </Box>
        {problems > 0 && (
          <Typography variant="body2" color="error" sx={{ fontWeight: 600, flexShrink: 0 }}>
            {quoteSettingsProblemsLabel(problems)}
          </Typography>
        )}
        <Button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? 'Згорнути' : 'Змінити'}: ${title || 'шаблон без назви'}`}
          sx={{ flexShrink: 0 }}
        >
          {isOpen ? 'Згорнути' : 'Змінити'}
        </Button>
      </Stack>
      {isOpen && children}
    </Box>
  );
}
