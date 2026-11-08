import {
  bankLineStateLabels,
  bankLineStates,
  bankStatementPeriod,
  financeOperationForms,
  formatFinanceCount,
  formatMinor,
} from '@admin/accounting/model';
import { BankLinesGrid, FinanceDeleteDialog, FinanceSegmentedButtons } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

import { bankStatementsPath, financeReviewPath } from '../../accounting.routes';
import { BankLineDrawer } from '../../components/statements/bank-line-drawer';
import { useBankStatement } from '../../hooks/statements/use-bank-statement';

import type { BankLineState, BankStatementLine } from '@admin/accounting/model';

type Filter = BankLineState | 'All';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * One statement (ACC-001 stage 6): lines by state, each changed in the side panel, and «Провести виписку», which
 * books every line marked «Проводити» in one save.
 */
export function BankStatementPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const existing = Boolean((location.state as { existing?: boolean } | null)?.existing);
  const view = useBankStatement(id);
  const [open, setOpen] = useState<BankStatementLine | null>(null);
  const [confirming, setConfirming] = useState(false);
  const details = view.details;
  const statement = details?.statement;
  const booked = statement?.status === 'Booked';
  const all = details?.states.reduce((sum, row) => sum + row.count, 0) ?? 0;
  const countOf = (state: BankLineState) =>
    details?.states.find((row) => row.state === state)?.count ?? 0;
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
          !booked && (
            <Button
              variant="contained"
              disabled={view.booking || nothingToBook}
              onClick={() => setConfirming(true)}
            >
              Провести виписку
            </Button>
          )
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
        {totals && !booked && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ columnGap: 4, rowGap: 1 }}>
              <Typography variant="body2">
                Буде проведено:{' '}
                <b>{formatFinanceCount(totals.operations, financeOperationForms)}</b>
                {totals.transfers > 0 && (
                  <>
                    {' '}
                    і <b>{totals.transfers} переказів</b>
                  </>
                )}
              </Typography>
              <Typography variant="body2" sx={{ ...mono, color: 'success.main' }}>
                +{formatMinor(totals.incomeMinor)}
              </Typography>
              <Typography variant="body2" sx={{ ...mono, color: 'error.main' }}>
                −{formatMinor(totals.expenseMinor)}
              </Typography>
            </Stack>
          </Paper>
        )}
        {booked && (
          <Typography variant="body2" color="text.secondary">
            Операції без категорії й з новими контрагентами — у розділі{' '}
            <RouterLink to={financeReviewPath}>«Потребують перевірки»</RouterLink>.
          </Typography>
        )}
        {details && (
          <Box sx={{ overflowX: 'auto' }}>
            <FinanceSegmentedButtons<Filter>
              label="Стан рядків"
              value={view.state ?? 'All'}
              onChange={(next) => view.setState(next === 'All' ? null : next)}
              segments={[
                { value: 'All', label: `Усі ${all}` },
                ...bankLineStates
                  .filter((state) => countOf(state) > 0 || view.state === state)
                  .map((state) => ({
                    value: state,
                    label: `${bankLineStateLabels[state]} ${countOf(state)}`,
                  })),
              ]}
            />
          </Box>
        )}
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
      <FinanceDeleteDialog
        open={confirming}
        title="Провести виписку?"
        text={
          totals
            ? `Буде додано ${formatFinanceCount(totals.operations, financeOperationForms)} і ${totals.transfers} переказів. Нових контрагентів буде створено непідтвердженими. Після проведення виписку не можна змінити; окремі записи можна анулювати в журналі.`
            : ''
        }
        deleting={view.booking}
        confirmLabel="Провести"
        confirmColor="primary"
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          void view.book();
        }}
      />
    </Box>
  );
}

export default BankStatementPage;
