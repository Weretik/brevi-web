import { Box } from '@mui/material';

import { QuoteMarkedText } from '../../quote-marked-text';
import { accentOnDark, graphite } from '../quote-pdf-palette';

import type { PdfHighlight } from '../quote-pdf-highlight';
import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

/** The dark call-to-action block; it shows only when one of its texts is filled. */
export function QuotePdfCta({
  draft,
  sample,
  hl,
}: {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  hl: PdfHighlight;
}) {
  const { pdf } = draft;
  const hasCta = Boolean(
    pdf.ctaTitle.trim() || pdf.ctaText.trim() || pdf.ctaContactTemplate.trim(),
  );
  if (!hasCta) return null;
  return (
    <Box
      sx={{
        mx: 2.25,
        mt: 1.5,
        bgcolor: graphite,
        color: '#E8E6E3',
        borderRadius: 1,
        p: 1.25,
        whiteSpace: 'pre-line',
      }}
    >
      {pdf.ctaTitle.trim() && (
        <Box sx={{ fontSize: 10.5, fontWeight: 700, color: accentOnDark, ...hl('pdf.ctaTitle') }}>
          {pdf.ctaTitle}
        </Box>
      )}
      {pdf.ctaText.trim() && <Box sx={hl('pdf.ctaText')}>{pdf.ctaText}</Box>}
      {pdf.ctaContactTemplate.trim() && (
        <Box
          sx={{
            pt: 0.5,
            fontWeight: 600,
            color: '#fff',
            ...hl('pdf.ctaContactTemplate', 'staff:'),
          }}
        >
          <QuoteMarkedText text={pdf.ctaContactTemplate} marks={sample.marks} />
        </Box>
      )}
    </Box>
  );
}
