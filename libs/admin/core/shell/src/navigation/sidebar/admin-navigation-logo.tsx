import { Box } from '@mui/material';

interface AdminNavigationLogoProps {
  collapsed: boolean;
}

/** The wordmark; when collapsed only its round "b" mark stays visible. */
export function AdminNavigationLogo({ collapsed }: AdminNavigationLogoProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flex: 'none',
        height: 68,
        overflow: 'hidden',
        px: 3,
      }}
    >
      <Box
        sx={(theme) => ({
          overflow: 'hidden',
          transition: theme.transitions.create('width', {
            duration: theme.transitions.duration.complex,
          }),
          width: collapsed ? 32 : 104,
        })}
      >
        <Box
          alt="Brevi"
          component="img"
          src="/assets/logo/brevi-logo-light.png"
          sx={{ display: 'block', height: 'auto', width: 104 }}
        />
      </Box>
    </Box>
  );
}
