import { QuoteDeliveryForm, QuoteDeliveryHistory } from '@admin/clients/ui';
import { Alert, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';

import { useQuoteDelivery } from '../../../hooks/documents/delivery/use-quote-delivery';

import type { QuoteDetail, QuotePdfView } from '@admin/clients/model';

export function QuoteDeliveryPanel({
  detail,
  pdf,
  disabled,
  onLock,
}: {
  detail: QuoteDetail;
  pdf: QuotePdfView | null;
  disabled: boolean;
  onLock: (pending: boolean, uncertain: boolean) => void;
}) {
  const state = useQuoteDelivery(detail, pdf, disabled, onLock);
  const active = state.displayTemplate;
  return (
    <Stack spacing={2} component="section" aria-label="Надсилання КП">
      <Typography variant="h6">Надсилання та історія</Typography>
      {state.action.forbidden ? (
        <Alert severity="error">Доступ до КП втрачено. Оновіть список.</Alert>
      ) : (
        <>
          {state.template.isLoading && (
            <CircularProgress size={20} aria-label="Завантаження шаблону листа" />
          )}
          {state.template.isError && (
            <Alert
              severity="error"
              action={<Button onClick={() => void state.template.refetch()}>Повторити</Button>}
            >
              Шаблон листа недоступний.
            </Alert>
          )}
          {!state.template.isLoading && !state.template.isError && !active && (
            <Alert severity="warning">
              Немає активного шаблону листа. Адміністратор має створити та активувати його.
            </Alert>
          )}
          {pdf?.status !== 'succeeded' && (
            <Alert severity="info">Спочатку створіть готовий PDF цієї версії КП.</Alert>
          )}
          <QuoteDeliveryForm
            quoteLabel={`КП ${detail.number ?? ''}, версія ${detail.versionNumber}`}
            pdfHash={pdf?.status === 'succeeded' ? pdf.sha256 : null}
            templateLabel={active ? `${active.label} · версія ${active.number}` : null}
            recipient={state.recipient}
            manager={state.manager}
            locked={state.fieldsLocked}
            canSend={state.canSend}
            onRecipient={state.setRecipient}
            onManager={state.setManager}
            onSend={state.send}
          />
          {state.accepted && (
            <Alert severity={state.accepted.state === 'succeeded' ? 'success' : 'info'}>
              {state.accepted.state === 'succeeded'
                ? 'Прийняття листа підтверджено провайдером. Оновіть стан КП із сервера.'
                : state.accepted.state === 'unknown'
                  ? 'Результат надсилання невідомий. Очікуйте перевірки в історії.'
                  : state.accepted.state === 'failed'
                    ? 'Спроба завершилася без підтвердження надсилання.'
                    : state.accepted.state === 'queued'
                      ? 'Лист поставлено в чергу. Це ще не підтвердження надсилання.'
                      : 'Сервер обробляє попередню спробу. Перевіряйте історію надсилань.'}
            </Alert>
          )}
          {state.action.error && <Alert severity="error">{state.action.error}</Alert>}
          {state.action.uncertain && (
            <Button
              type="button"
              disabled={state.action.pending}
              onClick={() => void state.action.execute()}
            >
              Повторити той самий запит
            </Button>
          )}
          {state.history.isLoading && (
            <CircularProgress size={20} aria-label="Завантаження історії надсилань" />
          )}
          {state.history.isError && <Alert severity="error">Історія надсилань недоступна.</Alert>}
          {!state.history.isError && state.history.currentData && (
            <>
              <QuoteDeliveryHistory
                rows={state.history.currentData.rows}
                currentVersionId={detail.versionId}
              />
              {state.history.currentData.totalPages > 1 && (
                <Pagination
                  count={state.history.currentData.totalPages}
                  page={state.page}
                  onChange={(_event, page) => state.setPage(page)}
                  getItemAriaLabel={(type, page) =>
                    type === 'next'
                      ? 'Наступна сторінка надсилань'
                      : type === 'previous'
                        ? 'Попередня сторінка надсилань'
                        : `Сторінка надсилань ${page ?? ''}`
                  }
                />
              )}
            </>
          )}
          <Button
            type="button"
            disabled={state.history.isFetching}
            onClick={() => void state.history.refetch()}
          >
            Оновити історію надсилань
          </Button>
        </>
      )}
    </Stack>
  );
}
