import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { Box, IconButton, Typography } from '@mui/material';

import { MediaFolderMenu } from './media-folder-menu';
import { MediaFolderRow } from './media-folder-row';

import type { MediaFolderAction } from './media-folder-menu';
import type { MediaFolderNode } from '@admin/media/model';

interface Props {
  tree: readonly MediaFolderNode[];
  /** Null means «Усі фото». */
  selectedId: number | null;
  expandedIds: ReadonlySet<number>;
  /** Photos in the whole library; null until known. */
  totalCount: number | null;
  onSelect: (id: number | null) => void;
  onToggle: (id: number) => void;
  onAction: (action: MediaFolderAction, node: MediaFolderNode) => void;
}

/** Folder tree of the photo library: «Усі фото», then folders with their photo counts. */
export function MediaFolderTree({
  tree,
  selectedId,
  expandedIds,
  totalCount,
  onSelect,
  onToggle,
  onAction,
}: Props) {
  const renderNodes = (nodes: readonly MediaFolderNode[]) => (
    <Box component="ul" role="group" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {nodes.map((node) => {
        const expanded = expandedIds.has(node.folder.id);
        const hasChildren = node.children.length > 0;
        return (
          <Box component="li" key={node.folder.id}>
            <MediaFolderRow
              label={node.folder.name}
              count={node.totalCount}
              depth={node.depth - 1}
              selected={selectedId === node.folder.id}
              icon={<FolderOutlinedIcon fontSize="small" />}
              expander={
                hasChildren ? (
                  <IconButton
                    size="small"
                    aria-label={`${expanded ? 'Згорнути' : 'Розгорнути'} «${node.folder.name}»`}
                    aria-expanded={expanded}
                    onClick={() => onToggle(node.folder.id)}
                  >
                    {expanded ? (
                      <ExpandMoreIcon fontSize="small" />
                    ) : (
                      <ChevronRightIcon fontSize="small" />
                    )}
                  </IconButton>
                ) : null
              }
              menu={<MediaFolderMenu node={node} onAction={onAction} />}
              onClick={() => onSelect(node.folder.id)}
            />
            {hasChildren && expanded && renderNodes(node.children)}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box component="nav" aria-label="Папки фото">
      <MediaFolderRow
        label="Усі фото"
        count={totalCount}
        depth={0}
        selected={selectedId === null}
        icon={<PhotoLibraryOutlinedIcon fontSize="small" />}
        onClick={() => onSelect(null)}
      />
      {tree.length > 0 ? (
        renderNodes(tree)
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1.5, py: 1 }}>
          Папок ще немає.
        </Typography>
      )}
    </Box>
  );
}
