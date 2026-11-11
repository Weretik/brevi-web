import { Box, Stack, Typography } from '@mui/material';

import type { SeoSettings } from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', wordBreak: 'break-all' } as const;

function Code({ label, value }: { label: string; value: string | null }) {
  return (
    <Stack sx={{ gap: 0.25 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {value ? (
        <Typography variant="body2" sx={mono}>
          {value}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Не вказано
        </Typography>
      )}
    </Stack>
  );
}

/** Read view of «Налаштування SEO сайту»: the codes on the site and the sharing picture. */
export function SeoSettingsView({ settings }: { settings: SeoSettings }) {
  const picture = settings.defaultOgImage;
  return (
    <Stack sx={{ gap: 2 }}>
      <Code label="Google Analytics 4" value={settings.googleAnalyticsId} />
      <Code label="Google Tag Manager" value={settings.googleTagManagerId} />
      <Code label="Підтвердження Google Search Console" value={settings.googleSiteVerification} />
      <Code label="Підтвердження Bing Webmaster" value={settings.bingSiteVerification} />
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Фото для поширення
        </Typography>
        {picture ? (
          <Box
            component="img"
            src={picture.url}
            alt="Фото для поширення"
            sx={{
              width: 240,
              maxWidth: '100%',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Не обрано: сторінки без власного фото поширюються без картинки.
          </Typography>
        )}
      </Stack>
      {settings.updatedAtUtc && (
        <Typography variant="caption" color="text.secondary">
          Змінено {new Date(settings.updatedAtUtc).toLocaleString('uk-UA')}
          {settings.updatedBy ? ` · ${settings.updatedBy}` : ''}
        </Typography>
      )}
    </Stack>
  );
}
