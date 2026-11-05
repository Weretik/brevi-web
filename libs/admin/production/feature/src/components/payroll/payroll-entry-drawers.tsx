import { PayrollAdjustmentForm, PayrollPaymentForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import {
  usePayrollAdjustmentEditor,
  usePayrollPaymentEditor,
} from '../../hooks/payroll/use-payroll-entry-editors';

import type { PayrollPersonOption } from '@admin/production/ui';

interface Props {
  month: string;
  monthLabel: string;
  people: readonly PayrollPersonOption[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function PayrollPaymentDrawer({ month, monthLabel, people, onClose, onSaved }: Props) {
  const editor = usePayrollPaymentEditor(month, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="payroll-payment-title"
      title="Додати виплату"
      description={`Виплата за ${monthLabel.toLowerCase()}. Помилкову виплату не видаляють, а скасовують з причиною.`}
      formId="payroll-payment-form"
      paperWidth={480}
      readOnly={false}
      editLabel={null}
      saving={editor.saving}
      submitLabel="Зберегти"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        <PayrollPaymentForm
          values={editor.values}
          errors={editor.errors}
          people={people}
          today={editor.today}
          disabled={editor.saving}
          onChange={editor.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

export function PayrollAdjustmentDrawer({ month, monthLabel, people, onClose, onSaved }: Props) {
  const editor = usePayrollAdjustmentEditor(month, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="payroll-adjustment-title"
      title="Нарахування / утримання"
      description={`Інше нарахування або утримання за ${monthLabel.toLowerCase()} з причиною.`}
      formId="payroll-adjustment-form"
      paperWidth={480}
      readOnly={false}
      editLabel={null}
      saving={editor.saving}
      submitLabel="Зберегти"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        <PayrollAdjustmentForm
          values={editor.values}
          errors={editor.errors}
          people={people}
          disabled={editor.saving}
          onChange={editor.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
