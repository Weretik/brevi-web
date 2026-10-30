import { QuoteVersionSnapshot, QuoteVersionComparison } from '@admin/clients/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { UnsavedClientDialog } from '../../../components/changes/unsaved-client-dialog';
import { QuoteHistoryEvents } from '../../../components/quotes/history/quote-history-events';
import { QuoteHistoryVersions } from '../../../components/quotes/history/quote-history-versions';
import { QuoteLifecyclePanel } from '../../../components/quotes/lifecycle/quote-lifecycle-panel';
import { quoteError } from '../../../errors/quotes/quote-error';
import { useQuoteHistory } from '../../../hooks/quotes/history/use-quote-history';

export default function QuoteHistoryPage() {
  const {
    quoteId,
    params,
    navigate,
    detail,
    root,
    accessible,
    versionId,
    validVersion,
    versions,
    events,
    snapshot,
    parentId,
    comparison,
    locked,
    setLocked,
    guard,
    change,
    versionPage,
    eventPage,
  } = useQuoteHistory();
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          Історія КП
        </Typography>
        <Button disabled={locked} onClick={() => navigate('/crm/quotes/' + quoteId)}>
          До поточної версії
        </Button>
        {(root.isLoading || (!detail && root.isFetching)) && (
          <CircularProgress aria-label="Завантаження історії КП" />
        )}
        {root.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void root.refetch()}>Повторити</Button>}
          >
            {quoteError(root.error)}
          </Alert>
        )}
        {accessible && detail && (
          <>
            <Typography>
              {detail.draft.recipientName} · {detail.number ?? 'Номер ще не присвоєно'}
            </Typography>
            <QuoteHistoryVersions
              versions={versions}
              versionId={versionId}
              locked={locked}
              change={change}
              versionPage={versionPage}
            />
            {!validVersion && (
              <Alert severity="error">
                Некоректний ідентифікатор версії. Оберіть версію зі списку.
              </Alert>
            )}
            {snapshot.isFetching && (
              <CircularProgress size={24} aria-label="Завантаження збереженої версії" />
            )}
            {snapshot.error && (
              <Alert
                severity="error"
                action={<Button onClick={() => void snapshot.refetch()}>Повторити версію</Button>}
              >
                {quoteError(snapshot.error)}
              </Alert>
            )}
            {snapshot.currentData &&
              snapshot.currentData.publicId === versionId &&
              !snapshot.error &&
              validVersion && (
                <>
                  <QuoteVersionSnapshot version={snapshot.currentData} />
                  {parentId && (
                    <Button disabled={locked} onClick={() => change('compare', 'parent')}>
                      Порівняти з попередньою версією
                    </Button>
                  )}
                  {comparison.isFetching && (
                    <CircularProgress size={24} aria-label="Завантаження порівняння" />
                  )}
                  {comparison.error && (
                    <Alert
                      severity="error"
                      action={
                        <Button onClick={() => void comparison.refetch()}>
                          Повторити порівняння
                        </Button>
                      }
                    >
                      {quoteError(comparison.error)}
                    </Alert>
                  )}
                  {params.get('compare') === 'parent' &&
                    parentId &&
                    comparison.currentData &&
                    comparison.currentData.publicId === parentId &&
                    !comparison.error && (
                      <QuoteVersionComparison
                        before={comparison.currentData}
                        after={snapshot.currentData}
                      />
                    )}
                  <QuoteLifecyclePanel
                    key={quoteId + ':' + versionId}
                    detail={detail}
                    disabled={root.isFetching}
                    copyOnly
                    selectedVersionId={snapshot.currentData.publicId}
                    selectedVersionNumber={snapshot.currentData.versionNumber}
                    onAccepted={() => undefined}
                    onLock={(pending, uncertain) => setLocked(pending || uncertain)}
                    onNavigate={(path) => {
                      guard.allowNavigation();
                      navigate(path, { replace: true });
                    }}
                  />
                </>
              )}
            <QuoteHistoryEvents
              events={events}
              locked={locked}
              change={change}
              eventPage={eventPage}
            />
          </>
        )}
        <UnsavedClientDialog blocker={guard.blocker} locked={locked} />
      </Stack>
    </Box>
  );
}
