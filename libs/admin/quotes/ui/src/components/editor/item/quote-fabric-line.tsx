import { quoteFabricFactsParts, quoteOptionFabrics } from '@admin/quotes/model';
import { Box, Typography } from '@mui/material';

import type { QuoteFabricFacts, QuoteOptionDraft } from '@admin/quotes/model';

interface Props {
  option: QuoteOptionDraft;
  /** Current Reference fabrics by id; the line waits for them. */
  fabricFacts: ReadonlyMap<number, QuoteFabricFacts>;
}

/**
 * The manager line under a fabric (R-31): «Склад · Щільність · грн/м · постачальник», the same for a new, saved or
 * changed variant. The client text and the PDF stay as they are; the supplier never goes to the client.
 */
export function QuoteFabricLine({ option, fabricFacts }: Props) {
  const fabrics = quoteOptionFabrics(option)
    .map((ref) => ({ ref, facts: fabricFacts.get(ref.fabricId) }))
    .filter((x) => x.facts !== undefined);
  if (fabrics.length === 0) {
    const fallback = [option.details, option.fabricInfo].filter(Boolean).join(' · ');
    return fallback ? (
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {fallback}
      </Typography>
    ) : null;
  }
  return (
    <>
      {fabrics.map(({ ref, facts }) =>
        facts ? (
          <Typography
            key={ref.fabricId}
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {ref.label && (
              <Box component="span" sx={{ fontWeight: 600 }}>
                {ref.label}:{' '}
              </Box>
            )}
            {quoteFabricFactsParts(facts).join(' · ')}
            {facts.supplierName && (
              <>
                {' · '}
                <Box component="span" sx={{ color: 'text.primary' }}>
                  {facts.supplierName}
                </Box>
              </>
            )}
          </Typography>
        ) : null,
      )}
    </>
  );
}
