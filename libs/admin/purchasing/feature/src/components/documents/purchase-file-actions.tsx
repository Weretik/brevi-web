import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Button, Stack } from '@mui/material';

import type { PurchaseFileNotice } from '../../hooks/documents/use-purchase-file-actions';
import type { PurchaseInvoiceLink } from '@admin/purchasing/model';

interface Props {
  link: PurchaseInvoiceLink;
  busy: string | null;
  notice: PurchaseFileNotice | null;
  onFix: (link: PurchaseInvoiceLink) => void;
  onRecognize: (link: PurchaseInvoiceLink) => void;
}

/** «Виправити» (or «Заповнити вручну») and «Розпізнати» under one original. */
export function PurchaseFileActions({ link, busy, notice, onFix, onRecognize }: Props) {
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
      </Stack>
      {notice?.fileId === link.id && (
        <Alert severity={notice.ok ? 'success' : 'warning'}>{notice.text}</Alert>
      )}
    </Stack>
  );
}
