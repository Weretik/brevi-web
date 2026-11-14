import { Box, Stack, Typography } from '@mui/material';

import { accent, accentText } from '../quote-pdf-palette';

import type { PdfHighlight } from '../quote-pdf-highlight';
import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

/** The logo or company name, the КП title and number, and the requisites line. */
export function QuotePdfHeader({
  draft,
  sample,
  hl,
}: {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  hl: PdfHighlight;
}) {
  const { company, pdf } = draft;
  const site = sample.marks['{site}'];
  const requisites = [
    [
      company.name,
      company.edrpou && `ЄДРПОУ ${company.edrpou}`,
      company.taxId && `ІПН ${company.taxId}`,
      company.iban && `IBAN ${company.iban}`,
    ],
    [company.address, site, company.email],
  ].map((parts) => parts.filter((part) => part && part.trim()).join(' · '));
  return (
    <Box sx={{ px: 2.25, pt: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, ...hl('company.') }}>
        {company.logoUrl.trim().startsWith('https://') ? (
          <Box
            component="img"
            src={company.logoUrl.trim()}
            alt=""
            sx={{ maxHeight: 30, maxWidth: 110, objectFit: 'contain' }}
          />
        ) : (
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: accentText }}>
            {company.name || 'Назва компанії'}
          </Typography>
        )}
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ fontWeight: 700, fontSize: 11, letterSpacing: '.04em', ...hl('pdf.title') }}>
            {pdf.title || 'Заголовок'}
          </Box>
          <Box>
            № <b>{sample.number}</b> · від {sample.date}
          </Box>
        </Box>
      </Stack>
      <Box
        sx={{
          mt: 0.75,
          pt: 0.5,
          borderTop: `2px solid ${accent}`,
          fontSize: 7.5,
          color: '#444',
          ...hl('company.'),
        }}
      >
        {requisites.map((text) => text && <Box key={text}>{text}</Box>)}
      </Box>
    </Box>
  );
}
