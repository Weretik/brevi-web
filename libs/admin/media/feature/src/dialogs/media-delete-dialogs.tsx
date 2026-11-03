import { MediaConfirmDeleteDialog } from '@admin/media/ui';

import type { useMediaFileDeletion } from '../hooks/files/use-media-file-deletion';
import type { useMediaFolderDeletion } from '../hooks/folders/use-media-folder-deletion';

interface Props {
  files: ReturnType<typeof useMediaFileDeletion>;
  folder: ReturnType<typeof useMediaFolderDeletion>;
}

/** Confirmations before deleting selected photos or an empty folder. */
export function MediaDeleteDialogs({ files, folder }: Props) {
  const count = files.target?.length ?? 0;
  return (
    <>
      <MediaConfirmDeleteDialog
        title={files.target ? (count === 1 ? 'Видалити фото?' : `Видалити фото (${count})?`) : null}
        text="Фото зникне з бібліотеки і з CDN. Фото, яке використовує товар, не видалиться."
        deleting={files.deleting}
        error={files.error}
        onClose={files.close}
        onConfirm={() => void files.confirm()}
      />
      <MediaConfirmDeleteDialog
        title={folder.target ? `Видалити папку «${folder.target.folder.name}»?` : null}
        text="Папка порожня, фото в ній немає."
        deleting={folder.deleting}
        error={folder.error}
        onClose={folder.close}
        onConfirm={() => void folder.confirm()}
      />
    </>
  );
}
