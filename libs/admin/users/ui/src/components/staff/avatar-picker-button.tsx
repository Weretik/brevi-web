import { avatarAcceptedTypes } from '@admin/users/model';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { Button } from '@mui/material';

import type { ChangeEvent, ReactNode } from 'react';

interface AvatarPickerButtonProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  children?: ReactNode;
}

/** Opens the file picker for a photo; the caller checks the file. */
export function AvatarPickerButton({
  children = 'Завантажити фото',
  disabled = false,
  onFileSelected,
}: AvatarPickerButtonProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still fires a change.
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  return (
    <Button
      component="label"
      disabled={disabled}
      startIcon={<PhotoCameraOutlinedIcon />}
      variant="outlined"
    >
      {children}
      <input accept={avatarAcceptedTypes.join(',')} hidden onChange={handleChange} type="file" />
    </Button>
  );
}
