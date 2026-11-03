import { ReferenceFilterChip, ReferenceFilterRow } from '@admin/references/ui';
import { Link } from '@mui/material';

import type { MediaFolderNode } from '@admin/media/model';

interface Props {
  selectedNode: MediaFolderNode | null;
  includeSubfolders: boolean;
  found: number;
  total: number;
  selectedCount: number;
  canSelectAll: boolean;
  onIncludeSubfolders: (value: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

/** Filter row under the search: subfolder switch for an open folder, select all, counters. */
export function MediaLibraryFilters({
  selectedNode,
  includeSubfolders,
  found,
  total,
  selectedCount,
  canSelectAll,
  onIncludeSubfolders,
  onSelectAll,
  onClearSelection,
}: Props) {
  return (
    <ReferenceFilterRow
      countLabel="Кількість фото"
      count={found}
      total={total}
      selectedCount={selectedCount}
      onClearSelection={onClearSelection}
      filters={
        <>
          {selectedNode && (
            <>
              <ReferenceFilterChip
                label="З підпапками"
                count={selectedNode.totalCount}
                selected={includeSubfolders}
                onClick={() => onIncludeSubfolders(true)}
              />
              <ReferenceFilterChip
                label="Лише ця папка"
                count={selectedNode.folder.fileCount}
                selected={!includeSubfolders}
                onClick={() => onIncludeSubfolders(false)}
              />
            </>
          )}
          {canSelectAll && (
            <Link component="button" type="button" variant="body2" onClick={onSelectAll}>
              Вибрати всі на сторінці
            </Link>
          )}
        </>
      }
    />
  );
}
