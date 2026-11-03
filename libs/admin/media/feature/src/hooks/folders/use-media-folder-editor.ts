import {
  useCreateMediaFolderMutation,
  useUpdateMediaFolderMutation,
} from '@admin/media/data-access';
import {
  mediaFolderOptions,
  mediaFolderSubtreeHeight,
  validateMediaFolderName,
  validateMediaFolderParent,
} from '@admin/media/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { MediaFolder, MediaFolderDraft, MediaFolderNode } from '@admin/media/model';

type Mode = { kind: 'create' } | { kind: 'edit'; node: MediaFolderNode };

/** Side panel for a folder: create (optionally inside a parent) or rename and move. */
export function useMediaFolderEditor(
  tree: readonly MediaFolderNode[],
  onSaved: (folder: MediaFolder, message: string) => void,
) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [draft, setDraft] = useState<MediaFolderDraft>({ name: '', parentId: null });
  const [touched, setTouched] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createFolder, createState] = useCreateMediaFolderMutation();
  const [updateFolder, updateState] = useUpdateMediaFolderMutation();

  const editedNode = mode?.kind === 'edit' ? mode.node : null;
  // A folder cannot move into itself or its subfolders, so those are not offered.
  const parentOptions = mediaFolderOptions(tree, editedNode?.folder.id ?? null);
  const nameError = touched ? validateMediaFolderName(draft.name) : null;
  const parentError = validateMediaFolderParent(
    draft,
    editedNode,
    parentOptions,
    editedNode ? mediaFolderSubtreeHeight(editedNode) : 1,
  );

  async function submit() {
    setTouched(true);
    if (validateMediaFolderName(draft.name) || parentError || !mode) return;
    setSaveError(null);
    try {
      const saved =
        mode.kind === 'create'
          ? await createFolder(draft).unwrap()
          : await updateFolder({ id: mode.node.folder.id, draft }).unwrap();
      onSaved(
        saved,
        mode.kind === 'create' ? `Папку «${saved.name}» створено.` : 'Папку збережено.',
      );
      setMode(null);
    } catch (cause) {
      setSaveError(adminApiErrorMessage(cause, 'Не вдалося зберегти папку.'));
    }
  }

  const start = (next: Mode, nextDraft: MediaFolderDraft) => {
    setMode(next);
    setDraft(nextDraft);
    setTouched(false);
    setSaveError(null);
  };

  return {
    mode,
    draft,
    parentOptions,
    nameError,
    parentError,
    saveError,
    saving: createState.isLoading || updateState.isLoading,
    create: (parentId: number | null) => start({ kind: 'create' }, { name: '', parentId }),
    edit: (node: MediaFolderNode) =>
      start({ kind: 'edit', node }, { name: node.folder.name, parentId: node.folder.parentId }),
    change: setDraft,
    close: () => setMode(null),
    submit,
  };
}
