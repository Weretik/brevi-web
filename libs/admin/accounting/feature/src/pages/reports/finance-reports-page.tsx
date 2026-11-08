import { financeReportRoots, formatLedgerDate } from '@admin/accounting/model';
import { FinanceReportForm, FinanceReportGrid, FinanceReportTotals } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';

import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useFinanceCounterpartySearch } from '../../hooks/counterparties/use-finance-counterparty-search';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { useFinanceReport } from '../../hooks/reports/use-finance-report';

/**
 * «Бухгалтерія → Звіти» (ACC-001 stage 8): six reports for a period with a CSV download for Excel,
 * and «Резервна копія» — every finance record in one JSON file.
 */
export function FinanceReportsPage() {
  const { cutoverDate, today } = useAccountingSettings();
  const view = useFinanceReport(today, cutoverDate);
  const choices = useFinanceChoices('Current');
  const counterparties = useFinanceCounterpartySearch(true, () => undefined);
  const report = view.report;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Звіти"
        subtitle="Рахуються лише діючі доходи й витрати; перекази між своїми рахунками — тільки у звіті за рахунками."
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              disabled={!report || view.downloading !== null}
              onClick={view.downloadCsv}
            >
              {view.downloading === 'csv' ? 'Завантажуємо…' : 'Завантажити CSV'}
            </Button>
            <Button
              variant="text"
              disabled={view.downloading !== null}
              onClick={view.downloadBackup}
            >
              {view.downloading === 'json' ? 'Готуємо копію…' : 'Резервна копія'}
            </Button>
          </Stack>
        }
      />
      <Stack sx={{ gap: 2 }}>
        <FinanceReportForm
          value={view.form}
          accounts={choices.allAccounts}
          roots={financeReportRoots(choices.categories, view.form)}
          counterparties={counterparties.field}
          problem={view.problem}
          building={view.loading}
          onChange={view.setForm}
          onApply={view.apply}
        />
        {view.downloadError && (
          <Alert severity="error" onClose={view.clearDownloadError}>
            {view.downloadError}
          </Alert>
        )}
        <ReferenceListAlerts
          error={view.error}
          loading={view.loading}
          onRetry={view.retry}
          actionMessage={null}
          onCloseActionMessage={() => undefined}
        />
        {report && (
          <Stack sx={{ gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatLedgerDate(report.from)} – {formatLedgerDate(report.to)}
            </Typography>
            <FinanceReportTotals totals={report.totals} />
          </Stack>
        )}
        {report?.limited && (
          <Alert severity="warning">
            Показано перші {report.rows.length} з {report.totalRows} операцій. Усі (до 50 000) — у
            файлі CSV; для довшого журналу розбийте період.
          </Alert>
        )}
        {view.applied ? (
          <Paper variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
            <FinanceReportGrid
              report={report}
              loading={view.loading}
              emptyLabel={
                view.error ? 'Звіт недоступний. Повторіть запит.' : 'За цей період нічого немає'
              }
            />
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Оберіть звіт і період, потім «Сформувати звіт».
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default FinanceReportsPage;
