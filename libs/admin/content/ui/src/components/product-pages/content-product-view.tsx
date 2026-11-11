import {
  contentProductProblems,
  contentProductTypeLabel,
  siteCategoryPath,
} from '@admin/content/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from './content-language-tabs';
import { ContentTextPreview } from './content-text-preview';

import type {
  ContentLanguage,
  ContentPriceTiers,
  ContentProduct,
  SiteCategoryRow,
} from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const money = (value: number) =>
  `${value.toLocaleString('uk-UA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} грн`;
const tiers = (prices: ContentPriceTiers | null) =>
  prices
    ? `${money(prices.retail)} · ${money(prices.wholesale)} · ${money(prices.largeWholesale)}`
    : 'немає ціни';

/**
 * Read-only side of the panel: what the site takes from «Товари» (cannot be changed here) and the
 * texts of the page in both languages.
 */
export function ContentProductView({
  product,
  categories,
}: {
  product: ContentProduct;
  /** The tree of «Розділи сайту»; null when the staff member may not see it. */
  categories: readonly SiteCategoryRow[] | null;
}) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const row = product.product;
  const problems = contentProductProblems(row);
  const active = product.variants.filter((variant) => variant.isActive);
  const inCategories = categories
    ? categories
        .filter((category) => product.categoryIds.includes(category.id))
        .map((category) => siteCategoryPath(category, categories))
        .join('; ') || 'немає'
    : `обрано: ${product.categoryIds.length}`;

  return (
    <Stack sx={{ gap: 2 }}>
      {problems.length > 0 && (
        <Alert severity="warning">
          Сайту бракує: {problems.map((problem) => problem.toLowerCase()).join('; ')}.
        </Alert>
      )}
      {!row.hasPage && (
        <Alert severity="info">
          У цього товару ще немає сторінки сайту. Натисніть «Редагувати», щоб її створити.
        </Alert>
      )}
      <ReferenceFormSection title="Сторінка">
        <ReferenceDetailsList
          items={[
            { label: 'Показувати на сайті', value: row.showOnSite ? 'Так' : 'Ні' },
            { label: 'Адреса', value: `/product/${product.slug}`, mono: true },
            { label: 'Розділи сайту', value: inCategories },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="З «Товари»">
        <ReferenceDetailsList
          items={[
            { label: 'Товар', value: row.name },
            { label: 'Код', value: row.code, mono: true },
            {
              label: 'Тип і розділ',
              value: [contentProductTypeLabel(row.type), row.sectionName]
                .filter(Boolean)
                .join(' · '),
            },
            { label: 'Ціни: 1–9 · 10–40 · від 41 шт', value: tiers(product.prices), mono: true },
          ]}
        />
        {active.length > 0 && (
          <Box>
            <Typography component="h4" variant="overline" color="text.secondary">
              Тканини на сайті
            </Typography>
            {active.map((variant) => (
              <Box key={variant.articleId} sx={{ py: 0.5 }}>
                <Typography variant="body2">
                  {variant.fabricName ?? variant.saleSku}
                  {variant.fabricDetails && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}
                      · {variant.fabricDetails}
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={mono}>
                  {variant.saleSku} · {tiers(variant.prices)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </ReferenceFormSection>
      <ReferenceFormSection title="Тексти">
        <ContentLanguageTabs value={language} onChange={setLanguage} />
        <ContentTextPreview text={product[language]} />
      </ReferenceFormSection>
    </Stack>
  );
}
