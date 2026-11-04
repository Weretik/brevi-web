import { formatQuotePrice } from '@admin/quotes/model';
import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import type { QuoteCatalogProduct } from '@admin/quotes/model';

interface Props {
  product: QuoteCatalogProduct;
  /** Article ids already chosen (sewing) or the product id (PPE). */
  chosen: ReadonlySet<number>;
  /** Fabric variants the item already has: shown ticked and not added twice. */
  alreadyAdded: ReadonlySet<number>;
  onToggle: (id: number) => void;
}

const Price = ({ value }: { value: number | null | undefined }) => (
  <Typography
    component="span"
    sx={{
      fontFamily: 'var(--admin-font-mono)',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    }}
  >
    {value === null || value === undefined ? '' : `від ${formatQuotePrice(value)}`}
  </Typography>
);

/** A product in «Додати товар»: a PPE to tick, or a model with fabric variants to tick. */
export function QuoteCatalogProductRow({ product, chosen, alreadyAdded, onToggle }: Props) {
  const ppe = product.kind === 'Ppe';
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5 }}>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
        {ppe && (
          <Checkbox
            checked={chosen.has(product.productId)}
            disabled={Boolean(product.problem)}
            onChange={() => onToggle(product.productId)}
            slotProps={{ input: { 'aria-label': `Додати: ${product.name}` } }}
          />
        )}
        {product.photoUrl ? (
          <Box
            component="img"
            src={product.photoUrl}
            alt=""
            sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: 'action.hover', flexShrink: 0 }}
          />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {[product.code, product.season].filter(Boolean).join(' · ')}
          </Typography>
          {product.problem && (
            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
              {product.problem}
            </Typography>
          )}
        </Box>
        {ppe && <Price value={product.prices?.large} />}
      </Stack>
      {!ppe && product.variants.length > 0 && (
        <Stack sx={{ pl: { xs: 0, sm: 7.5 }, mt: 0.5 }}>
          {product.variants.map((variant) => {
            const added = alreadyAdded.has(variant.articleId);
            return (
              <Stack key={variant.articleId} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <FormControlLabel
                  sx={{ flex: 1, minWidth: 0, mr: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      checked={added || chosen.has(variant.articleId)}
                      disabled={added || Boolean(variant.problem)}
                      onChange={() => onToggle(variant.articleId)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">{variant.title}</Typography>
                      {variant.problem ? (
                        <Typography variant="caption" color="error.main">
                          {variant.problem}
                        </Typography>
                      ) : (
                        variant.fabricInfo && (
                          <Typography variant="caption" color="text.secondary">
                            {variant.fabricInfo}
                          </Typography>
                        )
                      )}
                    </Box>
                  }
                />
                <Price value={variant.prices?.large} />
              </Stack>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
