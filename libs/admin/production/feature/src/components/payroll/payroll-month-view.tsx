import {
  formatWorkMonth,
  payrollMonthPeople,
  payrollMonthPermissions,
} from '@admin/production/model';
import { PayrollMonthKpis } from '@admin/production/ui';
import { usePageRights } from '@admin/shared/ui';
import { Alert, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { PayrollMonthDialogs } from './month/payroll-month-dialogs';
import { PayrollMonthNotices } from './month/payroll-month-notices';
import { PayrollMonthToolbar } from './month/payroll-month-toolbar';
import { PayrollPaymentsSection } from './month/payroll-payments-section';
import { PayrollPeopleSection } from './month/payroll-people-section';
import { PayrollEmployeeDrawer } from './payroll-employee-drawer';
import { PayrollAdjustmentDrawer, PayrollPaymentDrawer } from './payroll-entry-drawers';
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
  const people = useMemo(() => payrollMonthPeople(month), [month]);
  const rights = usePageRights();
  const permissions = payrollMonthPermissions(month.permissions, rights);
  const saved = (text: string) => {
    setPanel(null);
    onMessage(text);
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <PayrollMonthToolbar
        month={month}
        permissions={permissions}
        stepper={stepper}
        onMarkDay={onMarkDay}
        onAddPayment={() => setPanel('payment')}
        onClose={() => actions.setConfirm('close')}
      />
      <PayrollMonthNotices
        month={month}
        permissions={permissions}
        onReopen={() => actions.setConfirm('reopen')}
      />
      {actions.error && <Alert severity="error">{actions.error}</Alert>}
      <PayrollMonthKpis totals={month.totals} />
      {section === 'people' && (
        <PayrollPeopleSection
          month={month}
          people={people}
          canChange={permissions.canChange}
          actions={actions}
          onOpen={setOpen}
          onMessage={onMessage}
          onError={actions.setError}
        />
      )}
      {section === 'payments' && (
        <PayrollPaymentsSection
          month={month}
          permissions={permissions}
          cancel={actions.cancel}
          onAddAdjustment={() => setPanel('adjustment')}
        />
      )}
      {panel === 'payment' && (
        <PayrollPaymentDrawer
          month={month.month}
          monthLabel={label}
          people={people}
          onClose={() => setPanel(null)}
          onSaved={saved}
        />
      )}
      {panel === 'adjustment' && (
        <PayrollAdjustmentDrawer
          month={month.month}
          monthLabel={label}
          people={people}
          onClose={() => setPanel(null)}
          onSaved={saved}
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
      <PayrollMonthDialogs label={label} actions={actions} />
    </Stack>
  );
}
