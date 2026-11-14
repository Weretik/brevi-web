import { payrollMissingRoles } from '@admin/production/model';
import { PayrollMonthTable } from '@admin/production/ui';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { PayrollSetupSection } from '../payroll-setup-section';

import type { usePayrollMonthActions } from '../../../hooks/payroll/use-payroll-month-actions';
import type { PayrollLine, PayrollMonth, payrollMonthPeople } from '@admin/production/model';

/** «Місяць»: the month parameters (master, chief, embroidery) and the pay table of every worker. */
export function PayrollPeopleSection({
  month,
  people,
  canChange,
  actions,
  onOpen,
  onMessage,
  onError,
}: {
  month: PayrollMonth;
  people: ReturnType<typeof payrollMonthPeople>;
  canChange: boolean;
  actions: ReturnType<typeof usePayrollMonthActions>;
  onOpen: (line: PayrollLine) => void;
  onMessage: (message: string) => void;
  onError: (message: string | null) => void;
}) {
  const missing = payrollMissingRoles(month);
  return (
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
            onError={onError}
          />
        </AccordionDetails>
      </Accordion>
      <PayrollMonthTable
        lines={month.lines}
        totals={month.totals}
        canEditIssued={canChange}
        busy={actions.savingIssued}
        onOpen={onOpen}
        onSaveIssued={actions.saveIssued}
      />
    </>
  );
}
