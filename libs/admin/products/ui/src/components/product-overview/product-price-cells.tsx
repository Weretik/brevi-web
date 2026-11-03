import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Tooltip, Typography } from '@mui/material';

import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type {
  ProductArticlePrices,
  ProductOverviewPrices,
  SewingPriceTiers,
} from '@admin/products/model';

export type ProductPriceTier = keyof SewingPriceTiers;

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function Price({
  value,
  prefix,
  warning,
  muted,
  hint,
}: {
  value: number;
  prefix?: string;
  warning?: boolean;
  muted?: boolean;
  hint?: string;
}) {
  const text = (
    <Box
      component="span"
      sx={{
        ...mono,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color: warning ? 'warning.main' : muted ? 'text.secondary' : 'text.primary',
      }}
    >
      {prefix && (
        <Typography component="span" variant="body2" color="text.secondary">
          {prefix}
        </Typography>
      )}
      {sewingPriceFormat(value)}
      {warning && <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} aria-hidden />}
    </Box>
  );
  return hint ? <Tooltip title={hint}>{text}</Tooltip> : text;
}

const blockedLabel = (
  <Typography component="span" variant="body2" color="warning.main">
    Не розраховано
  </Typography>
);

/** Model row: «від …» across Articles, a warning when prices are stale or not yet published. */
export function ProductModelPriceCell({
  prices,
  tier,
  showsRange,
}: {
  prices: ProductOverviewPrices | null;
  tier: ProductPriceTier;
  /** True for sewing models with more than one Article. */
  showsRange: boolean;
}) {
  if (!prices) return '—';
  if (!prices.from) {
    if (tier !== 'retail') return '—';
    return prices.status === 'Unpublished' ? (
      <Typography component="span" variant="body2" color="warning.main">
        Не опубліковано
      </Typography>
    ) : (
      blockedLabel
    );
  }
  const stale = prices.status === 'Stale';
  return (
    <Price
      value={prices.from[tier]}
      prefix={showsRange ? 'від' : undefined}
      warning={stale || prices.status === 'Unpublished'}
      hint={
        stale
          ? 'Ціни застаріли: вхідні дані змінилися. Натисніть «Перерахувати».'
          : prices.status === 'Unpublished'
            ? 'Не всі артикули мають опубліковану ціну.'
            : undefined
      }
    />
  );
}

/** Article row: the published price; the live one when nothing is published yet. */
export function ProductArticlePriceCell({
  article,
  tier,
}: {
  article: ProductArticlePrices;
  tier: ProductPriceTier;
}) {
  if (article.published)
    return (
      <Price
        value={article.published[tier]}
        warning={article.isStale}
        hint={
          article.isStale && article.live
            ? `Після перерахунку: ${sewingPriceFormat(article.live[tier])}`
            : undefined
        }
      />
    );
  if (article.live)
    return <Price value={article.live[tier]} muted hint="Розраховано, ще не опубліковано" />;
  return tier === 'retail' ? blockedLabel : '—';
}
