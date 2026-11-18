import { Box, Stack, Typography } from '@mui/material';

import { QuoteSettingsField } from '../../form/quote-settings-field';
import { QuoteSettingsGrid, QuoteSettingsGroup, errorsAt } from '../../form/quote-settings-layout';

import type { QuoteImageFieldRender } from '../../form/quote-settings-layout';
import type {
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

interface Props {
  introduction: QuoteIntroductionDraft;
  saved: QuoteIntroductionDraft;
  errors: QuoteSettingsErrors;
  imageField: QuoteImageFieldRender;
  modelField: QuoteModelFieldRender;
  onChange: (patch: Partial<QuoteIntroductionDraft>) => void;
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

/** «Сезони»: the banner, title and main model of the summer and winter pages. */
export function QuoteIntroSeasonFields({
  introduction,
  saved,
  errors,
  imageField,
  modelField,
  onChange,
}: Props) {
  const at = errorsAt(errors, 'introduction');
  return (
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
                hint: '1600×640 px, JPG. Без банера PDF бере вбудований.',
                upload: true,
                value: introduction[season.bannerKey],
                error: at(season.bannerKey),
                onChange: (value) => onChange({ [season.bannerKey]: value }),
              })}
              <QuoteSettingsField
                path={`introduction.${season.titleKey}`}
                label={`Заголовок — ${season.title.toLowerCase()}`}
                helperText="Слово в *зірочках* буде помаранчевим."
                value={introduction[season.titleKey]}
                saved={saved[season.titleKey]}
                error={at(season.titleKey)}
                onChange={(value) => onChange({ [season.titleKey]: value })}
              />
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
  );
}
