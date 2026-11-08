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

const tileBand = '#ECEBE8';
const tileBody = '#F8F7F5';

/** The example model: two fabric variants, the second one recommended. */
const fabrics = [
  {
    name: 'Тканина «Грета»',
    details: '65% ПЕ / 35% бавовна · 210 г/м²',
    tiles: [
      { label: 'Ціна за 1 шт.', value: '1 180 грн' },
      { label: 'до 40 шт.', value: '1 120 грн' },
      { label: 'від 41 шт.', value: '1 050 грн' },
    ],
    recommended: false,
  },
  {
    name: 'Тканина «Балтика»',
    details: '80% ПЕ / 20% бавовна · 240 г/м²',
    tiles: [
      { label: 'Ціна за 1 шт.', value: '1 290 грн' },
      { label: 'від 41 шт.', value: '1 160 грн' },
    ],
    recommended: true,
  },
];

/** An empty field means the server's standard text; the sketch says so instead of guessing it. */
function Standard({ text, marks }: { text: string; marks: QuoteSettingsPreviewSample['marks'] }) {
  return text.trim() ? (
    <QuoteMarkedText text={text} marks={marks} />
  ) : (
    <Box component="span" sx={{ fontStyle: 'italic', color: muted }}>
      стандартний текст
    </Box>
  );
}

/** A sketch of the first КП page with the example data; the real PDF is drawn by the server. */
export function QuotePdfPreview({ draft, sample, focused }: Props) {
  const { company, pdf } = draft;
  const { labels } = pdf;
  const hl = (...paths: string[]) => previewHighlight(focused, ...paths);
  const site = sample.marks['{site}'];
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
          <Box sx={hl('pdf.intros.')}>
            <Standard text={pdf.intros.oneSewing} marks={sample.marks} />
          </Box>
          {pdf.vatNotice.trim() && (
            <Box sx={{ fontWeight: 600, ...hl('pdf.vatNotice') }}>{pdf.vatNotice}</Box>
          )}
          <Box sx={{ fontSize: 8, color: muted, ...hl('pdf.labels.contactLine', 'staff:') }}>
            <Standard text={labels.contactLine} marks={sample.marks} />
          </Box>
        </Box>
      </Stack>

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
              <Standard text={labels.siteLink} marks={sample.marks} />
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
          <Standard text={labels.fabricsTitle} marks={sample.marks} />
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
                  <Standard text={labels.recommended} marks={sample.marks} />
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
