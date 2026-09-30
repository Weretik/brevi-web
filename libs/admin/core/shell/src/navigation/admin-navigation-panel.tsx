import { Box } from '@mui/material';

import { AdminNavigation } from './admin-navigation';

import type { AdminNavigationGroup } from '../shell.types';

interface AdminNavigationPanelProps {
  groups: readonly AdminNavigationGroup[];
  mobile: boolean;
  onNavigate?: () => void;
}

export function AdminNavigationPanel({ groups, mobile, onNavigate }: AdminNavigationPanelProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ alignItems: 'center', display: 'flex', minHeight: 80, px: 2.5 }}>
        <Box
          alt="Brevi"
          component="img"
          src="/assets/logo/brevi-logo-light.png"
          sx={{ height: 'auto', maxHeight: 56, maxWidth: 148, objectFit: 'contain' }}
        />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 2,
          display: 'flex',
          gap: 1.5,
          mx: 2,
          mb: 1.5,
          px: 1.25,
          py: 1,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            alignItems: 'center',
            bgcolor: 'primary.main',
            borderRadius: 1.5,
            color: 'primary.contrastText',
            display: 'flex',
            fontSize: 19,
            fontWeight: 800,
            height: 42,
            justifyContent: 'center',
            width: 42,
          }}
        >
          B
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ color: '#aeb0bd', fontSize: 12, lineHeight: 1.3 }}>Робочий простір</Box>
          <Box sx={{ color: '#f5f5f5', fontSize: 15, fontWeight: 700 }}>Адміністрування</Box>
        </Box>
      </Box>
      <AdminNavigation
        ariaLabel={mobile ? 'Мобільна навігація' : 'Основна навігація'}
        groups={groups}
        onNavigate={onNavigate}
      />
    </Box>
  );
}
