import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { lazy, Suspense } from 'react';

const TimesheetPage = lazy(() => import('../../pages/timesheet/timesheet-page'));

interface Props {
  open: boolean;
  onClose: () => void;
}

/** «Відмітити день»: the hours of a day (with «8 год усім») in a side panel over the month. */
export function TimesheetDrawer({ open, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          'aria-labelledby': 'timesheet-drawer-title',
          sx: { width: { xs: '100%', md: 760 }, maxWidth: '100%' },
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography id="timesheet-drawer-title" variant="h6" component="h2">
          Відмітити день
        </Typography>
        <IconButton aria-label="Закрити" onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ p: 2, overflowY: 'auto' }}>
        <Suspense fallback={null}>
          <TimesheetPage />
        </Suspense>
      </Box>
    </Drawer>
  );
}
