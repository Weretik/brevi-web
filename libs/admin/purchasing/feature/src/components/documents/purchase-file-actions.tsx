import { Alert, Button, Stack } from '@mui/material';
import { useRef } from 'react';

import type { PurchaseFileNotice } from '../../hooks/documents/use-purchase-file-actions';
import type { PurchaseInvoiceLink } from '@admin/purchasing/model';

interface Props {
  link: PurchaseInvoiceLink;
  busy: string | null;
  notice: PurchaseFileNotice | null;
  onRecognize: (link: PurchaseInvoiceLink) => void;
  onTemplate: (link: PurchaseInvoiceLink) => void;
  onUpload: (link: PurchaseInvoiceLink, file: File) => void;
}

/** Buttons under one original: read it by AI again, or check the facts by hand as JSON. */
export function PurchaseFileActions({
  link,
  busy,
  notice,
  onRecognize,
  onTemplate,
  onUpload,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const working = busy === link.id;
  const tried = Boolean(link.document || link.recognition);

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          disabled={busy !== null}
          onClick={() => onRecognize(link)}
        >
          {working ? 'Зачекайте…' : tried ? 'Розпізнати знову' : 'Розпізнати'}
        </Button>
        <Button size="small" disabled={busy !== null} onClick={() => onTemplate(link)}>
          Шаблон JSON
        </Button>
        <Button size="small" disabled={busy !== null} onClick={() => input.current?.click()}>
          Завантажити JSON
        </Button>
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
