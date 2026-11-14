import { Box, Stack } from '@mui/material';

import { accentText, line, muted, tileBand, tileBody, fabrics } from './quote-pdf-palette';
import { QuotePdfStandard } from './quote-pdf-standard';

import type { PdfHighlight } from './quote-pdf-highlight';
import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

/** The example model with its fabric variants and price tiles. */
export function QuotePdfModel({
  draft,
  sample,
  hl,
}: {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  hl: PdfHighlight;
}) {
  const { labels } = draft.pdf;
  return (
    <Box sx={{ mx: 2.25, mt: 1.5, pt: 1.25, borderTop: `1px solid ${line}` }}>
      <Stack direction="row" sx={{ gap: 1.25 }}>
        <Box sx={{ width: 56, height: 68, flex: 'none', bgcolor: '#F7F5F2' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontWeight: 700, fontSize: 11 }}>
            <Box component="span" sx={{ color: accentText, mr: 0.75 }}>
              01
            </Box>
            Куртка робоча «Імпульс»
          </Box>
          <Box sx={{ fontSize: 7.5, color: muted }}>
            Сезон: Літо ·{' '}
            <Box component="span" sx={hl('pdf.labels.codeLabel')}>
              {labels.codeLabel.trim() || 'арт.'}
            </Box>{' '}
            MOD-166
          </Box>
          <Box sx={{ fontSize: 8.5 }}>Опис моделі з картки товару.</Box>
          <Box
            sx={{
              fontSize: 7.5,
              color: accentText,
              textDecoration: 'underline',
              ...hl('pdf.labels.siteLink'),
            }}
          >
            <QuotePdfStandard text={labels.siteLink} marks={sample.marks} />
          </Box>
        </Box>
      </Stack>
      <Box
        sx={{
          mt: 0.75,
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: muted,
          ...hl('pdf.labels.fabricsTitle'),
        }}
      >
        <QuotePdfStandard text={labels.fabricsTitle} marks={sample.marks} />
      </Box>
      {fabrics.map((fabric) => (
        <Stack
          key={fabric.name}
          direction="row"
          sx={{
            mt: 0.5,
            p: 0.5,
            gap: 0.75,
            alignItems: 'center',
            borderRadius: 0.5,
            bgcolor: fabric.recommended ? '#FFF4E3' : undefined,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ fontWeight: 700, fontSize: 8.5 }}>{fabric.name}</Box>
            <Box sx={{ fontSize: 7, color: muted }}>{fabric.details}</Box>
            {fabric.recommended && (
              <Box
                sx={{
                  fontSize: 7,
                  fontWeight: 700,
                  color: accentText,
                  ...hl('pdf.labels.recommended'),
                }}
              >
                <QuotePdfStandard text={labels.recommended} marks={sample.marks} />
              </Box>
            )}
          </Box>
          <Stack direction="row" sx={{ gap: 0.5, width: '58%', flex: 'none' }}>
            {fabric.tiles.map((tile) => (
              <Box key={tile.label} sx={{ flex: '0 0 calc((100% - 8px) / 3)' }}>
                <Box sx={{ bgcolor: tileBand, fontSize: 6.5, color: muted, px: 0.5 }}>
                  {tile.label}
                </Box>
                <Box sx={{ bgcolor: tileBody, fontWeight: 700, fontSize: 9, px: 0.5, py: 0.25 }}>
                  {tile.value}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      ))}
    </Box>
  );
}
