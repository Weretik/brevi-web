import { PurchaseInvoiceNarrowing, PurchaseInvoicesTable } from '@admin/purchasing/ui';
import {
  ReferenceFilterChip,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Alert, Box, Button, Paper, Stack } from '@mui/material';
import { useState } from 'react';

import { PurchaseInvoiceRowDetails } from './purchase-invoice-row-details';
import { usePurchaseFileActions } from '../../hooks/documents/use-purchase-file-actions';
import { usePurchaseRecognitionBatch } from '../../hooks/documents/use-purchase-recognition-batch';
import { usePurchaseInvoiceList } from '../../hooks/invoices/use-purchase-invoice-list';
import { usePurchaseInvoiceSync } from '../../hooks/invoices/use-purchase-invoice-sync';
import { PurchaseDocumentEditor } from '../documents/purchase-document-editor';
import { PurchaseFileActions } from '../documents/purchase-file-actions';
import { PurchaseInvoiceDrawer } from '../review/purchase-invoice-drawer';

import type { PurchaseInvoice, PurchaseInvoiceLink } from '@admin/purchasing/model';
import type { ReactNode } from 'react';

interface Props {
  /** Tabs of the «Контрагенти» page, shown above the header. */
  tabs?: ReactNode;
}

const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/**
 * «Контрагенти → Рахунки на закупку»: messages of the Google sheet «финансы», refreshed daily
 * and by «Оновити зараз». «Розпізнати всі нові» reads new originals by AI in batches; only
 * problems are marked.
 */
export function PurchaseInvoicesContent({ tabs }: Props) {
  const state = usePurchaseInvoiceList();
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [openedRow, setOpenedRow] = useState<PurchaseInvoice | null>(null);
  const { sync, syncing, syncState } = usePurchaseInvoiceSync((text, ok) =>
    setNotice({ text, ok }),
  );
  const batch = usePurchaseRecognitionBatch((text, ok) => setNotice({ text, ok }));
  const files = usePurchaseFileActions();
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
      {tabs}
      <ReferencePageHeader
        title="Рахунки на закупку"
        subtitle={
          lastSuccess ? (
            <>
              Повідомлення з Google-таблиці «финансы» оновлюються щодня. Останнє оновлення:{' '}
              <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                {formatTime(lastSuccess)}
              </Box>
            </>
          ) : (
            'Повідомлення з Google-таблиці «финансы». Реєстр ще не оновлювався.'
          )
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {batch.running ? (
              <Button variant="outlined" color="warning" onClick={batch.stop}>
                Зупинити
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AutoAwesomeOutlinedIcon />}
                disabled={syncing}
                onClick={() => void batch.start()}
              >
                Розпізнати всі нові
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<SyncOutlinedIcon />}
              disabled={syncing || batch.running}
              onClick={() => void sync()}
            >
              {syncing ? 'Оновлення…' : 'Оновити зараз'}
            </Button>
          </Stack>
        }
      />
      {batch.running && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {batch.progress ?? 'Розпізнавання оригіналів…'}
        </Alert>
      )}
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
      <ReferenceFilterRow
        filters={
          <>
            <ReferenceFilterChip
              label="Усі"
              count={state.counts.All}
              selected={state.filter === 'All'}
              onClick={() => state.setFilter('All')}
            />
            <ReferenceFilterChip
              label="Помилки і перевірка"
              count={state.counts.NeedsReview}
              selected={state.filter === 'NeedsReview'}
              onClick={() => state.setFilter('NeedsReview')}
            />
            <ReferenceFilterChip
              label="Без постачальника"
              count={state.counts.WithoutSupplier}
              selected={state.filter === 'WithoutSupplier'}
              onClick={() => state.setFilter('WithoutSupplier')}
            />
            <ReferenceFilterChip
              label="Не розпізнані"
              count={state.counts.NotRecognized}
              selected={state.filter === 'NotRecognized'}
              onClick={() => state.setFilter('NotRecognized')}
            />
          </>
        }
        count={page?.total ?? 0}
        total={state.counts[state.filter]}
        countLabel="Кількість рахунків"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
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
