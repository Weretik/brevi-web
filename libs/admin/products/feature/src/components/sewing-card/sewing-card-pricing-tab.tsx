import { ReferenceFilterChip } from '@admin/references/ui';
import { Stack, Typography } from '@mui/material';

import { SewingPricingFeature } from '../sewing-pricing/sewing-pricing-feature';

import type { SewingArticleSummaryRow } from '@admin/products/model';

interface Props {
  productId: number;
  articles: SewingArticleSummaryRow[];
  articleId: number | null;
  dirty: boolean;
  onSelect: (articleId: number) => void;
}

/** «Розрахунок»: the price of one Article and its cost breakdown; prices are published automatically. */
export function SewingCardPricingTab(props: Props) {
  if (!props.articles.length)
    return (
      <Typography sx={{ color: 'text.secondary' }}>
        Немає артикулу. Додайте його на вкладці «Артикули».
      </Typography>
    );
  const selected =
    props.articles.find((article) => article.id === props.articleId) ?? props.articles[0];
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        role="group"
        aria-label="Артикул для розрахунку"
        direction="row"
        sx={{ gap: 1, flexWrap: 'wrap' }}
      >
        {props.articles.map((article) => (
          <ReferenceFilterChip
            key={article.id}
            label={`Артикул ${article.saleSku}`}
            selected={article.id === selected.id}
            onClick={() => props.onSelect(article.id)}
          />
        ))}
      </Stack>
      <SewingPricingFeature
        key={`${props.productId}:${selected.id}`}
        productId={props.productId}
        articleId={selected.id}
        dirty={props.dirty}
      />
    </Stack>
  );
}
