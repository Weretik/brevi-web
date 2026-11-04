import { Box, Stack, Typography } from '@mui/material';

import { QuoteMarkedText } from './quote-marked-text';
import { previewHighlight } from './quote-preview-highlight';

import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

interface Props {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  focused: string | null;
}

/** Accent of the КП PDF (the server draws it with the same colour). */
const accent = '#E8780F';
const accentSoft = '#FDF1E6';
const muted = '#6B6B66';

const rows = [
  { name: 'Куртка робоча, твіл', prices: ['1 240,00', '1 120,00', '1 050,00'] },
  { name: 'Напівкомбінезон, твіл', prices: ['980,00', '890,00', '840,00'] },
];

/** A sketch of the КП page with the example data; the real PDF is drawn by the server. */
export function QuotePdfPreview({ draft, sample, focused }: Props) {
  const { company, pdf } = draft;
  const hl = (...paths: string[]) => previewHighlight(focused, ...paths);
  const site = sample.marks['{site}'];
  const hasCta = Boolean(
    pdf.ctaTitle.trim() || pdf.ctaText.trim() || pdf.ctaContactTemplate.trim(),
  );
  return (
    <Box
      role="img"
      aria-label="Перегляд PDF КП"
      sx={{
        bgcolor: '#fff',
        color: '#1F1F1F',
        border: 1,
        borderColor: 'divider',
        borderRadius: 0.5,
        boxShadow: '0 6px 18px rgba(0,0,0,.08)',
        p: 2.25,
        fontSize: 10,
        lineHeight: 1.45,
        aspectRatio: '1 / 1.414',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          gap: 1,
          pb: 1,
          borderBottom: `2px solid ${accent}`,
          ...hl('company.'),
        }}
      >
        {company.logoUrl.trim().startsWith('https://') ? (
          <Box
            component="img"
            src={company.logoUrl.trim()}
            alt=""
            sx={{ maxHeight: 28, maxWidth: 110, objectFit: 'contain' }}
          />
        ) : (
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: accent }}>
            {company.name || 'Назва компанії'}
          </Typography>
        )}
        <Box sx={{ textAlign: 'right', fontSize: 8.5, color: muted }}>
          <Box sx={{ fontWeight: 700, color: '#1F1F1F' }}>{company.name}</Box>
          {[company.address, company.phone, company.email]
            .filter((line) => line.trim())
            .map((line) => (
              <Box key={line}>{line}</Box>
            ))}
          {site && <Box sx={{ color: accent }}>{site}</Box>}
        </Box>
      </Stack>

      <Box>
        <Box sx={{ fontSize: 15, fontWeight: 700, color: accent, ...hl('pdf.title') }}>
          {pdf.title || 'Заголовок'}
        </Box>
        <Box sx={{ color: muted }}>
          № {sample.number} від {sample.date}
        </Box>
        <Box>
          <Box component="span" sx={{ color: muted }}>
            Для:{' '}
          </Box>
          <b>{sample.client}</b>
        </Box>
      </Box>

      <Box sx={{ border: '1px solid #E3E3DF', p: 1 }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
          <thead>
            <tr>
              {['Варіант тканини', 'до 9 шт.', '10–40 шт.', 'від 41 шт.'].map((head, index) => (
                <Box
                  component="th"
                  key={head}
                  sx={{
                    textAlign: index === 0 ? 'left' : 'right',
                    color: muted,
                    fontWeight: 400,
                    borderBottom: '1px solid #E3E3DF',
                    py: 0.25,
                  }}
                >
                  {head}
                </Box>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <Box component="td" sx={{ fontWeight: 600, py: 0.5 }}>
                  {row.name}
                </Box>
                {row.prices.map((price, index) => (
                  <Box component="td" key={index} sx={{ textAlign: 'right', fontWeight: 600 }}>
                    {price}
                  </Box>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>

      {pdf.vatNotice.trim() && (
        <Box sx={{ fontStyle: 'italic', color: muted, ...hl('pdf.vatNotice') }}>
          {pdf.vatNotice}
        </Box>
      )}

      {hasCta && (
        <Box
          sx={{
            border: `1px solid ${accent}`,
            bgcolor: accentSoft,
            p: 1.25,
            whiteSpace: 'pre-line',
          }}
        >
          {pdf.ctaTitle.trim() && (
            <Box sx={{ fontSize: 11, fontWeight: 700, ...hl('pdf.ctaTitle') }}>{pdf.ctaTitle}</Box>
          )}
          {pdf.ctaText.trim() && <Box sx={hl('pdf.ctaText')}>{pdf.ctaText}</Box>}
          {pdf.ctaContactTemplate.trim() && (
            <Box sx={{ pt: 0.5, fontWeight: 600, ...hl('pdf.ctaContactTemplate', 'staff:') }}>
              <QuoteMarkedText text={pdf.ctaContactTemplate} marks={sample.marks} />
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ flex: 1 }} />
      <Box
        sx={{
          borderTop: '1px solid #E3E3DF',
          pt: 0.75,
          fontSize: 8,
          color: muted,
          ...hl('company.name', 'company.edrpou', 'company.taxId', 'company.iban'),
        }}
      >
        {[
          company.name,
          company.edrpou && `ЄДРПОУ ${company.edrpou}`,
          company.taxId && `ІПН ${company.taxId}`,
          company.iban && `IBAN ${company.iban}`,
        ]
          .filter(Boolean)
          .join(' · ')}
      </Box>
    </Box>
  );
}
