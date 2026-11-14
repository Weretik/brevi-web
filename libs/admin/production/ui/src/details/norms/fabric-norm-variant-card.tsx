import { forBatch, formatMeters } from '@admin/production/model';
import { Box, Button, Paper, Typography } from '@mui/material';

import type { FabricNormVariant } from '@admin/production/model';

interface Props {
  variant: FabricNormVariant;
  /** Items in the batch, or null while the batch field is empty. */
  batchSize: number | null;
  /** «Додати варіант» for an empty variant; null hides it. */
  onAdd: (() => void) | null;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/**
 * Font sizes follow the card width (container query units), so on a narrow screen the labels and
 * metres shrink instead of running into each other; below the minimum the metres wrap under the label.
 */
const fluid = {
  title: 'clamp(14px, 8cqi, 20px)',
  label: 'clamp(12px, 6.5cqi, 14px)',
  meters: 'clamp(15px, 9cqi, 20px)',
} as const;

/** Swatch and row tint of each fabric: graphite main, orange additional, grey second additional. */
const tones = [
  { swatch: 'text.primary', row: 'action.hover' },
  { swatch: 'primary.main', row: 'primary.light' },
  { swatch: 'text.secondary', row: 'action.hover' },
] as const;

/**
 * A colour variant of a norm. Its fabrics are stacked rows (colour mark and full label on the left,
 * metres on the right; text shrinks with the card and the metres wrap below the label rather than
 * overlap it, never truncated), «Разом»
 * sits in the header and a bar of their shares at the bottom. The cards stretch to one height.
 * With a batch, each row also shows the batch metres.
 */
export function FabricNormVariantCard({ variant, batchSize, onAdd }: Props) {
  const empty = variant.parts.length === 0;
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-label={variant.title}
      sx={{
        p: 2,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        minWidth: 0,
        containerType: 'inline-size',
        ...(empty && { bgcolor: 'action.hover', borderStyle: 'dashed' }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          columnGap: 1,
          rowGap: 0.25,
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{ fontSize: fluid.title, whiteSpace: 'nowrap' }}
        >
          {variant.title}
        </Typography>
        {variant.total !== null && (
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            sx={{ whiteSpace: 'nowrap', fontSize: fluid.label }}
          >
            Разом{' '}
            <Box component="span" sx={{ ...mono, fontWeight: 700, color: 'text.primary' }}>
              {formatMeters(variant.total)}
            </Box>
            {batchSize !== null && (
              <Box component="span" sx={mono}>
                {' '}
                · {formatMeters(forBatch(variant.total, batchSize))}
              </Box>
            )}
          </Typography>
        )}
      </Box>
      {empty ? (
        <>
          <Typography variant="body2" color="text.secondary">
            {variant.key === 'one' ? 'Норму ще не задано.' : `Не шиється у ${variant.title}.`}
          </Typography>
          {onAdd && (
            <Button
              variant="outlined"
              size="small"
              onClick={onAdd}
              sx={{ alignSelf: 'flex-start' }}
            >
              Додати варіант
            </Button>
          )}
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {variant.parts.map((part, index) => (
              <Box
                key={part.label}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  bgcolor: tones[index].row,
                  minWidth: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  columnGap: 1.5,
                  rowGap: 0.25,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box
                    aria-hidden
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 0.5,
                      flexShrink: 0,
                      bgcolor: tones[index].swatch,
                    }}
                  />
                  <Typography sx={{ fontSize: fluid.label, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {part.label}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 'auto' }}>
                  <Typography
                    sx={{ ...mono, fontSize: fluid.meters, fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    {formatMeters(part.meters)}
                  </Typography>
                  {batchSize !== null && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ...mono, whiteSpace: 'nowrap' }}
                      component="div"
                    >
                      × {batchSize} = {formatMeters(forBatch(part.meters, batchSize))}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          {variant.parts.length > 1 && (
            <Box
              aria-hidden
              sx={{
                display: 'flex',
                gap: '2px',
                height: 8,
                borderRadius: 1,
                overflow: 'hidden',
                mt: 'auto',
              }}
            >
              {variant.parts.map((part, index) => (
                <Box key={part.label} sx={{ flex: part.meters, bgcolor: tones[index].swatch }} />
              ))}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}
