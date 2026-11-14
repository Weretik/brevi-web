import { Box } from '@mui/material';

import { muted } from './quote-pdf-palette';
import { QuoteMarkedText } from '../quote-marked-text';

import type { QuoteSettingsPreviewSample } from '@admin/quotes/model';

/** An empty field means the server's standard text; the sketch says so instead of guessing it. */
export function QuotePdfStandard({
  text,
  marks,
}: {
  text: string;
  marks: QuoteSettingsPreviewSample['marks'];
}) {
  return text.trim() ? (
    <QuoteMarkedText text={text} marks={marks} />
  ) : (
    <Box component="span" sx={{ fontStyle: 'italic', color: muted }}>
      стандартний текст
    </Box>
  );
}
