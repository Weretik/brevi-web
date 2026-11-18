import { forBatch, formatMeters } from '@admin/production/model';
import { Box, Typography } from '@mui/material';

import type { FabricNormVariant } from '@admin/production/model';

export const mono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
} as const;

/**
 * Font sizes follow the card width (container query units), so on a narrow screen the labels and
 * metres shrink instead of running into each other; below the minimum the metres wrap under the label.
 */
export const fluid = {
  title: 'clamp(14px, 8cqi, 20px)',
  label: 'clamp(12px, 6.5cqi, 14px)',
  meters: 'clamp(15px, 9cqi, 20px)',
} as const;

/** Swatch and row tint of each fabric: graphite main, orange additional, grey second additional. */
export const tones = [
  { swatch: 'text.primary', row: 'action.hover' },
  { swatch: 'primary.main', row: 'primary.light' },
  { swatch: 'text.secondary', row: 'action.hover' },
] as const;

interface Props {
  part: FabricNormVariant['parts'][number];
  /** Position of the fabric in the variant: main, additional, second additional. */
  tone: number;
  batchSize: number | null;
}

/** One fabric of a variant: colour mark and label on the left, metres (and batch metres) on the right. */
export function FabricNormPartRow({ part, tone, batchSize }: Props) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        bgcolor: tones[tone].row,
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
            bgcolor: tones[tone].swatch,
          }}
        />
        <Typography sx={{ fontSize: fluid.label, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {part.label}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 'auto' }}>
        <Typography sx={{ ...mono, fontSize: fluid.meters, fontWeight: 600, whiteSpace: 'nowrap' }}>
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
  );
}
