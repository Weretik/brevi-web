import { quoteEventLabels } from '@admin/quotes/model';
import { UserAvatar } from '@admin/shared/ui';
import { Stack, Typography } from '@mui/material';

import type { QuoteEvent } from '@admin/quotes/model';

const when = (at: string) =>
  new Date(at).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** «Історія змін»: newest first, who did what and when. */
export function QuoteHistoryList({ events }: { events: readonly QuoteEvent[] }) {
  if (events.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Історія порожня.
      </Typography>
    );
  return (
    <Stack component="ol" sx={{ listStyle: 'none', m: 0, p: 0, gap: 1.5 }}>
      {events.map((event) => (
        <Stack
          key={event.id}
          component="li"
          direction="row"
          sx={{ gap: 1.5, alignItems: 'flex-start' }}
        >
          <UserAvatar name={event.actor.name} size={28} />
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {quoteEventLabels[event.kind]}
            </Typography>
            {event.details && (
              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                {event.details}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {event.actor.name} · {when(event.at)}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
