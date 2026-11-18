import { PurchaseInvoiceNarrowing, PurchaseInvoicesTable } from '@admin/purchasing/ui';
import { ReferenceListAlerts, ReferenceSearchBar } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { usePageRights } from '@admin/shared/ui';
import { Alert, Box, Paper } from '@mui/material';
import { useState } from 'react';

import { PurchaseInvoiceFilters } from './purchase-invoice-filters';
import { PurchaseInvoiceRowDetails } from './purchase-invoice-row-details';
import { formatTime, PurchaseInvoicesHeader } from './purchase-invoices-header';
import { usePurchaseFileActions } from '../../hooks/documents/use-purchase-file-actions';
import { usePurchaseRecognitionStart } from '../../hooks/documents/use-purchase-recognition-start';
import { usePurchaseInvoiceList } from '../../hooks/invoices/use-purchase-invoice-list';
import { usePurchaseInvoiceSync } from '../../hooks/invoices/use-purchase-invoice-sync';
import { PurchaseDocumentEditor } from '../documents/purchase-document-editor';
import { PurchaseFileActions } from '../documents/purchase-file-actions';
import { PurchaseInvoiceDrawer } from '../review/purchase-invoice-drawer';

import type { PurchaseInvoice, PurchaseInvoiceLink } from '@admin/purchasing/model';

/**
 * «Бухгалтерія → Рахунки на закупку»: messages of the Google sheet «финансы», refreshed daily
 * and by «Оновити зараз». «Розпізнати всі нові» starts the background task that reads new
 * originals by AI; only problems are marked.
 */
export function PurchaseInvoicesContent() {
  const state = usePurchaseInvoiceList();
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [openedRow, setOpenedRow] = useState<PurchaseInvoice | null>(null);
  const { sync, syncing, syncState } = usePurchaseInvoiceSync((text, ok) =>
    setNotice({ text, ok }),
  );
  const recognition = usePurchaseRecognitionStart((text, ok) => setNotice({ text, ok }));
  const files = usePurchaseFileActions();
  // Updating, recognising and reviewing change the register: «Редагування» on «Рахунки на закупку».
  const { canEdit } = usePageRights();
  const [fixing, setFixing] = useState<PurchaseInvoiceLink | null>(null);
  const { list } = state;
  const page = list.currentData;
  // The panel follows the reloaded page, so a new recognition shows at once.
  const opened = openedRow
    ? (page?.items.find((item) => item.messageId === openedRow.messageId) ?? openedRow)
    : null;
  const close = () => setOpenedRow(null);
  const lastSuccess = syncState?.lastSuccessAt;

  return (
    <Box sx={{ minWidth: 0 }}>
      <PurchaseInvoicesHeader
        lastSuccess={lastSuccess}
        canEdit={canEdit}
        syncing={syncing}
        recognition={recognition}
        onSync={() => void sync()}
      />
      {notice && (
        <Alert
          severity={notice.ok ? 'success' : 'error'}
          onClose={() => setNotice(null)}
          sx={{ mb: 2 }}
        >
          {notice.text}
        </Alert>
      )}
      {!notice && syncState?.error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Останнє оновлення
          {syncState.lastAttemptAt ? ` ${formatTime(syncState.lastAttemptAt)}` : ''} не вдалося:{' '}
          {syncState.error}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          list.error ? adminApiErrorMessage(list.error, 'Не вдалося завантажити реєстр.') : null
        }
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <ReferenceSearchBar
        placeholder="Знайти за текстом, чатом, автором або UID"
        label="Пошук рахунків"
        value={state.term}
        onChange={state.setTerm}
      />
      <PurchaseInvoiceNarrowing
        from={state.documentFrom}
        to={state.documentTo}
        vat={state.vat}
        onChange={state.setNarrowing}
      />
      <PurchaseInvoiceFilters state={state} total={page?.total ?? 0} />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <PurchaseInvoicesTable
          page={page}
          loading={list.isFetching}
          narrowed={state.narrowed}
          unavailable={Boolean(list.error)}
          onPageChange={state.setPage}
          renderDetails={(invoice) => (
            <PurchaseInvoiceRowDetails
              invoice={invoice}
              onOpenReview={setOpenedRow}
              renderActions={(link) => (
                <PurchaseFileActions
                  link={link}
                  busy={files.busy}
                  notice={files.notice}
                  onFix={setFixing}
                  onRecognize={(value) => void files.recognize(value)}
                />
              )}
            />
          )}
        />
      </Paper>
      {opened && (
        <PurchaseInvoiceDrawer
          key={opened.messageId}
          invoice={opened}
          onFix={setFixing}
          onClose={close}
          onSaved={(review) => {
            close();
            setNotice({
              text: review.supplierName
                ? `Збережено: постачальник «${review.supplierName}».`
                : 'Збережено.',
              ok: true,
            });
          }}
        />
      )}
      {fixing && (
        <PurchaseDocumentEditor
          key={fixing.id}
          link={fixing}
          onClose={() => setFixing(null)}
          onSaved={(text) => {
            setFixing(null);
            setNotice({ text, ok: true });
          }}
        />
      )}
    </Box>
  );
}
