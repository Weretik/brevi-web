import { formatQuotePrice } from '@admin/quotes/model';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { QuoteCatalogProduct, QuoteCatalogVariant } from '@admin/quotes/model';

interface Props {
  product: QuoteCatalogProduct;
  /** Already on the pages: it cannot be chosen twice. */
  used: boolean;
  onChoose: (product: QuoteCatalogProduct, variant: QuoteCatalogVariant) => void;
}

/** A model of «Обрати модель» with its fabrics, each with the price from 41 pieces and «Обрати». */
export function QuoteIntroModelOption({ product, used, onChoose }: Props) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5 }}>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
        {product.photoUrl ? (
          <Box
            component="img"
            src={product.photoUrl}
            alt=""
            sx={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 1 }}
          />
        ) : (
          <Box sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: 'action.hover' }} />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Typography
            variant="caption"
            color={used || product.problem ? 'error.main' : 'text.secondary'}
          >
            {used ? 'Вже є в добірці' : (product.problem ?? product.code ?? '')}
          </Typography>
        </Box>
      </Stack>
      <Stack sx={{ pl: { xs: 0, sm: 7.5 }, mt: 0.5, gap: 0.5 }}>
        {product.variants.map((variant) => (
          <Stack key={variant.articleId} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2">{variant.title}</Typography>
              {variant.problem && (
                <Typography variant="caption" color="error.main">
                  {variant.problem}
                </Typography>
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' }}
            >
              {formatQuotePrice(variant.prices?.large)}
            </Typography>
            <Button
              size="small"
              disabled={used || Boolean(product.problem) || Boolean(variant.problem)}
              onClick={() => onChoose(product, variant)}
              aria-label={`Обрати: ${product.name}, ${variant.title}`}
            >
              Обрати
            </Button>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
