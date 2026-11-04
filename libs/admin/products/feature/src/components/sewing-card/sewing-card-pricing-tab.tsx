import { sewingVariantLabel } from '@admin/products/model';
import { ReferenceFilterChip } from '@admin/references/ui';
import { Stack, Typography } from '@mui/material';

import { SewingPricingFeature } from '../sewing-pricing/sewing-pricing-feature';

import type { SewingVariantRow } from '@admin/products/model';

interface Props {
  productId: number;
  variants: SewingVariantRow[];
  articleId: number | null;
  onSelect: (articleId: number) => void;
}

/** «Розрахунок»: the price of one fabric and its cost breakdown; prices are published automatically. */
export function SewingCardPricingTab(props: Props) {
  if (!props.variants.length)
    return (
      <Typography sx={{ color: 'text.secondary' }}>
        Немає тканини. Додайте її на вкладці «Тканини».
      </Typography>
    );
  const selected =
    props.variants.find((variant) => variant.id === props.articleId) ?? props.variants[0];
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        role="group"
        aria-label="Тканина для розрахунку"
        direction="row"
        sx={{ gap: 1, flexWrap: 'wrap' }}
      >
        {props.variants.map((variant) => (
          <ReferenceFilterChip
            key={variant.id}
            label={sewingVariantLabel(variant)}
            selected={variant.id === selected.id}
            onClick={() => props.onSelect(variant.id)}
          />
        ))}
      </Stack>
      <SewingPricingFeature
        key={`${props.productId}:${selected.id}`}
        productId={props.productId}
        articleId={selected.id}
        fabric={
          selected.fabricName
            ? {
                name: selected.fabricName,
                pricePerMetre: selected.fabricPrice,
                metres: selected.fabricQuantity,
              }
            : null
        }
      />
    </Stack>
  );
}
