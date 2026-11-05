import { PurchaseInvoicesTable } from '@admin/purchasing/ui';
import {
  ReferenceFilterChip,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useState } from 'react';

import { usePurchaseInvoiceList } from '../../hooks/invoices/use-purchase-invoice-list';
import { usePurchaseInvoiceSync } from '../../hooks/invoices/use-purchase-invoice-sync';

import type { ReactNode } from 'react';

interface Props {
  /** Tabs of the «Контрагенти» page, shown above the header. */
  tabs?: ReactNode;
}

const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/**
 * «Контрагенти → Рахунки на закупку»: messages of the Google sheet «финансы», refreshed daily
 * and by «Оновити зараз». Read-only in this stage; only problems are marked.
 */
export function PurchaseInvoicesContent({ tabs }: Props) {
  const state = usePurchaseInvoiceList();
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const { sync, syncing, syncState } = usePurchaseInvoiceSync((text, ok) =>
    setNotice({ text, ok }),
  );
  const { list } = state;
  const page = list.currentData;
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
          <Button
            variant="outlined"
            startIcon={<SyncOutlinedIcon />}
            disabled={syncing}
            onClick={() => void sync()}
          >
            {syncing ? 'Оновлення…' : 'Оновити зараз'}
          </Button>
        }
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
              label="Потребують перевірки"
              count={state.counts.NeedsReview}
              selected={state.filter === 'NeedsReview'}
              onClick={() => state.setFilter('NeedsReview')}
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
          narrowed={Boolean(state.search) || state.filter !== 'All'}
          unavailable={Boolean(list.error)}
          onPageChange={state.setPage}
        />
      </Paper>
    </Box>
  );
}
