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

import type { ReactNode } from 'react';

interface Props {
  titleId: string;
  title: string;
  description: string;
  formId: string;
  paperWidth: number;
  readOnly: boolean;
  saving: boolean;
  saveDisabled?: boolean;
  children: ReactNode;
  onClose: () => void;
  onEdit: () => void;
  onSubmit: () => void | Promise<void>;
}

export function ReferenceEditorDrawer({
  titleId,
  title,
  description,
  formId,
  paperWidth,
  readOnly,
  saving,
  saveDisabled = false,
  children,
  onClose,
  onEdit,
  onSubmit,
}: Props) {
  return (
    <Drawer
      anchor="right"
      open
      onClose={() => {
        if (!saving) onClose();
      }}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          sx: {
            width: { xs: '100%', sm: paperWidth },
            maxWidth: '100vw',
            bgcolor: 'background.default',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
        <Stack
          component="header"
          direction="row"
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 3, py: 2.5 }}
        >
          <Box>
            <Typography id={titleId} component="h2" variant="h6">
              {title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          </Box>
          <IconButton aria-label="Закрити панель" disabled={saving} onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />

        <Box
          component="form"
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit();
          }}
          sx={{ flex: 1, overflowY: 'auto', p: 3 }}
        >
          {children}
        </Box>

        <Divider />
        <Stack
          component="footer"
          direction="row"
          sx={{ justifyContent: 'flex-end', gap: 1, px: 3, py: 2 }}
        >
          <Button type="button" onClick={onClose} disabled={saving}>
            {readOnly ? 'Закрити' : 'Скасувати'}
          </Button>
          {readOnly ? (
            <Button key="edit" type="button" variant="contained" onClick={onEdit}>
              Редагувати
            </Button>
          ) : (
            <Button
              key="save"
              variant="contained"
              type="submit"
              form={formId}
              disabled={saving || saveDisabled}
            >
              {saving && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
              Зберегти
            </Button>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
