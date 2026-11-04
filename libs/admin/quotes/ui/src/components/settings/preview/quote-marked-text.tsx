import { fillQuoteMarks } from '@admin/quotes/model';
import { Box } from '@mui/material';

import type { QuoteTemplateMark } from '@admin/quotes/model';

interface Props {
  text: string;
  marks: Readonly<Record<QuoteTemplateMark, string>>;
}

/** A template as the client reads it: marks filled with example values, an unknown mark in red. */
export function QuoteMarkedText({ text, marks }: Props) {
  return (
    <>
      {fillQuoteMarks(text, marks).map((part, index) =>
        part.kind === 'unknown' ? (
          <Box
            key={index}
            component="span"
            title="Невідома мітка: клієнт побачить її як є"
            sx={{ color: 'error.main', bgcolor: 'error.light', borderRadius: 0.5, px: 0.25 }}
          >
            {part.text}
          </Box>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
