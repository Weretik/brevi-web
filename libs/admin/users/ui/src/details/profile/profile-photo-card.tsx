import { UserAvatar } from '@admin/shared/ui';
import { avatarRulesHint } from '@admin/users/model';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { ProfileSection } from './profile-section';
import { AvatarPickerButton } from '../../components/avatar-picker-button';

import type { StaffProfile } from '@admin/users/model';

interface ProfilePhotoCardProps {
  profile: StaffProfile;
  /** A problem with the chosen file or the upload. */
  error: string | null;
  uploading: boolean;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

/** Large avatar with upload and remove actions and the photo limits. */
export function ProfilePhotoCard({
  error,
  onFileSelected,
  onRemove,
  profile,
  uploading,
}: ProfilePhotoCardProps) {
  return (
    <ProfileSection title="Фото профілю">
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <UserAvatar
          avatarUrl={profile.avatarUrl}
          email={profile.email}
          name={profile.fullName}
          size={112}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <AvatarPickerButton disabled={uploading} onFileSelected={onFileSelected}>
            {uploading ? <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} /> : null}
            {profile.avatarUrl ? 'Замінити фото' : 'Завантажити фото'}
          </AvatarPickerButton>
          {profile.avatarUrl ? (
            <Button
              color="error"
              disabled={uploading}
              onClick={onRemove}
              startIcon={<DeleteOutlinedIcon />}
            >
              Видалити
            </Button>
          ) : null}
        </Stack>
        <Typography color="text.secondary" variant="caption">
          {avatarRulesHint}
        </Typography>
        {error ? (
          <Alert severity="warning" sx={{ textAlign: 'left', width: '100%' }}>
            {error}
          </Alert>
        ) : null}
      </Stack>
    </ProfileSection>
  );
}
