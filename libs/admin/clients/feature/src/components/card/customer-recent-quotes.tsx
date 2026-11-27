import { QuoteStatusPill } from '@admin/quotes/ui';
import { CardSection } from '@admin/shared/ui';
import {
  Alert,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import type { QuoteSummary } from '@admin/quotes/model';

interface Props {
  quotes: readonly QuoteSummary[];
  loading: boolean;
  failed: boolean;
  onOpen: (quote: QuoteSummary) => void;
  onOpenAll: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «Останні КП» of a client card's «Огляд»: five rows and «Усі →». */
export function CustomerRecentQuotes({ quotes, loading, failed, onOpen, onOpenAll }: Props) {
  return (
    <CardSection title="Останні КП" onOpenAll={onOpenAll}>
      {failed && <Alert severity="error">Не вдалося завантажити КП клієнта.</Alert>}
      {loading && !quotes.length && (
        <Stack spacing={1} aria-label="Завантаження КП">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} height={40} />
          ))}
        </Stack>
      )}
      {!loading && !failed && !quotes.length && (
        <Typography variant="body2" color="text.secondary">
          За цей період КП немає.
        </Typography>
      )}
      <List disablePadding>
        {quotes.map((quote) => (
          <ListItemButton
            key={quote.id}
            onClick={() => onOpen(quote)}
            sx={{ px: 1, borderRadius: 1, gap: 1.5 }}
          >
            <Typography variant="body2" sx={{ ...mono, minWidth: 72, color: 'primary.dark' }}>
              {quote.number}
            </Typography>
            <ListItemText
              primary={quote.internalName}
              secondary={`${quote.responsible.name} · ${new Date(quote.updatedAt).toLocaleDateString('uk-UA')}`}
              slotProps={{ primary: { noWrap: true, variant: 'body2' } }}
              sx={{ minWidth: 0 }}
            />
            <QuoteStatusPill status={quote.status} lastSentAt={quote.lastSentAt} />
          </ListItemButton>
        ))}
      </List>
    </CardSection>
  );
}
