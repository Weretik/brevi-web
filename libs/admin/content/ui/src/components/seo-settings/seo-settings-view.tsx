import { Box, Stack, Typography } from '@mui/material';

import { SettingsCard, SettingsChangedLine } from '../settings-card/settings-card';

import type { SeoSettings, SitePicture } from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', wordBreak: 'break-all' } as const;

/** The size social networks need for a large link preview. */
export const sharingPictureMinSize = { width: 1200, height: 630 } as const;

/** A short problem note when the sharing picture is too small for a large preview; null when it fits. */
export function sharingPictureProblem(picture: SitePicture): string | null {
  const { width, height } = picture;
  if (width === null || height === null) return null;
  if (width >= sharingPictureMinSize.width && height >= sharingPictureMinSize.height) return null;
  return `Замале фото (${width} × ${height}): месенджери покажуть маленьку картинку. Потрібно щонайменше ${sharingPictureMinSize.width} × ${sharingPictureMinSize.height}.`;
}

function ServiceCode({
  name,
  purpose,
  value,
}: {
  name: string;
  purpose: string;
  value: string | null;
}) {
  return (
    <Stack
      sx={{ gap: 0.5, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1, minWidth: 0 }}
    >
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="caption" color="text.secondary">
        {purpose}
      </Typography>
      {value ? (
        <Typography variant="body1" sx={{ ...mono, mt: 0.5 }}>
          {value}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Не вказано
        </Typography>
      )}
    </Stack>
  );
}

/**
 * Read view of «Налаштування SEO сайту»: the four service codes as tiles across the page, and on the right
 * how a shared link looks with the sharing picture.
 */
export function SeoSettingsView({ settings }: { settings: SeoSettings }) {
  const picture = settings.defaultOgImage;
  const problem = picture ? sharingPictureProblem(picture) : null;
  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
        }}
      >
        <SettingsCard title="Коди сервісів">
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <ServiceCode
              name="Google Analytics 4"
              purpose="Рахує відвідувачів і заявки з сайту."
              value={settings.googleAnalyticsId}
            />
            <ServiceCode
              name="Google Tag Manager"
              purpose="Підключає аналітику й інші коди без зміни сайту."
              value={settings.googleTagManagerId}
            />
            <ServiceCode
              name="Google Search Console"
              purpose="Підтверджує, що сайт ваш, щоб бачити його в пошуку Google."
              value={settings.googleSiteVerification}
            />
            <ServiceCode
              name="Bing Webmaster"
              purpose="Те саме для пошуку Bing."
              value={settings.bingSiteVerification}
            />
          </Box>
        </SettingsCard>
        <SettingsCard title="Фото для поширення">
          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Так виглядає посилання в Telegram, Viber чи Facebook, коли сторінка не має власного
              фото.
            </Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              {picture ? (
                <Box
                  component="img"
                  src={picture.url}
                  alt="Фото для поширення"
                  sx={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '1.91 / 1',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    aspectRatio: '1.91 / 1',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'action.hover',
                    px: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Не обрано: посилання поширюються без картинки.
                  </Typography>
                </Box>
              )}
              <Stack sx={{ p: 1.5, gap: 0.25 }}>
                <Typography variant="caption" color="text.secondary" sx={mono}>
                  brevi.com.ua
                </Typography>
                <Typography variant="subtitle2">Назва сторінки</Typography>
              </Stack>
            </Box>
            {problem && (
              <Typography variant="body2" color="warning.dark">
                {problem}
              </Typography>
            )}
          </Stack>
        </SettingsCard>
      </Box>
      <SettingsChangedLine at={settings.updatedAtUtc} by={settings.updatedBy} />
    </Stack>
  );
}
