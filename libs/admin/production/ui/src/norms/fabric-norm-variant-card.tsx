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

/** Swatch and row tint of each fabric: graphite main, orange additional, grey second additional. */
const tones = [
  { swatch: 'text.primary', row: 'action.hover' },
  { swatch: 'primary.main', row: 'primary.light' },
  { swatch: 'text.secondary', row: 'action.hover' },
] as const;

/**
 * A colour variant of a norm. Its fabrics are stacked rows (colour mark and full label on the left,
 * metres on the right, never wrapped or truncated, so three fabrics fit a narrow card), «Разом»
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
        ...(empty && { bgcolor: 'action.hover', borderStyle: 'dashed' }),
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}
      >
        <Typography variant="h6" component="h3">
          {variant.title}
        </Typography>
        {variant.total !== null && (
          <Typography variant="body2" color="text.secondary" component="div">
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
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
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
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{part.label}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ ...mono, fontSize: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>
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
