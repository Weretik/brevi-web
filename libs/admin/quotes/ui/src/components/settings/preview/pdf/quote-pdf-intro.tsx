import { Box, Stack } from '@mui/material';

import { muted } from './quote-pdf-palette';
import { QuotePdfStandard } from './quote-pdf-standard';

import type { PdfHighlight } from './quote-pdf-highlight';
import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

/** The client, the introduction, the VAT notice and the contact line. */
export function QuotePdfIntro({
  draft,
  sample,
  hl,
}: {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  hl: PdfHighlight;
}) {
  const { pdf } = draft;
  const { labels } = pdf;
  return (
    <Stack direction="row" sx={{ px: 2.25, pt: 1.5, gap: 1.5 }}>
      {pdf.showClient && (
        <Box sx={{ flex: '0 0 30%' }}>
          <Box
            sx={{
              fontSize: 7,
              color: muted,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              ...hl('pdf.labels.clientTitle'),
            }}
          >
            {labels.clientTitle.trim() || 'Для'}
          </Box>
          <Box sx={{ fontWeight: 700, fontSize: 11 }}>{sample.client}</Box>
        </Box>
      )}
      <Box sx={{ flex: 1 }}>
        <Box sx={hl('pdf.intros.')}>
          <QuotePdfStandard text={pdf.intros.oneSewing} marks={sample.marks} />
        </Box>
        {pdf.vatNotice.trim() && (
          <Box sx={{ fontWeight: 600, ...hl('pdf.vatNotice') }}>{pdf.vatNotice}</Box>
        )}
        <Box sx={{ fontSize: 8, color: muted, ...hl('pdf.labels.contactLine', 'staff:') }}>
          <QuotePdfStandard text={labels.contactLine} marks={sample.marks} />
        </Box>
      </Box>
    </Stack>
  );
}
