import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Alert, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { useRef, useState } from 'react';

import type { PurchaseFileNotice } from '../../hooks/documents/use-purchase-file-actions';
import type { PurchaseInvoiceLink } from '@admin/purchasing/model';

interface Props {
  link: PurchaseInvoiceLink;
  busy: string | null;
  notice: PurchaseFileNotice | null;
  onFix: (link: PurchaseInvoiceLink) => void;
  onRecognize: (link: PurchaseInvoiceLink) => void;
  onTemplate: (link: PurchaseInvoiceLink) => void;
  onUpload: (link: PurchaseInvoiceLink, file: File) => void;
}

/** «Виправити» and «Розпізнати» under one original; the JSON file way lives in «⋯». */
export function PurchaseFileActions({
  link,
  busy,
  notice,
  onFix,
  onRecognize,
  onTemplate,
  onUpload,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const working = busy === link.id;
  const tried = Boolean(link.document || link.recognition);

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          size="small"
          variant={link.document ? 'outlined' : 'contained'}
          startIcon={<EditOutlinedIcon />}
          disabled={busy !== null}
          onClick={() => onFix(link)}
        >
          {link.document ? 'Виправити' : 'Заповнити вручну'}
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={busy !== null}
          onClick={() => onRecognize(link)}
        >
          {working ? 'Зачекайте…' : tried ? 'Розпізнати знову' : 'Розпізнати'}
        </Button>
        <IconButton
          size="small"
          aria-label="Інші дії з оригіналом"
          disabled={busy !== null}
          onClick={(event) => setMenu(event.currentTarget)}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
          <MenuItem
            onClick={() => {
              setMenu(null);
              onTemplate(link);
            }}
          >
            Завантажити JSON-файл даних
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenu(null);
              input.current?.click();
            }}
          >
            Відправити JSON-файл
          </MenuItem>
        </Menu>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          hidden
          aria-label="Файл JSON"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) onUpload(link, file);
          }}
        />
      </Stack>
      {notice?.fileId === link.id && (
        <Alert severity={notice.ok ? 'success' : 'warning'}>{notice.text}</Alert>
      )}
    </Stack>
  );
}
