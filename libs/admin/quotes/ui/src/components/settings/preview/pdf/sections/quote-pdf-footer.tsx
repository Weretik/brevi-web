import { Box, Stack } from '@mui/material';

import { accentOnDark, graphite } from '../quote-pdf-palette';

import type { PdfHighlight } from '../quote-pdf-highlight';
import type { QuoteSettingsPreviewSample } from '@admin/quotes/model';

/** The manager contacts and the site in the dark page footer. */
export function QuotePdfFooter({
  sample,
  hl,
}: {
  sample: QuoteSettingsPreviewSample;
  hl: PdfHighlight;
}) {
  const site = sample.marks['{site}'];
  return (
    <Stack
      direction="row"
      sx={{
        bgcolor: graphite,
        color: '#fff',
        px: 2.25,
        py: 1,
        fontSize: 8,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        ...hl('staff:'),
      }}
    >
      <Box>
        <Box sx={{ fontWeight: 700, color: accentOnDark }}>{sample.marks['{managerName}']}</Box>
        <Box>{sample.marks['{managerPhone}']}</Box>
        <Box>{sample.marks['{managerEmail}']}</Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        {site && <Box>{site}</Box>}
        <Box>Сторінка 1 з 1</Box>
      </Box>
    </Stack>
  );
}
