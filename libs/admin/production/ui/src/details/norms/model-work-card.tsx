import { compositionRest, fabricNormVariants } from '@admin/production/model';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

import { CompositionCard } from './composition-card';
import { FabricNormVariantCard } from './fabric-norm-variant-card';
import { ModelCompositionLayers } from './model-composition-layers';
import { ModelCompositionRest } from './model-composition-rest';
import { ModelWorkHeader } from './model-work-header';

import type { FabricNormRow, ModelComposition } from '@admin/production/model';

interface Props {
  row: FabricNormRow;
  /** The model's composition from «Товари»; undefined while loading or when it is not there. */
  composition: ModelComposition | undefined;
  compositionLoading: boolean;
  compositionError: string | null;
  batchText: string;
  batchSize: number | null;
  onBatchChange: (value: string) => void;
  /** null hides «Редагувати норму» (the model is gone from «Товари»). */
  onEdit: (() => void) | null;
  /** null hides «Видалити норму». */
  onDelete: (() => void) | null;
}

/**
 * The work card of one model: fabric per item for one, two and three colours (each fabric on its
 * own line), lining, insulation and fleece, and the rest of the composition from «Товари», all
 * optionally counted for a batch.
 */
export function ModelWorkCard({
  row,
  composition,
  compositionLoading,
  compositionError,
  batchText,
  batchSize,
  onBatchChange,
  onEdit,
  onDelete,
}: Props) {
  const name = row.modelName ?? row.modelCode;
  const variants = fabricNormVariants(row);
  const batchLabel = batchSize === null ? null : `На ${batchSize} шт.`;
  const rest = composition ? compositionRest(composition) : [];
  const editHref =
    row.productId === null ? null : `/references/products/${row.productId}?tab=materials`;

  return (
    <Box
      component="section"
      aria-label={`${row.modelCode} ${name}`}
      sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <ModelWorkHeader
        row={row}
        name={name}
        batchText={batchText}
        batchSize={batchSize}
        onBatchChange={onBatchChange}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {row.problem && <Alert severity="error">{row.problem}</Alert>}

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          alignItems: 'stretch',
        }}
      >
        {variants.map((variant) => (
          <FabricNormVariantCard
            key={variant.key}
            variant={variant}
            batchSize={batchSize}
            onAdd={onEdit}
          />
        ))}
      </Box>

      {compositionError ? (
        <Alert severity="error">{compositionError}</Alert>
      ) : compositionLoading && !composition ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={28} aria-label="Завантаження складу моделі" />
        </Box>
      ) : !composition ? (
        <Alert severity="warning">Складу цієї моделі в «Товари» немає.</Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
            alignItems: 'start',
          }}
        >
          <CompositionCard
            title={`Решта складу · ${rest.length}`}
            action={
              editHref && (
                <Button href={editHref} size="small">
                  Склад у «Товари»
                </Button>
              )
            }
          >
            <ModelCompositionRest
              name={name}
              rest={rest}
              batchLabel={batchLabel}
              batchSize={batchSize}
            />
          </CompositionCard>
          <CompositionCard title="Підкладка, утеплювач, фліс" action={null}>
            <ModelCompositionLayers
              name={name}
              layers={composition.layers}
              batchLabel={batchLabel}
              batchSize={batchSize}
            />
          </CompositionCard>
        </Box>
      )}
    </Box>
  );
}
