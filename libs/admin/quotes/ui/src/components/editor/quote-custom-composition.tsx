import { quoteCustomLineKindLabels } from '@admin/quotes/model';
import { Box, Typography } from '@mui/material';

import type { QuoteItemLine, QuoteItemLineKind } from '@admin/quotes/model';

const quantity = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 4 });

const lineText = (line: QuoteItemLine) =>
  line.kind === 'Operation'
    ? `${line.name} × ${quantity.format(line.quantity)}${line.manualMinutes === null ? '' : ` (${quantity.format(line.manualMinutes)} хв)`}`
    : `${line.name} — ${quantity.format(line.quantity)} ${line.unit}`;

/** The accessories and operations of a «Виріб з нуля», for the manager only. */
export function QuoteCustomComposition({ lines }: { lines: readonly QuoteItemLine[] }) {
  const kinds: QuoteItemLineKind[] = ['Accessory', 'Operation'];
  return (
    <Box sx={{ mt: 2 }} aria-label="Склад виробу">
      {kinds.map((kind) => {
        const ofKind = lines.filter((line) => line.kind === kind);
        if (ofKind.length === 0) return null;
        return (
          <Typography key={kind} variant="body2" color="text.secondary">
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {quoteCustomLineKindLabels[kind]}:
            </Box>{' '}
            {ofKind.map(lineText).join('; ')}
          </Typography>
        );
      })}
    </Box>
  );
}
