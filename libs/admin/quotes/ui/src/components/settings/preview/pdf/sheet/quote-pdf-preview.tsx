import { Box } from '@mui/material';

import { graphite } from './quote-pdf-palette';
import { previewHighlight } from '../../letter/quote-preview-highlight';
import { QuotePdfCta } from '../sections/quote-pdf-cta';
import { QuotePdfFooter } from '../sections/quote-pdf-footer';
import { QuotePdfHeader } from '../sections/quote-pdf-header';
import { QuotePdfIntro } from '../sections/quote-pdf-intro';
import { QuotePdfModel } from '../sections/quote-pdf-model';

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
