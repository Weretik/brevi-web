import { QuoteMoreMenu, QuoteStatusPill } from '@admin/quotes/ui';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { Quote } from '@admin/quotes/model';

interface Props {
  quote: Quote | null;
  /** The client or request typed in «Кому»; the page title. */
  name: string;
  dirty: boolean;
  archived: boolean;
  busy: boolean;
  canAssign: boolean;
  onHistory: () => void;
  onCopy: () => void;
  onArchive: (archived: boolean) => void;
  onAssign: () => void;
  onReprice: () => void;
  onDelete: () => void;
}

/** The КП header: kind and status, the client as the title, number and owner; «Історія» and «Ще». */
export function QuoteEditorHeader({
  quote,
  name,
  dirty,
  archived,
  busy,
  canAssign,
  onHistory,
  onCopy,
  onArchive,
  onAssign,
  onReprice,
  onDelete,
}: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-end' }, gap: 2, mb: 2 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="overline" color="text.secondary">
            КП під запит
          </Typography>
          {quote && (
            <QuoteStatusPill
              status={quote.status}
              lastSentAt={quote.lastSentAt}
              archived={archived}
            />
          )}
        </Stack>
        <Typography variant="h1" sx={{ overflowWrap: 'anywhere' }}>
          {name.trim() || 'Нове КП'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {quote ? (
            <>
              <Box
                component="span"
                sx={{ fontFamily: 'var(--admin-font-mono)', color: 'text.primary' }}
              >
                КП {quote.number}
              </Box>
              {` · відповідальний(-а) ${quote.responsible.name}`}
            </>
          ) : (
            'Номер з’явиться після першого збереження'
          )}
        </Typography>
      </Box>
      {quote && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<HistoryOutlinedIcon />} onClick={onHistory}>
            Історія
          </Button>
          <QuoteMoreMenu
            archived={archived}
            dirty={dirty}
            busy={busy}
            onCopy={onCopy}
            onArchive={onArchive}
            onAssign={canAssign ? onAssign : undefined}
            onReprice={onReprice}
            onDelete={quote.status === 'Draft' ? onDelete : undefined}
          />
        </Stack>
      )}
    </Stack>
  );
}
