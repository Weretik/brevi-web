import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import type { SeoSettingsErrors, SeoSettingsFormValues } from '@admin/content/model';

interface Props {
  values: SeoSettingsFormValues;
  errors: SeoSettingsErrors;
  disabled: boolean;
  onChange: (values: SeoSettingsFormValues) => void;
  /** Opens the «Фото» library for the sharing picture. */
  onPickPicture: () => void;
}

type CodeKey = keyof SeoSettingsErrors;

const fields: { key: CodeKey; label: string; hint: string }[] = [
  {
    key: 'googleAnalyticsId',
    label: 'Google Analytics 4',
    hint: 'Ідентифікатор потоку даних, наприклад G-AB12CD34EF. Порожньо: аналітика не підключена.',
  },
  {
    key: 'googleTagManagerId',
    label: 'Google Tag Manager',
    hint: 'Ідентифікатор контейнера, наприклад GTM-AB12CD3. Заповнюйте, лише якщо SEO-фахівець працює через Tag Manager.',
  },
  {
    key: 'googleSiteVerification',
    label: 'Підтвердження Google Search Console',
    hint: 'Значення content з мета-тегу google-site-verification. Можна вставити весь мета-тег.',
  },
  {
    key: 'bingSiteVerification',
    label: 'Підтвердження Bing Webmaster',
    hint: 'Значення content з мета-тегу msvalidate.01. Можна вставити весь мета-тег.',
  },
];

/**
 * Codes of «Налаштування SEO сайту»: the site places them on every page. Staff paste what the SEO
 * specialist gets from Google and Bing; the sharing picture comes from the «Фото» library.
 */
export function SeoSettingsForm({ values, errors, disabled, onChange, onPickPicture }: Props) {
  const picture = values.picture;
  return (
    <Stack sx={{ gap: 2 }}>
      {fields.map((field) => (
        <TextField
          key={field.key}
          label={field.label}
          value={values[field.key]}
          disabled={disabled}
          error={Boolean(errors[field.key])}
          helperText={errors[field.key] ?? field.hint}
          slotProps={{ htmlInput: { spellCheck: false, autoComplete: 'off' } }}
          onChange={(event) => onChange({ ...values, [field.key]: event.target.value })}
        />
      ))}
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle2">Фото для поширення</Typography>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Box
            role="img"
            aria-label={picture ? 'Фото для поширення' : 'Фото не обрано'}
            sx={{
              width: 191,
              height: 100,
              flexShrink: 0,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'action.hover',
              backgroundImage: picture?.url ? `url("${picture.url}")` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Stack sx={{ gap: 1, minWidth: 0, flex: '1 1 200px' }}>
            <Typography variant="body2" color="text.secondary">
              Показується, коли посиланням на сторінку без власного фото діляться у месенджерах і
              соцмережах. Найкраще горизонтальне фото 1200 × 630.
            </Typography>
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternateOutlinedIcon />}
                disabled={disabled}
                onClick={onPickPicture}
              >
                {picture ? 'Змінити фото' : 'Обрати фото'}
              </Button>
              {picture && (
                <Button disabled={disabled} onClick={() => onChange({ ...values, picture: null })}>
                  Прибрати
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
