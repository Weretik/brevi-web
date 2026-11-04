import { MediaPickerDrawer } from '@admin/media/feature';
import { quoteSettingsUrlMax } from '@admin/quotes/model';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
  label: string;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
}

/** A picture of the КП: a link (https) or a photo from the library, with a small preview. */
export function QuoteImageField({ label, value, error, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const preview = !error && value.trim().startsWith('https://') ? value.trim() : null;
  return (
    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start', minWidth: 0 }}>
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
        fullWidth
        size="small"
        label={label}
        value={value}
        error={Boolean(error)}
        helperText={error ?? 'Посилання https:// або фото з бібліотеки.'}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ htmlInput: { maxLength: quoteSettingsUrlMax } }}
      />
      <Button
        variant="outlined"
        startIcon={<AddPhotoAlternateOutlinedIcon />}
        onClick={() => setOpen(true)}
        sx={{ flexShrink: 0 }}
        aria-label={`${label}: вибрати фото`}
      >
        Фото
      </Button>
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
