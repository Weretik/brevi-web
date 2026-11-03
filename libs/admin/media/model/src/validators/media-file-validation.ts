import { normalizeMediaName } from './media-folder-validation';
import {
  MEDIA_ALLOWED_TYPES,
  MEDIA_ALT_MAX_LENGTH,
  MEDIA_FILE_NAME_MAX_LENGTH,
  MEDIA_MAX_FILE_SIZE_BYTES,
} from '../entities/media-file';

import type { MediaFileDraft } from '../entities/media-file';

export function validateMediaUpload(file: Pick<File, 'type' | 'size'>): string | null {
  if (!(MEDIA_ALLOWED_TYPES as readonly string[]).includes(file.type))
    return 'Підтримуються лише JPEG, PNG і WebP.';
  if (file.size === 0) return 'Файл порожній.';
  if (file.size > MEDIA_MAX_FILE_SIZE_BYTES) return 'Розмір фото не повинен перевищувати 15 МБ.';
  return null;
}

export type MediaFileDraftErrors = Partial<Record<keyof MediaFileDraft, string>>;

export function validateMediaFileDraft(draft: MediaFileDraft): MediaFileDraftErrors {
  const errors: MediaFileDraftErrors = {};
  const fileName = normalizeMediaName(draft.fileName);
  if (!fileName) errors.fileName = 'Вкажіть назву фото.';
  else if (fileName.length > MEDIA_FILE_NAME_MAX_LENGTH)
    errors.fileName = `Назва не довша за ${MEDIA_FILE_NAME_MAX_LENGTH} символів.`;
  else if (/[/\\]/.test(fileName)) errors.fileName = 'Назва не може містити / або \\.';
  if (draft.alt.trim().length > MEDIA_ALT_MAX_LENGTH)
    errors.alt = `Опис не довший за ${MEDIA_ALT_MAX_LENGTH} символів.`;
  return errors;
}
