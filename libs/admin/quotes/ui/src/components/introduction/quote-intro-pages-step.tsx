import {
  introSlotPrice,
  quoteIntroCatalogSeasons,
  quoteIntroSeasonLabels,
} from '@admin/quotes/model';
import { Alert, Box, Stack, Typography } from '@mui/material';

import { QuoteIntroSlotCard } from './quote-intro-slot-card';
import { QuoteIntroStep } from './quote-intro-step';

import type {
  QuoteCatalogProduct,
  QuoteIntroErrors,
  QuoteIntroPageDraft,
  QuoteIntroSeason,
  QuoteIntroSlotDraft,
} from '@admin/quotes/model';

interface Props {
  pages: readonly QuoteIntroPageDraft[];
  products: ReadonlyMap<number, QuoteCatalogProduct>;
  errors: QuoteIntroErrors;
  /** Why a season cannot start, e.g. the main model code is not in the Catalog. */
  mainProblems: Readonly<Partial<Record<QuoteIntroSeason, string>>>;
  onPick: (season: QuoteIntroSeason, slot: QuoteIntroSlotDraft) => void;
  onFabric: (slot: QuoteIntroSlotDraft, articleId: number | null) => void;
  onClear: (slot: QuoteIntroSlotDraft) => void;
}

/** Step 4: catalogue pages, the main model first, then three models of the season. */
export function QuoteIntroPagesStep({
  pages,
  products,
  errors,
  mainProblems,
  onPick,
  onFabric,
  onClear,
}: Props) {
  return (
    <QuoteIntroStep
      step={4}
      title="Зберіть сторінки каталогу"
      description="Одна тканина для кожної моделі. Ціна з довідника для замовлення від 41 шт. з ПДВ; вручну її не змінюють."
    >
      {errors['pages'] && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {errors['pages']}
        </Alert>
      )}
      <Stack sx={{ gap: 2.5 }}>
        {pages.map((page, pageIndex) => (
          <Box key={page.season}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Сторінка {pageIndex + 1} · {quoteIntroSeasonLabels[page.season]}
            </Typography>
            {mainProblems[page.season] && (
              <Alert severity="warning" sx={{ mb: 1 }}>
                {mainProblems[page.season]}
              </Alert>
            )}
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
              }}
            >
              {page.slots.map((slot, index) => {
                const product = slot.productId === null ? undefined : products.get(slot.productId);
                return (
                  <QuoteIntroSlotCard
                    key={slot.key}
                    slot={slot}
                    isMain={index === 0}
                    label={
                      index === 0 ? 'Головна модель · фіксована' : `Модель ${index} · обов’язково`
                    }
                    seasonHint={`Тільки асортимент «${quoteIntroCatalogSeasons[page.season]}»`}
                    product={product}
                    price={introSlotPrice(slot, product)}
                    error={errors[`slot:${slot.key}`]}
                    onPick={() => onPick(page.season, slot)}
                    onFabric={(articleId) => onFabric(slot, articleId)}
                    onClear={() => onClear(slot)}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Stack>
    </QuoteIntroStep>
  );
}
