import { formatDay, formatMoney, formatWorkMonth, payrollCsv } from '@admin/production/model';
import {
  PayrollAdjustmentsTable,
  PayrollMonthKpis,
  PayrollMonthTable,
  PayrollPaymentsTable,
  ProductionConfirmDialog,
  ProductionReasonDialog,
} from '@admin/production/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { PayrollEmployeeDrawer } from './payroll-employee-drawer';
import { PayrollAdjustmentDrawer, PayrollPaymentDrawer } from './payroll-entry-drawers';
import { PayrollSetupSection } from './payroll-setup-section';
import { downloadCsv } from '../../hooks/files/download-csv';
import { usePayrollMonthActions } from '../../hooks/payroll/use-payroll-month-actions';

import type { PayrollLine, PayrollMonth } from '@admin/production/model';
import type { ReactNode } from 'react';

export type PayrollSection = 'people' | 'payments';

interface Props {
  month: PayrollMonth;
  section: PayrollSection;
  /** The page's period switch; sits left of the actions. */
  stepper: ReactNode;
  /** Opens «Відмітити день»; only given to a person who may record hours. */
  onMarkDay?: () => void;
  onMessage: (message: string) => void;
}

type Panel = 'payment' | 'adjustment';

/** «Місяць» and «Виплати» of the month pulse: totals, the table or the payments, and closing. */
export function PayrollMonthView({ month, section, stepper, onMarkDay, onMessage }: Props) {
  const label = formatWorkMonth(month.month);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [open, setOpen] = useState<PayrollLine | null>(null);
  const actions = usePayrollMonthActions(month, onMessage);
  const { cancel, confirm, setConfirm, error, setError } = actions;
  const people = useMemo(
    () =>
      month.lines
        .filter((line) => line.isActive)
        .map((line) => ({ employeeId: line.employeeId, name: line.name, position: line.position })),
    [month.lines],
  );
  const { permissions } = month;
  const closedBy = [
    month.closedByName,
    month.closedAt ? new Date(month.closedAt).toLocaleDateString('uk-UA') : null,
  ]
    .filter(Boolean)
    .join(', ');

  const pending = cancel.pending;
  const missing = [
    month.master ? null : 'не вибрано майстра',
    month.chief ? null : 'не вибрано начальника',
  ].filter(Boolean);

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 1, justifyContent: 'space-between', alignItems: { md: 'center' } }}
      >
        {stepper}
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          {onMarkDay && (
            <Button variant="outlined" onClick={onMarkDay}>
              Відмітити день
            </Button>
          )}
          {permissions.canPay && (
            <Button
              variant="outlined"
              startIcon={<AddOutlinedIcon />}
              onClick={() => setPanel('payment')}
            >
              Додати виплату
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            disabled={month.lines.length === 0}
            onClick={() => downloadCsv(payrollCsv(month), `zarplata-${month.month}.csv`)}
          >
            Excel
          </Button>
          {permissions.canClose && (
            <Button
              variant="contained"
              startIcon={<LockOutlinedIcon />}
              onClick={() => setConfirm('close')}
            >
              Закрити місяць
            </Button>
          )}
        </Stack>
      </Stack>
      {month.isClosed && (
        <Alert
          severity="info"
          icon={<LockOutlinedIcon />}
          action={
            permissions.canReopen && (
              <Button color="inherit" size="small" onClick={() => setConfirm('reopen')}>
                Відкрити
              </Button>
            )
          }
        >
          Місяць закрито{closedBy ? ` (${closedBy})` : ''}. Показано розрахунок на момент закриття;
          робота, години й виплати в ньому не змінюються.
        </Alert>
      )}
      {month.warnings.length > 0 && (
        <Alert severity="warning">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {permissions.canPay && !permissions.canClose
              ? 'Місяць не можна закрити, доки є попередження:'
              : 'Попередження розрахунку:'}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {month.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </Box>
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <PayrollMonthKpis totals={month.totals} />
      {section === 'people' && (
        <>
          <Accordion variant="outlined" disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
              <Typography variant="subtitle2">
                Параметри місяця
                {missing.length > 0 && (
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ ml: 1, color: 'warning.main', fontWeight: 600 }}
                  >
                    {missing.join(', ')}
                  </Typography>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PayrollSetupSection
                key={`${month.month}:${month.master?.employeeId}:${month.chief?.employeeId}:${month.stitches}:${month.embroideryEmployee?.employeeId}`}
                month={month}
                people={people}
                onDone={onMessage}
                onError={setError}
              />
            </AccordionDetails>
          </Accordion>
          <PayrollMonthTable
            lines={month.lines}
            totals={month.totals}
            canEditIssued={permissions.canPay}
            busy={actions.savingIssued}
            onOpen={setOpen}
            onSaveIssued={actions.saveIssued}
          />
        </>
      )}
      {section === 'payments' && (
        <>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Виплати
            </Typography>
            <PayrollPaymentsTable
              rows={month.payments}
              busy={cancel.busy}
              onCancel={
                permissions.canPay ? (row) => cancel.request({ kind: 'payment', row }) : undefined
              }
            />
          </Box>
          <Box>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
            >
              <Typography variant="h6">Інше нарахування / утримання</Typography>
              {permissions.canPay && (
                <Button startIcon={<AddOutlinedIcon />} onClick={() => setPanel('adjustment')}>
                  Додати
                </Button>
              )}
            </Stack>
            <PayrollAdjustmentsTable
              rows={month.adjustments}
              busy={cancel.busy}
              onCancel={
                permissions.canPay
                  ? (row) => cancel.request({ kind: 'adjustment', row })
                  : undefined
              }
            />
          </Box>
        </>
      )}
      {panel === 'payment' && (
        <PayrollPaymentDrawer
          month={month.month}
          monthLabel={label}
          people={people}
          onClose={() => setPanel(null)}
          onSaved={(text) => {
            setPanel(null);
            onMessage(text);
          }}
        />
      )}
      {panel === 'adjustment' && (
        <PayrollAdjustmentDrawer
          month={month.month}
          monthLabel={label}
          people={people}
          onClose={() => setPanel(null)}
          onSaved={(text) => {
            setPanel(null);
            onMessage(text);
          }}
        />
      )}
      {open && (
        <PayrollEmployeeDrawer
          month={month.month}
          monthLabel={label}
          line={open}
          onClose={() => setOpen(null)}
        />
      )}
      <ProductionReasonDialog
        open={pending !== null}
        title={pending?.kind === 'payment' ? 'Скасувати виплату?' : 'Скасувати запис?'}
        text={
          pending
            ? `${pending.row.employeeName}, ${formatMoney(pending.row.amount)}${
                pending.kind === 'payment' ? ` від ${formatDay(pending.row.paidOn)}` : ''
              }. Запис лишиться в списку закресленим і не рахуватиметься.`
            : ''
        }
        confirmLabel="Скасувати запис"
        reason={cancel.reason}
        error={cancel.error}
        busy={cancel.busy}
        onChange={cancel.change}
        onClose={cancel.cancel}
        onConfirm={() => void cancel.confirm()}
      />
      <ProductionConfirmDialog
        open={confirm !== null}
        title={
          confirm === 'close'
            ? `Закрити ${label.toLowerCase()}?`
            : `Відкрити ${label.toLowerCase()}?`
        }
        text={
          confirm === 'close'
            ? 'Розрахунок збережеться як є. Після закриття роботу, години, виплати й утримання за цей місяць змінити не можна.'
            : 'Місяць знову рахуватиметься з поточних даних, і в ньому можна буде змінювати роботу, години й виплати.'
        }
        confirmLabel={confirm === 'close' ? 'Закрити місяць' : 'Відкрити місяць'}
        busy={actions.changingMonth}
        onClose={() => setConfirm(null)}
        onConfirm={() => void actions.confirmed()}
      />
    </Stack>
  );
}
