import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';

/** «Додати з медіатеки» and «Завантажити» of the photos tab. */
export function ProductPhotosToolbar({
  busy,
  onPick,
  onUpload,
}: {
  busy: boolean;
  onPick: () => void;
  onUpload: (files: File[]) => void;
}) {
  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button
        variant="contained"
        startIcon={<AddPhotoAlternateOutlinedIcon />}
        disabled={busy}
        onClick={onPick}
      >
        Додати з медіатеки
      </Button>
      <Button
        component="label"
        variant="outlined"
        startIcon={<FileUploadOutlinedIcon />}
        disabled={busy}
      >
        Завантажити
        <input
          hidden
          multiple
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Завантажити фото товару"
          onChange={(event) => {
            onUpload(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
      </Button>
      {busy && <CircularProgress size={20} aria-label="Збереження фото" />}
      <Typography variant="body2" color="text.secondary">
        Головне фото показується в списку товарів і в КП.
      </Typography>
    </Stack>
  );
}
