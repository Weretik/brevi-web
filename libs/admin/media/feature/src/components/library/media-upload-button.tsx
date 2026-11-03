import { MEDIA_ALLOWED_TYPES } from '@admin/media/model';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Button } from '@mui/material';

interface Props {
  disabled: boolean;
  onFiles: (files: File[]) => void;
}

/** The page's one orange action: choose one or many photos. */
export function MediaUploadButton({ disabled, onFiles }: Props) {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<FileUploadOutlinedIcon />}
      disabled={disabled}
    >
      Завантажити фото
      <input
        hidden
        multiple
        type="file"
        accept={MEDIA_ALLOWED_TYPES.join(',')}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = '';
          if (files.length) onFiles(files);
        }}
      />
    </Button>
  );
}
