import { Box, Stack, Typography } from '@mui/material';

import { QuoteAdvantagesList } from './quote-advantages-list';
import { QuoteColorField } from '../form/quote-color-field';
import { QuoteSettingsField } from '../form/quote-settings-field';
import { QuoteSettingsGroup, QuoteSettingsGrid, errorsAt } from '../form/quote-settings-layout';

import type { QuoteImageFieldRender } from '../form/quote-settings-layout';
import type {
  QuoteAdvantageDraft,
  QuoteIntroSeason,
  QuoteIntroductionDraft,
  QuoteSettingsErrors,
} from '@admin/quotes/model';
import type { ReactNode } from 'react';

/** The main model of a season page: the page picks it from the Catalog by name. */
export type QuoteModelFieldRender = (field: {
  season: QuoteIntroSeason;
  label: string;
  value: string;
  error: string | undefined;
  onChange: (code: string) => void;
}) => ReactNode;

type TextKey = Exclude<keyof QuoteIntroductionDraft, 'advantages'>;

interface Props {
  introduction: QuoteIntroductionDraft;
  saved: QuoteIntroductionDraft;
  errors: QuoteSettingsErrors;
  imageField: QuoteImageFieldRender;
  modelField: QuoteModelFieldRender;
  onChange: (patch: Partial<QuoteIntroductionDraft>) => void;
  onAdvantageChange: (index: number, patch: Partial<QuoteAdvantageDraft>) => void;
  onAdvantageMove: (from: number, to: number) => void;
}

const seasons = [
  {
    season: 'Summer',
    title: 'Літо',
    titleKey: 'summerTitle',
    bannerKey: 'summerBannerUrl',
    codeKey: 'summerMainCode',
  },
  {
    season: 'Winter',
    title: 'Зима',
    titleKey: 'winterTitle',
    bannerKey: 'winterBannerUrl',
    codeKey: 'winterMainCode',
  },
] as const;

const texts: { key: TextKey; label: string; multiline?: boolean; wide?: boolean }[] = [
  { key: 'subtitle', label: 'Підзаголовок', multiline: true, wide: true },
  { key: 'modelsTitle', label: 'Заголовок блоку моделей' },
  { key: 'productButtonText', label: 'Текст кнопки товару' },
  { key: 'assortmentLinkText', label: 'Текст посилання на асортимент' },
  { key: 'assortmentUrl', label: 'Посилання на асортимент' },
  { key: 'nextStepText', label: 'Наступний крок', multiline: true, wide: true },
];

/** «КП для знайомства»: look, the two season pages, «Переваги» and the remaining texts. */
export function QuoteIntroductionSection({
  introduction,
  saved,
  errors,
  imageField,
  modelField,
  onChange,
  onAdvantageChange,
  onAdvantageMove,
}: Props) {
  const at = errorsAt(errors, 'introduction');
  const text = (key: TextKey, label: string, options: { multiline?: boolean; wide?: boolean }) => (
    <QuoteSettingsField
      key={key}
      path={`introduction.${key}`}
      label={label}
      {...options}
      value={introduction[key]}
      saved={saved[key]}
      error={at(key)}
      onChange={(value) => onChange({ [key]: value })}
    />
  );
  return (
    <>
      <QuoteSettingsGroup title="Вигляд">
        <QuoteSettingsGrid>
          <QuoteColorField
            label="Колір акценту"
            path="introduction.accentColor"
            value={introduction.accentColor}
            error={at('accentColor')}
            onChange={(accentColor) => onChange({ accentColor })}
          />
          {text('logoText', 'Текст біля логотипа', {})}
        </QuoteSettingsGrid>
      </QuoteSettingsGroup>

      <QuoteSettingsGroup title="Сезони">
        <QuoteSettingsGrid>
          {seasons.map((season) => (
            <Box
              key={season.season}
              component="fieldset"
              sx={{ m: 0, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1, minWidth: 0 }}
            >
              <Typography component="legend" sx={{ fontWeight: 700, px: 0.5 }}>
                {season.title}
              </Typography>
              <Stack sx={{ gap: 1.5 }}>
                {imageField({
                  label: `Банер — ${season.title.toLowerCase()}`,
                  value: introduction[season.bannerKey],
                  error: at(season.bannerKey),
                  onChange: (value) => onChange({ [season.bannerKey]: value }),
                })}
                {text(season.titleKey, `Заголовок — ${season.title.toLowerCase()}`, {})}
                {modelField({
                  season: season.season,
                  label: `Головна модель — ${season.title.toLowerCase()}`,
                  value: introduction[season.codeKey],
                  error: at(season.codeKey),
                  onChange: (code) => onChange({ [season.codeKey]: code }),
                })}
              </Stack>
            </Box>
          ))}
        </QuoteSettingsGrid>
      </QuoteSettingsGroup>

      <QuoteSettingsGroup title="Переваги">
        <QuoteAdvantagesList
          advantages={introduction.advantages}
          saved={saved.advantages}
          errors={errors}
          onChange={onAdvantageChange}
          onMove={onAdvantageMove}
        />
      </QuoteSettingsGroup>

      <QuoteSettingsGroup title="Тексти і посилання">
        <QuoteSettingsGrid>
          {texts.map(({ key, label, ...options }) => text(key, label, options))}
        </QuoteSettingsGrid>
      </QuoteSettingsGroup>
    </>
  );
}
