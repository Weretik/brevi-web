import { useGetMediaFileQuery, useUpdateMediaFileMutation } from '@admin/media/data-access';
import { validateMediaFileDraft } from '@admin/media/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { MediaFile, MediaFileDraft, MediaFileDraftErrors } from '@admin/media/model';

const toDraft = (file: MediaFile): MediaFileDraft => ({
  fileName: file.fileName,
  alt: file.alt ?? '',
  folderId: file.folderId,
});

/** Side panel of one photo: view with usages, then «Редагувати» for name, alt and folder. */
export function useMediaFileEditor(onSaved: (message: string) => void) {
  const [file, setFile] = useState<MediaFile | null>(null);
  const [draft, setDraft] = useState<MediaFileDraft | null>(null);
  const [errors, setErrors] = useState<MediaFileDraftErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updateMediaFile, updateState] = useUpdateMediaFileMutation();
  const detail = useGetMediaFileQuery(file?.id ?? 0, { skip: !file });

  async function submit() {
    if (!file || !draft) return;
    const found = validateMediaFileDraft(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaveError(null);
    try {
      await updateMediaFile({ id: file.id, draft }).unwrap();
      onSaved('Фото збережено.');
      setFile(null);
      setDraft(null);
    } catch (cause) {
      setSaveError(adminApiErrorMessage(cause, 'Не вдалося зберегти фото.'));
    }
  }

  return {
    file: detail.currentData?.file ?? file,
    usages: detail.currentData?.usages ?? null,
    usagesError: detail.error
      ? adminApiErrorMessage(detail.error, 'Не вдалося перевірити, де використовується фото.')
      : null,
    draft,
    errors,
    saveError,
    saving: updateState.isLoading,
    open: (next: MediaFile) => {
      setFile(next);
      setDraft(null);
      setErrors({});
      setSaveError(null);
    },
    edit: () => {
      const current = detail.currentData?.file ?? file;
      if (current) setDraft(toDraft(current));
    },
    change: (next: MediaFileDraft) => {
      setDraft(next);
      setErrors({});
    },
    close: () => {
      setFile(null);
      setDraft(null);
    },
    submit,
  };
}
