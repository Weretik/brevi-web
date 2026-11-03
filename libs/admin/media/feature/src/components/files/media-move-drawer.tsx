import { MediaFolderSelect } from '@admin/media/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Typography } from '@mui/material';

import type { useMediaMove } from '../../hooks/files/use-media-move';
import type { MediaFolderOption } from '@admin/media/model';

interface Props {
  move: ReturnType<typeof useMediaMove>;
  folderOptions: readonly MediaFolderOption[];
}

export function MediaMoveDrawer({ move, folderOptions }: Props) {
  if (!move.fileIds) return null;
  return (
    <ReferenceEditorDrawer
      titleId="media-move-drawer-title"
      title="Перемістити фото"
      description={`Вибрано фото: ${move.fileIds.length}.`}
      formId="media-move-form"
      paperWidth={440}
      readOnly={false}
      saving={move.saving}
      onClose={move.close}
      onEdit={() => undefined}
      onSubmit={async () => {
        await move.submit();
      }}
    >
      {move.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {move.error}
        </Alert>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Посилання на фото не зміняться: товари й сайт продовжать їх показувати.
      </Typography>
      <MediaFolderSelect
        label="Куди перемістити"
        value={move.folderId}
        options={folderOptions}
        emptyLabel="Без папки"
        disabled={move.saving}
        onChange={move.setFolderId}
      />
    </ReferenceEditorDrawer>
  );
}
