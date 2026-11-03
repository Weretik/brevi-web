import { Box, Typography } from '@mui/material';

import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type {
  ProductArticlePrices,
  ProductOverviewPrices,
  SewingPriceTiers,
} from '@admin/products/model';

export type ProductPriceTier = keyof SewingPriceTiers;

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function Price({ value, prefix, muted }: { value: number; prefix?: string; muted?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        ...mono,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color: muted ? 'text.secondary' : 'text.primary',
      }}
    >
      {prefix && (
        <Typography component="span" variant="body2" color="text.secondary">
          {prefix}
        </Typography>
      )}
      {sewingPriceFormat(value)}
    </Box>
  );
}

const blockedLabel = (
  <Typography component="span" variant="body2" color="warning.main">
    Не розраховано
  </Typography>
);

/** Lowest live price of each tier among active, calculable Articles. */
function lowestLive(prices: ProductOverviewPrices): SewingPriceTiers | null {
  const live = prices.articles.filter((a) => a.active && a.live).map((a) => a.live!);
  return live.length
    ? {
        retail: Math.min(...live.map((x) => x.retail)),
        wholesale: Math.min(...live.map((x) => x.wholesale)),
        largeWholesale: Math.min(...live.map((x) => x.largeWholesale)),
      }
    : null;
}

/**
 * Model row: «від …» across Articles. Prices are published automatically (CAT-012), so the published price is the
 * one shown; the live price, muted, only covers the moment before its first publication.
 */
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
  const prefix = showsRange ? 'від' : undefined;
  if (prices.from) return <Price value={prices.from[tier]} prefix={prefix} />;
  const live = lowestLive(prices);
  if (live) return <Price value={live[tier]} prefix={prefix} muted />;
  return tier === 'retail' ? blockedLabel : '—';
}

/** Article row: the published price; the live one, muted, before its first publication. */
export function ProductArticlePriceCell({
  article,
  tier,
}: {
  article: ProductArticlePrices;
  tier: ProductPriceTier;
}) {
  if (article.published) return <Price value={article.published[tier]} />;
  if (article.live) return <Price value={article.live[tier]} muted />;
  return tier === 'retail' ? blockedLabel : '—';
}
