import { MediaFileDetails, MediaFileForm } from '@admin/media/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert } from '@mui/material';

import type { useMediaFileEditor } from '../../hooks/files/use-media-file-editor';
import type { MediaFolderOption } from '@admin/media/model';

interface Props {
  editor: ReturnType<typeof useMediaFileEditor>;
  folderOptions: readonly MediaFolderOption[];
  pathOf: (folderId: number | null) => string;
  onCopyUrl: (url: string) => void;
}

/** View a photo with its usages, or edit its name, alt text and folder. */
export function MediaFileDrawer({ editor, folderOptions, pathOf, onCopyUrl }: Props) {
  const { file, draft } = editor;
  if (!file) return null;
  return (
    <ReferenceEditorDrawer
      titleId="media-file-drawer-title"
      title={draft ? 'Редагувати фото' : file.fileName}
      description={draft ? file.fileName : pathOf(file.folderId)}
      formId="media-file-form"
      paperWidth={480}
      readOnly={!draft}
      saving={editor.saving}
      onClose={editor.close}
      onEdit={editor.edit}
      onSubmit={editor.submit}
    >
      {editor.saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {editor.saveError}
        </Alert>
      )}
      {draft ? (
        <MediaFileForm
          draft={draft}
          errors={editor.errors}
          folderOptions={folderOptions}
          disabled={editor.saving}
          onChange={editor.change}
        />
      ) : (
        <>
          {editor.usagesError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {editor.usagesError}
            </Alert>
          )}
          <MediaFileDetails
            file={file}
            folderPath={pathOf(file.folderId)}
            usages={editor.usagesError ? [] : editor.usages}
            onCopyUrl={onCopyUrl}
          />
        </>
      )}
    </ReferenceEditorDrawer>
  );
}
