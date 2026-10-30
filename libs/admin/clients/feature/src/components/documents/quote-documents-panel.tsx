import { QuotePdfActions, QuoteReadyChecklist } from '@admin/clients/ui';
import { Alert, Stack } from '@mui/material';

import { QuoteDeliveryPanel } from './delivery/quote-delivery-panel';
import { QuoteProductionPanel } from './production/quote-production-panel';
import { useQuoteDocuments } from '../../hooks/documents/use-quote-documents';

import type { QuoteDetail } from '@admin/clients/model';

export function QuoteDocumentsPanel({
  detail,
  disabled,
  hasUnsavedChanges,
  onAccepted,
  onLock,
}: {
  detail: QuoteDetail;
  disabled: boolean;
  hasUnsavedChanges: boolean;
  onAccepted: (value: QuoteDetail) => void;
  onLock: (pending: boolean, uncertain: boolean) => void;
}) {
  const documents = useQuoteDocuments(detail, disabled, onAccepted, onLock);
  return (
    <Stack spacing={2}>
      <QuoteReadyChecklist
        quote={detail}
        issuer={documents.availability}
        hasUnsavedChanges={hasUnsavedChanges}
        disabled={disabled || !detail.canEdit}
        busy={documents.busy}
        error={documents.error}
        onPrepare={documents.prepareReady}
      />
      {detail.state !== 'draft' && (
        <QuotePdfActions
          artifact={documents.artifact}
          canRequest={detail.state === 'ready' && !detail.archived}
          disabled={disabled}
          busy={documents.busy}
          error={documents.error}
          onRender={documents.renderPdf}
          onRefresh={documents.refresh}
          onDownload={documents.download}
        />
      )}
      <QuoteDeliveryPanel
        key={`delivery-${detail.publicId}-${detail.versionId}-${detail.ownerId}`}
        detail={detail}
        pdf={documents.artifact}
        disabled={disabled}
        onLock={onLock}
      />
      <QuoteProductionPanel
        key={`production-${detail.publicId}-${detail.versionId}-${detail.ownerId}`}
        detail={detail}
        disabled={disabled}
        onLock={onLock}
      />
      {documents.availability === 'error' && (
        <Alert severity="warning">Реквізити продавця недоступні. Оновіть сторінку.</Alert>
      )}
    </Stack>
  );
}
