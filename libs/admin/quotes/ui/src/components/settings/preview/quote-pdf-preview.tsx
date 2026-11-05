import { Box, Stack, Typography } from '@mui/material';

import { QuoteMarkedText } from './quote-marked-text';
import { previewHighlight } from './quote-preview-highlight';

import type { QuoteSettingsDraft, QuoteSettingsPreviewSample } from '@admin/quotes/model';

interface Props {
  draft: QuoteSettingsDraft;
  sample: QuoteSettingsPreviewSample;
  focused: string | null;
}

/** Colours of the КП PDF «Класика+» (the server draws it with the same ones). */
const accent = '#FD9600';
const accentText = '#9A5A00';
const accentOnDark = '#FFB547';
const graphite = '#262626';
const line = '#E2DED8';
const muted = '#555555';

/** The standard opening text the server uses when the field is empty. */
const standardIntro =
  'Підібрали для {client} добірку відповідно до вашого запиту. Для кожної позиції вказані характеристики та ціна, щоб ви могли швидко сформувати потрібний набір.';

const prices = [
  { label: '10–40 шт.', value: '1 120,00 грн' },
  { label: 'від 41 шт.', value: '1 050,00 грн' },
];

/** A sketch of the first КП page with the example data; the real PDF is drawn by the server. */
export function QuotePdfPreview({ draft, sample, focused }: Props) {
  const { company, pdf } = draft;
  const hl = (...paths: string[]) => previewHighlight(focused, ...paths);
  const site = sample.marks['{site}'];
  const intro = (pdf.introText.trim() || standardIntro).replaceAll('{client}', sample.client);
  const hasCta = Boolean(
    pdf.ctaTitle.trim() || pdf.ctaText.trim() || pdf.ctaContactTemplate.trim(),
  );
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

      <Stack direction="row" sx={{ px: 2.25, pt: 1.5, gap: 1.5 }}>
        <Box sx={{ flex: '0 0 30%' }}>
          <Box sx={{ fontSize: 7, color: muted, letterSpacing: '.08em' }}>ДЛЯ</Box>
          <Box sx={{ fontWeight: 700, fontSize: 11 }}>{sample.client}</Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={hl('pdf.introText')}>{intro}</Box>
          {pdf.vatNotice.trim() && (
            <Box sx={{ fontWeight: 600, ...hl('pdf.vatNotice') }}>{pdf.vatNotice}</Box>
          )}
        </Box>
      </Stack>

      <Stack
        direction="row"
        sx={{ mx: 2.25, mt: 1.5, pt: 1.25, gap: 1.25, borderTop: `1px solid ${line}` }}
      >
        <Box sx={{ width: 64, height: 82, flex: 'none', bgcolor: '#F7F5F2' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontWeight: 700, fontSize: 11 }}>
            <Box component="span" sx={{ color: accentText, mr: 0.75 }}>
              01
            </Box>
            Куртка робоча, твіл
          </Box>
          <Box sx={{ fontSize: 7.5, color: muted }}>Код MOD-1</Box>
          <Box sx={{ fontSize: 8.5 }}>Опис моделі з картки товару.</Box>
          <Stack direction="row" sx={{ mt: 0.75, border: `1px solid ${line}` }}>
            {prices.map((price) => (
              <Box key={price.label} sx={{ flex: 1, px: 0.75, py: 0.5 }}>
                <Box sx={{ fontSize: 7, color: muted }}>{price.label}</Box>
                <Box sx={{ fontWeight: 700 }}>{price.value}</Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      {hasCta && (
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
            <Box
              sx={{ fontSize: 10.5, fontWeight: 700, color: accentOnDark, ...hl('pdf.ctaTitle') }}
            >
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
      )}

      <Box sx={{ flex: 1 }} />
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
    </Box>
  );
}
