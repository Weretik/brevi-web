import { MEDIA_FOLDER_MAX_DEPTH, MEDIA_FOLDER_NAME_MAX_LENGTH } from '../entities/media-folder';

import type { MediaFolderDraft } from '../entities/media-folder';
import type { MediaFolderNode, MediaFolderOption } from '../mappers/media-folder-tree';

/** Same rule as the backend: trimmed, single spaces, no slashes. */
export function normalizeMediaName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateMediaFolderName(value: string): string | null {
  const name = normalizeMediaName(value);
  if (!name) return 'Вкажіть назву папки.';
  if (name.length > MEDIA_FOLDER_NAME_MAX_LENGTH)
    return `Назва папки не довша за ${MEDIA_FOLDER_NAME_MAX_LENGTH} символів.`;
  if (/[/\\]/.test(name)) return 'Назва не може містити / або \\.';
  return null;
}

/**
 * Checks the parent choice: the folder (with its subfolders) must still fit into the depth limit.
 * `folder` is the edited folder, or null for a new one.
 */
export function validateMediaFolderParent(
  draft: MediaFolderDraft,
  folder: MediaFolderNode | null,
  options: readonly MediaFolderOption[],
  subtreeHeight: number,
): string | null {
  const parentDepth =
    draft.parentId === null
      ? 0
      : (options.find((option) => option.id === draft.parentId)?.depth ?? null);
  if (parentDepth === null) return 'Оберіть іншу батьківську папку.';
  const height = folder ? subtreeHeight : 1;
  if (parentDepth + height > MEDIA_FOLDER_MAX_DEPTH)
    return `Можна створити не більше ${MEDIA_FOLDER_MAX_DEPTH} рівнів папок.`;
  return null;
}
