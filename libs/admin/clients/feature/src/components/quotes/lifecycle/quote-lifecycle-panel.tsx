import { Alert, Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuoteArchiveDialog } from './quote-archive-dialog';
import { QuoteCopyDialog } from './quote-copy-dialog';
import { QuoteTransferDialog } from './quote-transfer-dialog';
import { useQuoteLifecycleWrite } from '../../../hooks/quotes/lifecycle/use-quote-lifecycle-write';
import { QuoteRepriceDialog } from '../reprice/quote-reprice-dialog';

import type { QuoteDetail, QuoteLifecycleIntent } from '@admin/clients/model';

export function QuoteLifecyclePanel({
  detail,
  disabled,
  onAccepted,
  onLock,
  onNavigate,
  copyOnly = false,
  selectedVersionId,
  selectedVersionNumber,
  isBlocked,
}: {
  detail: QuoteDetail;
  disabled: boolean;
  onAccepted: (detail: QuoteDetail) => void;
  onLock: (pending: boolean, uncertain: boolean) => void;
  onNavigate: (path: string) => void;
  copyOnly?: boolean;
  selectedVersionId?: string;
  selectedVersionNumber?: number;
  isBlocked?: () => boolean;
}) {
  const navigate = useNavigate();
  const [action, setAction] = useState<QuoteLifecycleIntent['action'] | null>(null);
  const [notice, setNotice] = useState('');
  const intent = useRef<QuoteLifecycleIntent | null>(null);
  const write = useQuoteLifecycleWrite((pending, uncertain) =>
    onLock(pending || action !== null, uncertain),
  );
  const close = () => {
    if (write.pending || write.uncertain) return;
    setAction(null);
    write.clearError();
    onLock(false, false);
  };
  const open = (value: QuoteLifecycleIntent['action']) => {
    if (
      disabled ||
      isBlocked?.() ||
      !detail.canEdit ||
      action !== null ||
      write.pending ||
      write.uncertain
    )
      return;
    setNotice('');
    write.clearError();
    setAction(value);
    onLock(true, false);
  };
  const submit = async (value: QuoteLifecycleIntent) => {
    if (!write.uncertain && (disabled || isBlocked?.() || !detail.canEdit)) return;
    if (!write.uncertain) intent.current = value;
    const original = intent.current;
    if (!original) return;
    const result = await write.run(original);
    if (!result) return;
    setAction(null);
    onLock(false, false);
    if (result === 'accessLost') onNavigate('/crm/quotes?notice=access-changed');
    else if (original.action === 'copy') onNavigate('/crm/quotes/' + result.publicId);
    else if (!result.canEdit) onNavigate('/crm/quotes?notice=transferred');
    else {
      onAccepted(result);
      setNotice(
        original.action === 'reprice'
          ? `Збережено нову версію ${result.versionNumber}.`
          : original.action === 'archive'
            ? result.archived
              ? 'КП архівовано.'
              : 'КП відновлено.'
            : 'Відповідального змінено.',
      );
    }
  };
  const retry = () => {
    if (intent.current) void submit(intent.current);
  };
  const dialog = {
    detail,
    pending: write.pending,
    uncertain: write.uncertain,
    error: write.error,
    onCancel: close,
    onConfirm: (value: QuoteLifecycleIntent) => void submit(value),
    onRetry: retry,
  };
  const unavailable = disabled || write.pending || write.uncertain || action !== null;
  return (
    <Stack spacing={1}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        useFlexGap
        sx={{ flexWrap: 'wrap' }}
      >
        {!copyOnly && (
          <Button
            disabled={unavailable}
            onClick={() => navigate('/crm/quotes/' + detail.publicId + '/history')}
          >
            Історія КП
          </Button>
        )}
        <Button disabled={unavailable || !detail.canEdit} onClick={() => open('copy')}>
          Скопіювати КП
        </Button>
        {!copyOnly && (
          <>
            <Button
              disabled={unavailable || !detail.canEdit || detail.archived}
              onClick={() => open('reprice')}
            >
              Перерахувати ціни
            </Button>
            <Button
              disabled={unavailable || !detail.canEdit || detail.archived}
              onClick={() => open('transfer')}
            >
              Передати КП
            </Button>
            <Button disabled={unavailable || !detail.canEdit} onClick={() => open('archive')}>
              {detail.archived ? 'Відновити КП' : 'Архівувати КП'}
            </Button>
            <Button
              disabled={unavailable}
              onClick={() =>
                navigate('/crm/quotes?sourceQuoteId=' + encodeURIComponent(detail.publicId))
              }
            >
              Показати копії цього КП
            </Button>
          </>
        )}
      </Stack>
      {notice && <Alert severity="success">{notice}</Alert>}
      {disabled && (
        <Alert severity="info">
          Для дій з версією завершіть поточний запис або збережіть чи відкиньте зміни.
        </Alert>
      )}
      {action === 'copy' && (
        <QuoteCopyDialog
          {...dialog}
          versionId={selectedVersionId ?? detail.versionId}
          versionNumber={selectedVersionNumber ?? detail.versionNumber}
        />
      )}
      {action === 'archive' && <QuoteArchiveDialog {...dialog} />}
      {action === 'transfer' && <QuoteTransferDialog {...dialog} />}
      {action === 'reprice' && <QuoteRepriceDialog {...dialog} />}
    </Stack>
  );
}
