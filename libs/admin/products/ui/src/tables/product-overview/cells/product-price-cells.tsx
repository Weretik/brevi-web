import { productProblemReasons } from '@admin/products/model';
import { Box, Tooltip, Typography } from '@mui/material';

import { sewingPriceFormat } from '../../../components/sewing-pricing/sewing-price-format';

import type { ProductOverview, ProductVariant, SewingPriceTiers } from '@admin/products/model';

export type ProductPriceTier = keyof SewingPriceTiers;

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function Price({ value, prefix }: { value: number; prefix?: string }) {
  return (
    <Box component="span" sx={{ ...mono, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {prefix && (
        <Typography component="span" variant="body2" color="text.secondary">
          {prefix}
        </Typography>
      )}
      {sewingPriceFormat(value)}
    </Box>
  );
}

/** The reason instead of a price, in the 1–9 pcs column only (problems-only rule). */
function Problem({ reasons }: { reasons: string[] }) {
  const label = reasons[0] ?? 'Немає ціни';
  return (
    <Tooltip title={reasons.join(', ')}>
      <Typography
        component="span"
        variant="body2"
        color="warning.main"
        noWrap
        sx={{ maxWidth: '100%' }}
      >
        {label}
      </Typography>
    </Tooltip>
  );
}

/**
 * Model row: the published price («від …» across fabric variants). Without a price the 1–9 column
 * shows why (CAT-013); a row that has a price shows no status.
 */
export function ProductModelPriceCell({
  product,
  tier,
}: {
  product: ProductOverview;
  tier: ProductPriceTier;
}) {
  if (product.prices) {
    const prefix =
      product.type === 'Sewing' && product.variants.filter((v) => v.active).length > 1
        ? 'від'
        : undefined;
    return <Price value={product.prices[tier]} prefix={prefix} />;
  }
  return tier === 'retail' ? (
    <Problem reasons={productProblemReasons(product.type, product.problems)} />
  ) : (
    '—'
  );
}

/** Fabric variant row: its published price, else why it has none. */
export function ProductVariantPriceCell({
  variant,
  tier,
}: {
  variant: ProductVariant;
  tier: ProductPriceTier;
}) {
  if (variant.prices) return <Price value={variant.prices[tier]} />;
  if (!variant.active) return tier === 'retail' ? 'Вимкнена' : '—';
  return tier === 'retail' ? (
    <Problem reasons={productProblemReasons('Sewing', variant.problems)} />
  ) : (
    '—'
  );
}
