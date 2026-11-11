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
 * A colour variant of a norm: every fabric on its own large line («Основна», «Додаткова») with a
 * colour mark, a bar of their shares and «Разом»; with a batch, each line also shows the batch metres.
 */
export function FabricNormVariantCard({ variant, batchSize, onAdd }: Props) {
  const empty = variant.parts.length === 0;
  const total = variant.total ?? variant.parts[0]?.meters ?? null;
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-label={variant.title}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0,
        ...(empty && { bgcolor: 'action.hover', borderStyle: 'dashed' }),
      }}
    >
      <Typography variant="h6" component="h3">
        {variant.title}
      </Typography>
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
          {variant.parts.map((part, index) => (
            <Box
              key={part.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.25,
                py: 1,
                borderRadius: 1.5,
                bgcolor: tones[index].row,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: 0.5,
                  flexShrink: 0,
                  bgcolor: tones[index].swatch,
                }}
              />
              <Typography sx={{ flex: 1, fontSize: 15, fontWeight: 700 }}>{part.label}</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ ...mono, fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>
                  {formatMeters(part.meters)}
                </Typography>
                {batchSize !== null && (
                  <Typography variant="caption" color="text.secondary" sx={mono}>
                    × {batchSize} = {formatMeters(forBatch(part.meters, batchSize))}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
          {variant.parts.length > 1 && total !== null && (
            <>
              <Box
                aria-hidden
                sx={{ display: 'flex', gap: '2px', height: 8, borderRadius: 1, overflow: 'hidden' }}
              >
                {variant.parts.map((part, index) => (
                  <Box key={part.label} sx={{ flex: part.meters, bgcolor: tones[index].swatch }} />
                ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Разом
                </Typography>
                <Typography variant="body2" sx={{ ...mono, fontWeight: 700 }}>
                  {formatMeters(total)}
                  {batchSize !== null && ` · ${formatMeters(forBatch(total, batchSize))}`}
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </Paper>
  );
}
