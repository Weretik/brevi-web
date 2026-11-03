import { MediaFolderForm } from '@admin/media/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert } from '@mui/material';

import type { useMediaFolderEditor } from '../../hooks/folders/use-media-folder-editor';

interface Props {
  editor: ReturnType<typeof useMediaFolderEditor>;
}

export function MediaFolderDrawer({ editor }: Props) {
  const { mode } = editor;
  if (!mode) return null;
  const creating = mode.kind === 'create';
  return (
    <ReferenceEditorDrawer
      titleId="media-folder-drawer-title"
      title={mode.kind === 'create' ? 'Нова папка' : `Папка «${mode.node.folder.name}»`}
      description={
        creating
          ? 'Папки лише впорядковують фото, файли на CDN не переїжджають.'
          : 'Змініть назву або оберіть, у якій папці вона лежить.'
      }
      formId="media-folder-form"
      paperWidth={440}
      readOnly={false}
      saving={editor.saving}
      saveDisabled={Boolean(editor.parentError)}
      onClose={editor.close}
      onEdit={() => undefined}
      onSubmit={editor.submit}
    >
      {editor.saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {editor.saveError}
        </Alert>
      )}
      <MediaFolderForm
        draft={editor.draft}
        parentOptions={editor.parentOptions}
        nameError={editor.nameError}
        parentError={editor.parentError}
        disabled={editor.saving}
        onChange={editor.change}
      />
    </ReferenceEditorDrawer>
  );
}
