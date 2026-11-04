import {
  useChangeMyEmailMutation,
  useChangeMyNameMutation,
  useChangeMyPasswordMutation,
  useChangeMyPhoneMutation,
  useRemoveMyAvatarMutation,
  useUploadMyAvatarMutation,
} from '@admin/users/data-access';
import { useState } from 'react';

import { getProfileErrorMessage } from '../errors/profile-error-message';
import { checkAvatarFile } from '../model/check-avatar-file';

import type { OwnEmailChange, OwnPasswordChange, ProfileField } from '@admin/users/ui';

/**
 * Own-profile changes. Each side panel sends its change and shows the server error; after a change
 * the shell re-reads the session so the header shows the new name or photo.
 */
export function useProfileActions(
  onProfileChanged: () => Promise<void>,
  onSuccess: (message: string) => void,
) {
  const [changeName, nameState] = useChangeMyNameMutation();
  const [changePhone, phoneState] = useChangeMyPhoneMutation();
  const [changeEmail, emailState] = useChangeMyEmailMutation();
  const [changePassword, passwordState] = useChangeMyPasswordMutation();
  const [uploadAvatar, uploadState] = useUploadMyAvatarMutation();
  const [removeAvatar, removeState] = useRemoveMyAvatarMutation();

  const [panel, setPanel] = useState<ProfileField | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // The change is already saved; a failed session refresh only delays the header update.
  const refreshHeader = () => onProfileChanged().catch(() => undefined);

  const save = async (
    run: () => Promise<unknown>,
    message: string,
    refresh = true,
  ): Promise<boolean> => {
    try {
      await run();
      setError(null);
      if (refresh) await refreshHeader();
      onSuccess(message);
      return true;
    } catch (saveError) {
      setError(getProfileErrorMessage(saveError));
      return false;
    }
  };

  const openPanel = (field: ProfileField) => {
    setError(null);
    setPanel(field);
  };

  const close = () => {
    setPanel(null);
    setConfirmRemove(false);
    setError(null);
  };

  const chooseAvatar = async (file: File) => {
    const fileError = await checkAvatarFile(file);
    setPhotoError(fileError ?? null);
    if (fileError) return;

    try {
      await uploadAvatar(file).unwrap();
      await refreshHeader();
      onSuccess('Фото оновлено.');
    } catch (uploadError) {
      setPhotoError(getProfileErrorMessage(uploadError));
    }
  };

  const requestRemoveAvatar = () => {
    setPhotoError(null);
    setError(null);
    setConfirmRemove(true);
  };

  const confirmRemoveAvatar = async () => {
    if (await save(() => removeAvatar().unwrap(), 'Фото видалено.')) setConfirmRemove(false);
  };

  return {
    chooseAvatar: (file: File) => void chooseAvatar(file),
    close,
    confirmRemove,
    confirmRemoveAvatar: () => void confirmRemoveAvatar(),
    error,
    openPanel,
    panel,
    photoError,
    removing: removeState.isLoading,
    requestRemoveAvatar,
    submitEmail: (change: OwnEmailChange) =>
      save(() => changeEmail(change).unwrap(), 'Email змінено.'),
    submitName: (fullName: string) => save(() => changeName(fullName).unwrap(), 'Імʼя змінено.'),
    submitPassword: (change: OwnPasswordChange) =>
      save(() => changePassword(change).unwrap(), 'Пароль змінено.', false),
    submitPhone: (phone: string) => save(() => changePhone(phone).unwrap(), 'Телефон змінено.'),
    submitting:
      nameState.isLoading ||
      phoneState.isLoading ||
      emailState.isLoading ||
      passwordState.isLoading,
    uploading: uploadState.isLoading,
  };
}
