/** Same limit as the backend (MediaFolderTree.MaxDepth). */
export const MEDIA_FOLDER_MAX_DEPTH = 8;
export const MEDIA_FOLDER_NAME_MAX_LENGTH = 120;

/** A folder of the photo library. Folders are virtual: CDN files never move. */
export interface MediaFolder {
  id: number;
  name: string;
  parentId: number | null;
  /** Photos directly in this folder, without subfolders. */
  fileCount: number;
}

export interface MediaFolderDraft {
  name: string;
  parentId: number | null;
}
