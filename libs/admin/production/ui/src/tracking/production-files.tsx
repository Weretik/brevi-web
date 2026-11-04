import { productionFileKindLabels, productionFileKinds } from '@admin/production/model';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import { useRef, useState } from 'react';

import type { ProductionFileKind, ProductionOrderFile } from '@admin/production/model';

interface Props {
  /** For screen readers: «Файли завдання» or «Файли: Куртка». */
  label: string;
  files: ProductionOrderFile[];
  onUpload?: (kind: ProductionFileKind, file: File) => void;
  onDelete?: (file: ProductionOrderFile) => void;
  busy?: boolean;
}

const size = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} МБ`
    : `${Math.max(1, Math.round(bytes / 1024))} КБ`;

/** Files of the order or one item: open, add with its kind, delete. */
export function ProductionFiles({ label, files, onUpload, onDelete, busy = false }: Props) {
  const button = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [kind, setKind] = useState<ProductionFileKind>('Sizes');

  function choose(next: ProductionFileKind) {
    setKind(next);
    setMenuOpen(false);
    input.current?.click();
  }

  return (
    <Stack sx={{ gap: 0.5, alignItems: 'flex-start' }}>
      {files.length > 0 && (
        <List dense disablePadding aria-label={label} sx={{ alignSelf: 'stretch' }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              disableGutters
              secondaryAction={
                onDelete && (
                  <IconButton
                    edge="end"
                    size="small"
                    disabled={busy}
                    aria-label={`Видалити файл ${file.name}`}
                    onClick={() => onDelete(file)}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Link href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </Link>
                }
                secondary={[
                  productionFileKindLabels[file.kind],
                  file.isOldLink ? 'Google Drive' : size(file.bytes),
                  file.createdByName,
                ].join(' · ')}
              />
            </ListItem>
          ))}
        </List>
      )}
      {onUpload && (
        <>
          <Button
            ref={button}
            size="small"
            startIcon={<AttachFileIcon />}
            disabled={busy}
            aria-haspopup="menu"
            onClick={() => setMenuOpen(true)}
          >
            Додати файл
          </Button>
          <Menu anchorEl={button.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
            {productionFileKinds.map((value) => (
              <MenuItem key={value} onClick={() => choose(value)}>
                {productionFileKindLabels[value]}
              </MenuItem>
            ))}
          </Menu>
          <input
            ref={input}
            type="file"
            hidden
            aria-label={`${label}: ${productionFileKindLabels[kind]}`}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onUpload(kind, file);
            }}
          />
        </>
      )}
    </Stack>
  );
}
