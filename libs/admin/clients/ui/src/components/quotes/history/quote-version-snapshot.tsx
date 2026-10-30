import { Paper, Stack, Typography } from '@mui/material';

import { QuotePrices } from '../quote-prices';
import { quoteHistoryAction, quoteHistoryDate } from './quote-history-format';

import type { QuoteVersion } from '@admin/clients/model';

export function QuoteVersionSnapshot({ version }: { version: QuoteVersion }) {
  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h6">
        Збережена версія {version.versionNumber}
      </Typography>
      <Typography>
        {version.draft.recipientName} · {quoteHistoryAction(version.action)} · Автор #
        {version.actorId} · {quoteHistoryDate(version.createdAt)}
      </Typography>
      {!version.draft.items.length && <Typography>Версія не містить позицій.</Typography>}
      {version.draft.items.map((item) => (
        <Paper component="section" variant="outlined" key={item.key} sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography component="h3" variant="subtitle1">
              {item.title} · {item.included ? 'Включено' : 'Виключено'}
            </Typography>
            {item.publicDescription && (
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{item.publicDescription}</Typography>
            )}
            {item.publicComment && (
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                Коментар: {item.publicComment}
              </Typography>
            )}
            {item.internalNote && (
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                Внутрішня нотатка: {item.internalNote}
              </Typography>
            )}
            {item.variants.map((variant) => (
              <Stack key={variant.key} spacing={1} sx={{ py: 1 }}>
                <Typography component="h4" variant="subtitle2">
                  {variant.title} · {variant.visible ? 'Видимий варіант' : 'Прихований варіант'}
                </Typography>
                <QuotePrices variant={variant} disabled now={0} onChange={() => undefined} />
              </Stack>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
