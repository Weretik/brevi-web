import { QuoteCustomVariantCard } from '@admin/quotes/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Stack, Typography } from '@mui/material';

import type { useQuoteCustomSewing } from '../../hooks/custom-sewing/use-quote-custom-sewing';

interface Props {
  panel: ReturnType<typeof useQuoteCustomSewing>;
}

const maxVariants = 20;

/** «Варіанти тканин»: each variant is its own set of fabrics with its own price. */
export function QuoteCustomVariantsSection({ panel }: Props) {
  const { draft } = panel;
  return (
    <Stack component="section" aria-label="Варіанти" sx={{ gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Варіанти тканин
      </Typography>
      {draft.variants.map((variant, index) => (
        <QuoteCustomVariantCard
          key={variant.key}
          index={index}
          variant={variant}
          choices={panel.choices.fabrics}
          loading={panel.loadingReferences}
          price={panel.price?.variants[index] ?? null}
          canRemove={draft.variants.length > 1}
          onRecommend={() => panel.recommend(variant.key)}
          onRemove={() => panel.removeVariant(variant.key)}
          onAddFabric={(choice) => panel.addFabric(variant.key, choice)}
          onMeters={(fabricKey, meters) => panel.setMeters(variant.key, fabricKey, meters)}
          onRemoveFabric={(fabricKey) => panel.removeFabric(variant.key, fabricKey)}
        />
      ))}
      {draft.variants.length < maxVariants && (
        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={panel.addVariant}
          sx={{ alignSelf: 'flex-start' }}
        >
          Додати варіант
        </Button>
      )}
    </Stack>
  );
}
