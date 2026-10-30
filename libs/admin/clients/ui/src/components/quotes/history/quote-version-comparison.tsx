import { sameQuoteSelection } from '@admin/clients/model';
import { Paper, Stack, Typography } from '@mui/material';

import { QuotePriceComparison } from '../quote-price-comparison';

import type { QuoteVersion } from '@admin/clients/model';

export function QuoteVersionComparison({
  before,
  after,
}: {
  before: QuoteVersion;
  after: QuoteVersion;
}) {
  const ids = [
    ...new Set([
      ...before.draft.items.map((item) => item.key),
      ...after.draft.items.map((item) => item.key),
    ]),
  ];
  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h6">
        Порівняння версій {before.versionNumber} → {after.versionNumber}
      </Typography>
      {before.draft.recipientName !== after.draft.recipientName && (
        <Typography>
          Одержувач: {before.draft.recipientName} → {after.draft.recipientName}
        </Typography>
      )}
      {ids.map((id) => {
        const previous = before.draft.items.find((item) => item.key === id);
        const current = after.draft.items.find((item) => item.key === id);
        if (!previous || !current)
          return (
            <Typography key={id}>
              {previous ? 'Видалено позицію' : 'Додано позицію'}: {(current ?? previous)!.title}
            </Typography>
          );
        const variants = [
          ...new Set([
            ...previous.variants.map((row) => row.key),
            ...current.variants.map((row) => row.key),
          ]),
        ];
        return (
          <Paper variant="outlined" sx={{ p: 2 }} key={id}>
            <Stack spacing={1}>
              <Typography component="h3" variant="subtitle1">
                {current.title}
              </Typography>
              {(
                [
                  ['title', 'Назва'],
                  ['publicDescription', 'Опис'],
                  ['publicComment', 'Коментар'],
                  ['internalNote', 'Внутрішня нотатка'],
                ] as const
              )
                .filter(([field]) => previous[field] !== current[field])
                .map(([field, label]) => (
                  <Typography key={field} sx={{ whiteSpace: 'pre-wrap' }}>
                    {label}: {previous[field] || '—'} → {current[field] || '—'}
                  </Typography>
                ))}
              {previous.included !== current.included && (
                <Typography>
                  Включення позиції: {previous.included ? 'так' : 'ні'} →{' '}
                  {current.included ? 'так' : 'ні'}
                </Typography>
              )}
              {before.draft.items.indexOf(previous) !== after.draft.items.indexOf(current) && (
                <Typography>Порядок позиції змінено.</Typography>
              )}
              {variants.map((key) => {
                const old = previous.variants.find((row) => row.key === key);
                const next = current.variants.find((row) => row.key === key);
                if (!old || !next)
                  return (
                    <Typography key={key}>
                      {old ? 'Видалено варіант' : 'Додано варіант'}: {(next ?? old)!.title}
                    </Typography>
                  );
                return (
                  <Stack key={key} spacing={1}>
                    {old.title !== next.title && (
                      <Typography>
                        Назва варіанта: {old.title} → {next.title}
                      </Typography>
                    )}
                    {previous.variants.indexOf(old) !== current.variants.indexOf(next) && (
                      <Typography>Порядок варіанта змінено.</Typography>
                    )}
                    {old.visible !== next.visible && (
                      <Typography>
                        Видимість варіанта змінено: {next.visible ? 'видимий' : 'прихований'}.
                      </Typography>
                    )}
                    {(['retail', 'wholesale', 'largeWholesale'] as const).some(
                      (tier) => old.tierVisibility[tier] !== next.tierVisibility[tier],
                    ) && <Typography>Видимість цін змінено.</Typography>}
                    {!sameQuoteSelection(old.selection, next.selection) && (
                      <Typography>Вибір товару або умови ціни змінено.</Typography>
                    )}
                    {old.basis && next.basis && (
                      <QuotePriceComparison
                        context="history"
                        title={next.title}
                        previous={old.basis.value}
                        next={next.basis.value}
                      />
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
