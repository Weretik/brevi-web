import { Box, Typography } from '@mui/material';

import { QuoteMarkedText } from './quote-marked-text';
import { previewHighlight } from './quote-preview-highlight';

import type { QuoteEmailTemplateDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

interface Props {
  /** `email` or `letter:<key>`: the highlight follows its fields. */
  path: string;
  /** Name of the template shown above the letter. */
  title: string;
  letter: QuoteEmailTemplateDraft;
  sample: QuoteSettingsPreviewSample;
  focused: string | null;
}

/** The letter as it arrives: subject, sender, text with filled marks and the PDF attached. */
export function QuoteLetterPreview({ path, title, letter, sample, focused }: Props) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.75 }}>
        Шаблон: {title}
      </Typography>
      <Box
        role="img"
        aria-label="Перегляд листа клієнту"
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          fontSize: 13,
        }}
      >
        <Box
          sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}
        >
          <Box sx={{ fontWeight: 700, ...previewHighlight(focused, `${path}.subject`) }}>
            <QuoteMarkedText text={letter.subject || 'Без теми'} marks={sample.marks} />
          </Box>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
            {sample.managerName} &lt;{sample.managerEmail}&gt; → клієнту
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            ...previewHighlight(focused, `${path}.body`),
          }}
        >
          <QuoteMarkedText text={letter.body} marks={sample.marks} />
        </Box>
        <Box
          sx={{
            mx: 2,
            mb: 2,
            p: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            fontSize: 12,
          }}
        >
          <Box
            sx={{
              px: 0.75,
              py: 0.5,
              bgcolor: 'error.light',
              color: 'error.main',
              fontWeight: 700,
              fontSize: 10,
              borderRadius: 0.5,
            }}
          >
            PDF
          </Box>
          KP-{sample.number}.pdf
        </Box>
      </Box>
    </Box>
  );
}
