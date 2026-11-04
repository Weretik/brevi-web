import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Fade, Stack, Typography } from '@mui/material';

interface Props {
  open: boolean;
  /** Where the photos go, for example «Товари / Сумки» or «Уся бібліотека». */
  target: string;
}

/** Full-screen hint while photos are dragged over the page. */
export function MediaDropOverlay({ open, target }: Props) {
  return (
    <Fade in={open} unmountOnExit>
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          p: { xs: 2, sm: 4 },
          bgcolor: 'rgba(0, 0, 0, 0.45)',
          pointerEvents: 'none',
        }}
      >
        <Stack
          sx={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            border: 3,
            borderStyle: 'dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            bgcolor: 'background.paper',
            textAlign: 'center',
            px: 2,
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 72, color: 'primary.main' }} />
          <Typography variant="h5" component="p">
            Відпустіть фото, щоб завантажити
          </Typography>
          <Typography color="text.secondary">
            Куди: {target}. JPEG, PNG або WebP до 15 МБ, можна кілька.
          </Typography>
        </Stack>
      </Box>
    </Fade>
  );
}
