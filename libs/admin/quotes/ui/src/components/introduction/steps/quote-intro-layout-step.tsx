import { quoteIntroLayouts } from '@admin/quotes/model';
import { Box, ButtonBase, Typography } from '@mui/material';

import { QuoteIntroStep } from './quote-intro-step';

import type { QuoteIntroLayout } from '@admin/quotes/model';

interface Props {
  layout: QuoteIntroLayout;
  onChange: (layout: QuoteIntroLayout) => void;
}

/** Step 1: «Загальне», «Літній» or «Зимовий». */
export function QuoteIntroLayoutStep({ layout, onChange }: Props) {
  return (
    <QuoteIntroStep
      step={1}
      title="Оберіть основу добірки"
      description="Головна модель фіксована. Оберіть ще 3 моделі та по одній тканині для кожної сторінки."
    >
      <Box
        role="radiogroup"
        aria-label="Основа добірки"
        sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}
      >
        {quoteIntroLayouts.map((option) => {
          const selected = option.value === layout;
          return (
            <ButtonBase
              key={option.value}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              sx={{
                display: 'block',
                textAlign: 'left',
                p: 1.5,
                border: 1,
                borderRadius: 1,
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected ? 'action.selected' : 'background.paper',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {option.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.description}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </QuoteIntroStep>
  );
}
