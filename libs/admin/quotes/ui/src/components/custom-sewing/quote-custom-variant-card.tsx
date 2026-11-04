import { formatQuotePrice, quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { Alert, Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';

import { QuoteCustomRows } from './quote-custom-rows';

import type { QuoteCustomChoice } from './quote-custom-rows';
import type { QuoteCustomSewingVariantPrice, QuoteCustomVariantDraft } from '@admin/quotes/model';

interface Props {
  index: number;
  variant: QuoteCustomVariantDraft;
  /** All active fabrics; the ones already in this variant are left out here. */
  choices: readonly QuoteCustomChoice[];
  loading: boolean;
  /** The preview price of this variant; null while it is being calculated or not filled in. */
  price: QuoteCustomSewingVariantPrice | null;
  canRemove: boolean;
  onRecommend: () => void;
  onRemove: () => void;
  onAddFabric: (choice: QuoteCustomChoice) => void;
  onMeters: (fabricKey: string, meters: string) => void;
  onRemoveFabric: (fabricKey: string) => void;
}

const minutesFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/**
 * One variant of a «Виріб з нуля»: its own fabrics (summed in the price), the «рекомендуємо» mark and the three
 * prices with the shared accessories and operations.
 */
export function QuoteCustomVariantCard({
  index,
  variant,
  choices,
  loading,
  price,
  canRemove,
  onRecommend,
  onRemove,
  onAddFabric,
  onMeters,
  onRemoveFabric,
}: Props) {
  const title = `Варіант ${index + 1}`;
  const used = new Set(variant.fabrics.map((x) => x.fabricId));
  return (
    <Paper
      component="section"
      aria-label={title}
      variant="outlined"
      sx={{
        p: 1.5,
        borderColor: variant.isRecommended ? 'primary.main' : undefined,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
          {title}
          {variant.isRecommended && (
            <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
              рекомендуємо
            </Typography>
          )}
        </Typography>
        <Tooltip title={variant.isRecommended ? 'Зняти «рекомендуємо»' : 'Рекомендуємо'}>
          <IconButton
            size="small"
            aria-label={`Рекомендуємо: ${title}`}
            aria-pressed={variant.isRecommended}
            onClick={onRecommend}
          >
            {variant.isRecommended ? (
              <StarOutlinedIcon fontSize="small" color="primary" />
            ) : (
              <StarBorderOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        {canRemove && (
          <Tooltip title="Прибрати варіант">
            <IconButton size="small" aria-label={`Прибрати: ${title}`} onClick={onRemove}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <QuoteCustomRows
        title={`Тканини: ${title}`}
        hideTitle
        rows={variant.fabrics.map((x) => ({
          key: x.key,
          name: x.name,
          quantity: x.meters,
          quantityLabel: 'Метрів',
        }))}
        choices={choices.filter((x) => !used.has(x.id))}
        addLabel={variant.fabrics.length === 0 ? 'Додати тканину' : 'Додати ще тканину'}
        loading={loading}
        onAdd={onAddFabric}
        onQuantity={onMeters}
        onRemove={onRemoveFabric}
      />
      {price && (
        <Box sx={{ mt: 1.5 }}>
          {price.prices ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
              {quoteTiers.map((tier) => (
                <Box key={tier}>
                  <Typography variant="caption" color="text.secondary">
                    {quoteTierLabels[tier]}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatQuotePrice(price.prices?.[tier] ?? null)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Alert severity="warning">
              {price.problems.join('; ') || 'Не вдалося порахувати ціну.'}
            </Alert>
          )}
          {price.minutes !== null && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Час {minutesFormat.format(price.minutes)} хв
              {price.laborCost !== null && ` · трудовитрати ${formatQuotePrice(price.laborCost)}`}
              {price.fullCost !== null && ` · собівартість ${formatQuotePrice(price.fullCost)}`}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}
