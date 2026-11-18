import {
  bankStatementPeriod,
  financeOperationForms,
  formatFinanceCount,
} from '@admin/accounting/model';
import { BankLinesGrid } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

import { bankStatementsPath, financeReviewPath } from '../../accounting.routes';
import { BankLineDrawer } from '../../components/statements/bank-line-drawer';
import { BankStatementDialogs } from '../../components/statements/bank-statement-dialogs';
import { BankStatementStateFilter } from '../../components/statements/bank-statement-state-filter';
import { BankStatementTotals } from '../../components/statements/bank-statement-totals';
import { useBankStatement } from '../../hooks/statements/use-bank-statement';

import type { BankStatementLine } from '@admin/accounting/model';

/**
 * One statement (ACC-001 stages 6–7): lines by state, each changed in the side panel; «Провести виписку» books every
 * line marked «Проводити» in one save, and «Відкотити виписку» cancels what a booked statement added.
 */
export function BankStatementPage() {
  const { canEdit } = usePageRights();
  const { id = '' } = useParams();
  const location = useLocation();
  const existing = Boolean((location.state as { existing?: boolean } | null)?.existing);
  const view = useBankStatement(id);
  const [open, setOpen] = useState<BankStatementLine | null>(null);
  const [confirming, setConfirming] = useState<'book' | 'rollback' | null>(null);
  const details = view.details;
  const statement = details?.statement;
  const booked = statement?.status === 'Booked';
  const totals = details?.totals;
  const nothingToBook = !totals || totals.operations + totals.transfers === 0;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Button
        component={RouterLink}
        to={bankStatementsPath}
        startIcon={<ArrowBackOutlinedIcon />}
        size="small"
        sx={{ mb: 1 }}
      >
        Виписки банку
      </Button>
      <ReferencePageHeader
        overline={
          statement ? `${statement.accountName} · ${bankStatementPeriod(statement)}` : 'Виписка'
        }
        title={statement?.fileName ?? 'Виписка'}
        subtitle={
          statement
            ? booked
              ? `Проведено ${formatFinanceCount(statement.transactionCount, financeOperationForms)} і ${statement.transferCount} переказів`
              : `${statement.lineCount} рядків. Перевірте їх і проведіть виписку`
            : ''
        }
        actions={
          statement &&
          canEdit &&
          (booked ? (
            <Button
              variant="outlined"
              color="error"
              disabled={view.rollingBack || !details?.rollback}
              onClick={() => setConfirming('rollback')}
            >
              Відкотити виписку
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={view.booking || nothingToBook}
              onClick={() => setConfirming('book')}
            >
              Провести виписку
            </Button>
          ))
        }
      />
      <Stack sx={{ gap: 2 }}>
        {existing && !booked && (
          <Alert severity="info">
            Цей файл уже завантажували раніше; відкрито ту саму виписку.
          </Alert>
        )}
        <ReferenceListAlerts
          error={view.error}
          loading={view.loading}
          onRetry={view.retry}
          actionMessage={view.notice}
          onCloseActionMessage={() => view.setNotice(null)}
        />
        {view.message && <Alert severity="error">{view.message}</Alert>}
        {totals && !booked && <BankStatementTotals totals={totals} />}
        {booked && (
          <Typography variant="body2" color="text.secondary">
            Операції без категорії й з новими контрагентами — у розділі{' '}
            <RouterLink to={financeReviewPath}>«Потребують перевірки»</RouterLink>.
          </Typography>
        )}
        {details && <BankStatementStateFilter view={view} />}
        <Paper variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
          <BankLinesGrid
            rows={details?.lines ?? []}
            rowCount={details?.total ?? 0}
            loading={view.loading}
            readOnly={booked}
            paginationModel={{ page: view.page - 1, pageSize: view.pageSize }}
            onPaginationModelChange={(model) => view.setPage(model.page + 1)}
            onOpen={setOpen}
            onToggle={view.toggle}
            savingIds={view.savingIds}
            emptyLabel={view.error ? 'Виписка недоступна. Повторіть запит.' : 'Рядків немає'}
          />
        </Paper>
      </Stack>
      {open && (
        <BankLineDrawer
          key={open.id}
          statementId={id}
          line={open}
          readOnly={booked}
          onClose={() => setOpen(null)}
          onSaved={(message) => {
            setOpen(null);
            view.setNotice(message);
          }}
        />
      )}
      <BankStatementDialogs
        view={view}
        confirming={confirming}
        onClose={() => setConfirming(null)}
      />
    </Box>
  );
}

export default BankStatementPage;
