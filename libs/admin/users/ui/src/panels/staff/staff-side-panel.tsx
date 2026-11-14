import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useId } from 'react';

import type { FormEvent, ReactNode } from 'react';

interface StaffSidePanelProps {
  open: boolean;
  title: string;
  description: string;
  submitLabel: string;
  submitting: boolean;
  children: ReactNode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/** Right side panel of the «Цех» system for a staff form: header, form, actions at the bottom. */
export function StaffSidePanel({
  open,
  title,
  description,
  submitLabel,
  submitting,
  children,
  onClose,
  onSubmit,
}: StaffSidePanelProps) {
  const titleId = useId();
  const formId = useId();

  return (
    <Drawer
      anchor="right"
      onClose={() => {
        if (!submitting) onClose();
      }}
      open={open}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          sx: { bgcolor: 'background.default', maxWidth: '100vw', width: { xs: '100%', sm: 440 } },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <Stack
          component="header"
          direction="row"
          sx={{ alignItems: 'flex-start', gap: 2, justifyContent: 'space-between', px: 3, py: 2.5 }}
        >
          <Box>
            <Typography component="h2" id={titleId} variant="h6">
              {title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          </Box>
          <IconButton
            aria-label="Закрити панель"
            disabled={submitting}
            edge="end"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Box
          component="form"
          id={formId}
          noValidate
          onSubmit={onSubmit}
          sx={{ flex: 1, overflowY: 'auto', p: 3 }}
        >
          {children}
        </Box>
        <Divider />
        <Stack
          component="footer"
          direction="row"
          sx={{ gap: 1, justifyContent: 'flex-end', px: 3, py: 2 }}
        >
          <Button disabled={submitting} onClick={onClose} type="button">
            Скасувати
          </Button>
          <Button disabled={submitting} form={formId} type="submit" variant="contained">
            {submitting && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
            {submitLabel}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
