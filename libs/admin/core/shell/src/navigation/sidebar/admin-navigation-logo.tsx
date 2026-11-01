import { Box } from '@mui/material';

interface AdminNavigationLogoProps {
  collapsed: boolean;
}

/** The full wordmark; when collapsed, only the round "b" mark without the «brevi» text. */
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
      {collapsed ? (
        <Box
          alt="Brevi"
          component="img"
          src="/assets/logo/brevi-mark-light.png"
          sx={{ display: 'block', height: 32, width: 32 }}
        />
      ) : (
        <Box
          alt="Brevi"
          component="img"
          src="/assets/logo/brevi-logo-light.png"
          sx={{ display: 'block', height: 'auto', width: 104 }}
        />
      )}
    </Box>
  );
}
