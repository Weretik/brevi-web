import { integer, list, nullableInteger, nonEmptyText, record } from '../validators/media-response';

import type { MediaFolder } from '@admin/media/model';

export function mapMediaFolder(value: unknown): MediaFolder {
  const row = record(value, 'папка');
  return {
    id: integer(row['id'], 'id папки', 1),
    name: nonEmptyText(row['name'], 'назва папки'),
    parentId: nullableInteger(row['parentId'], 'батьківська папка', 1),
    fileCount: integer(row['fileCount'], 'кількість фото'),
  };
}

export function mapMediaFolders(value: unknown): MediaFolder[] {
  return list(value, 'список папок').map(mapMediaFolder);
}
