import { Box } from '@mui/material';

import { QuotePdfCta } from './pdf/quote-pdf-cta';
import { QuotePdfFooter } from './pdf/quote-pdf-footer';
import { QuotePdfHeader } from './pdf/quote-pdf-header';
import { QuotePdfIntro } from './pdf/quote-pdf-intro';
import { QuotePdfModel } from './pdf/quote-pdf-model';
import { graphite } from './pdf/quote-pdf-palette';
import { previewHighlight } from './quote-preview-highlight';

import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

interface Props {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  focused: string | null;
}

/** A sketch of the first КП page with the example data; the real PDF is drawn by the server. */
export function QuotePdfPreview({ draft, sample, focused }: Props) {
  const hl = (...paths: string[]) => previewHighlight(focused, ...paths);
  const parts = { draft, sample, hl };
  return (
    <Box
      role="img"
      aria-label="Перегляд PDF КП"
      sx={{
        bgcolor: '#fff',
        color: graphite,
        border: 1,
        borderColor: 'divider',
        borderRadius: 0.5,
        boxShadow: '0 6px 18px rgba(0,0,0,.08)',
        fontSize: 9.5,
        lineHeight: 1.45,
        aspectRatio: '1 / 1.414',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <QuotePdfHeader {...parts} />
      <QuotePdfIntro {...parts} />
      <QuotePdfModel {...parts} />
      <QuotePdfCta {...parts} />
      <Box sx={{ flex: 1 }} />
      <QuotePdfFooter {...parts} />
    </Box>
  );
}
