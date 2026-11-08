import { useUploadMediaFileMutation } from '@admin/media/data-access';
import { MediaPickerDrawer } from '@admin/media/feature';
import { quoteSettingsUrlMax } from '@admin/quotes/model';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';

interface Props {
  label: string;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
  /** What the picture should be, under the field. */
  hint?: string;
  /** Shows «Завантажити»: the file goes to the photo library and its link into the field. */
  upload?: boolean;
}

const messageOf = (error: unknown) =>
  (error as { message?: string } | undefined)?.message ?? 'Не вдалося завантажити фото.';

/** A picture of the КП: a link (https), a photo from the library or a file from the computer, with a preview. */
export function QuoteImageField({ label, value, error, onChange, hint, upload }: Props) {
  const [open, setOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFile, uploading] = useUploadMediaFileMutation();
  const input = useRef<HTMLInputElement | null>(null);
  const preview = !error && value.trim().startsWith('https://') ? value.trim() : null;

  const send = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    try {
      const saved = await uploadFile({ file, folderId: null }).unwrap();
      onChange(saved.publicUrl);
    } catch (failure) {
      setUploadError(messageOf(failure));
    }
  };

  const problem = error ?? uploadError ?? undefined;
  return (
    <Stack
      direction="row"
      sx={{ gap: 1.5, alignItems: 'flex-start', minWidth: 0, flexWrap: 'wrap' }}
    >
      <Box
        sx={{
          width: 72,
          height: 48,
          flexShrink: 0,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
          backgroundImage: preview ? `url("${preview}")` : undefined,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <TextField
        size="small"
        label={label}
        value={value}
        error={Boolean(problem)}
        helperText={problem ?? hint ?? 'Посилання https:// або фото з бібліотеки.'}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ htmlInput: { maxLength: quoteSettingsUrlMax } }}
        sx={{ flex: '1 1 220px', minWidth: 0 }}
      />
      <Stack direction="row" sx={{ gap: 1, flexShrink: 0 }}>
        {upload && (
          <>
            <Button
              variant="outlined"
              startIcon={<FileUploadOutlinedIcon />}
              loading={uploading.isLoading}
              onClick={() => input.current?.click()}
              aria-label={`${label}: завантажити файл`}
            >
              Завантажити
            </Button>
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              data-testid={`${label}: файл`}
              onChange={(event) => {
                void send(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </>
        )}
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          onClick={() => setOpen(true)}
          aria-label={`${label}: вибрати фото`}
        >
          Фото
        </Button>
      </Stack>
      {open && (
        <MediaPickerDrawer
          alreadyAddedIds={[]}
          onClose={() => setOpen(false)}
          onPick={(files) => {
            setOpen(false);
            const file = files[0];
            if (file) onChange(file.publicUrl);
          }}
        />
      )}
    </Stack>
  );
}
