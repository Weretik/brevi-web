import { moveQuoteItem, moveQuoteVariant } from '@admin/clients/model';
import { QuoteItemFields } from '@admin/clients/ui';
import { Button, Paper, Stack, Typography } from '@mui/material';

import { QuoteVariantEditor } from './quote-variant-editor';

import type { QuoteDraft, QuoteItemDraft, QuoteVariantDraft } from '@admin/clients/model';

export function QuoteItemsEditor({
  draft,
  disabled,
  now,
  onChange,
  onPreview,
}: {
  draft: QuoteDraft;
  disabled: boolean;
  now: number;
  onChange: (draft: QuoteDraft) => void;
  onPreview: (variant: QuoteVariantDraft) => void;
}) {
  const update = (updated: QuoteItemDraft) =>
    onChange({
      ...draft,
      items: draft.items.map((item) => (item.key === updated.key ? updated : item)),
    });
  return (
    <Stack spacing={3}>
      {!draft.items.length && (
        <Typography>Позицій ще немає. Чернетку можна зберегти без позицій.</Typography>
      )}
      {draft.items.map((item, index) => (
        <Paper
          component="section"
          variant="outlined"
          key={item.key}
          sx={{ p: { xs: 1.5, sm: 2 } }}
          aria-label={`Позиція ${index + 1}`}
        >
          <Stack spacing={2}>
            <Typography component="h2" variant="h6">
              Позиція {index + 1}
            </Typography>
            <QuoteItemFields item={item} disabled={disabled} onChange={update} />
            {item.variants.map((variant) => (
              <QuoteVariantEditor
                key={variant.key}
                variant={variant}
                disabled={disabled}
                now={now}
                onChange={(updated) =>
                  update({
                    ...item,
                    variants: item.variants.map((current) =>
                      current.key === variant.key ? updated : current,
                    ),
                  })
                }
                onPreview={() => onPreview(variant)}
                onMove={(step) => onChange(moveQuoteVariant(draft, item.key, variant.key, step))}
                onRemove={() =>
                  update({
                    ...item,
                    variants: item.variants.filter((current) => current.key !== variant.key),
                  })
                }
              />
            ))}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                disabled={disabled || item.variants.length >= 30}
                onClick={() =>
                  update({
                    ...item,
                    variants: [
                      ...item.variants,
                      {
                        key: crypto.randomUUID(),
                        title: 'Новий варіант',
                        visible: true,
                        selection: { kind: 'sewing', productId: 0, articleId: 0 },
                        tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
                        basis: null,
                      },
                    ],
                  })
                }
              >
                Додати варіант
              </Button>
              <Button
                disabled={disabled || index === 0}
                onClick={() => onChange(moveQuoteItem(draft, item.key, -1))}
              >
                Позиція вище
              </Button>
              <Button
                disabled={disabled || index === draft.items.length - 1}
                onClick={() => onChange(moveQuoteItem(draft, item.key, 1))}
              >
                Позиція нижче
              </Button>
              <Button
                disabled={disabled}
                color="error"
                onClick={() =>
                  onChange({
                    ...draft,
                    items: draft.items.filter((current) => current.key !== item.key),
                  })
                }
              >
                Видалити позицію
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
      <Button
        disabled={disabled || draft.items.length >= 100}
        onClick={() =>
          onChange({
            ...draft,
            items: [
              ...draft.items,
              {
                key: crypto.randomUUID(),
                title: 'Нова позиція',
                publicDescription: '',
                publicComment: '',
                internalNote: '',
                included: true,
                variants: [],
              },
            ],
          })
        }
      >
        Додати позицію
      </Button>
    </Stack>
  );
}
