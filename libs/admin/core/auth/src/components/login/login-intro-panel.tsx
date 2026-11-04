import { getNavigationPalette } from '@admin/core/shell';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import { Box, Stack, Typography } from '@mui/material';

const features = [
  { icon: Inventory2OutlinedIcon, label: 'Товари, тканини та ціни' },
  { icon: RequestQuoteOutlinedIcon, label: 'Клієнти, розрахунки та КП' },
  { icon: NotificationsNoneOutlinedIcon, label: 'Нагадування в Telegram' },
] as const;

/** The dark left side of the login page: where you are signing in and what is inside. */
export function LoginIntroPanel() {
  return (
    <Box
      component="section"
      aria-label="Про Brevi Office"
      sx={(theme) => {
        const palette = getNavigationPalette(theme);
        return {
          bgcolor: palette.background,
          color: palette.text,
          display: { xs: 'none', md: 'flex' },
          flex: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          px: 8,
          py: 7,
          width: { md: 440, lg: 560 },
        };
      }}
    >
      <Box
        alt="Brevi"
        component="img"
        src="/assets/logo/brevi-logo-light.png"
        sx={{ display: 'block', height: 'auto', width: 131 }}
      />
      <Stack spacing={2.5}>
        <Typography
          sx={{
            color: 'primary.main',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 13,
            letterSpacing: '0.08em',
          }}
        >
          OFFICE.BREVI.COM.UA
        </Typography>
        <Typography component="p" sx={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>
          Brevi Office
        </Typography>
        <Typography
          sx={(theme) => ({
            color: getNavigationPalette(theme).textMuted,
            fontSize: 18,
            lineHeight: 1.5,
            maxWidth: 400,
          })}
        >
          Робочий кабінет команди Brevi: власне пошиття і засоби захисту.
        </Typography>
        <Stack component="ul" spacing={1.75} sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0 }}>
          {features.map(({ icon: Icon, label }) => (
            <Stack
              component="li"
              direction="row"
              key={label}
              spacing={1.5}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={(theme) => ({
                  alignItems: 'center',
                  bgcolor: getNavigationPalette(theme).hover,
                  borderRadius: 2,
                  display: 'flex',
                  height: 32,
                  justifyContent: 'center',
                  width: 32,
                })}
              >
                <Icon aria-hidden fontSize="small" sx={{ color: 'primary.main' }} />
              </Box>
              <Typography sx={{ fontSize: 15 }}>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Typography sx={(theme) => ({ color: getNavigationPalette(theme).textMuted, fontSize: 13 })}>
        Полтава · pp.brevi@gmail.com
      </Typography>
    </Box>
  );
}
