import {
  useSetPayrollEmbroideryMutation,
  useSetPayrollRolesMutation,
} from '@admin/production/data-access';
import { PAYROLL_MAX_STITCHES } from '@admin/production/model';
import { PayrollSetupForm } from '@admin/production/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { PayrollMonth } from '@admin/production/model';
import type { PayrollPersonOption, PayrollSetupValues } from '@admin/production/ui';

interface Props {
  month: PayrollMonth;
  people: readonly PayrollPersonOption[];
  onDone: (message: string) => void;
  onError: (message: string) => void;
}

const initial = (month: PayrollMonth): PayrollSetupValues => ({
  masterId: month.master?.employeeId ?? null,
  chiefId: month.chief?.employeeId ?? null,
  stitches: String(month.stitches),
  embroideryId: month.embroideryEmployee?.employeeId ?? null,
});

/** Parent gives it a `key` of the month's roles and embroidery, so a fresh month resets the form. */
export function PayrollSetupSection({ month, people, onDone, onError }: Props) {
  const [values, setValues] = useState(() => initial(month));
  const [stitchesError, setStitchesError] = useState<string | null>(null);
  const [setRoles, roles] = useSetPayrollRolesMutation();
  const [setEmbroidery, embroidery] = useSetPayrollEmbroideryMutation();
  const busy = roles.isLoading || embroidery.isLoading;

  async function saveRoles() {
    try {
      await setRoles({
        month: month.month,
        body: { masterEmployeeId: values.masterId, chiefEmployeeId: values.chiefId },
      }).unwrap();
      onDone('Керівні частки збережено.');
    } catch (error) {
      onError(adminApiErrorMessage(error, 'Не вдалося зберегти керівні частки.'));
    }
  }

  async function saveEmbroidery() {
    const text = values.stitches.trim().replace(/\s/g, '');
    const stitches = /^\d+$/.test(text) ? Number(text) : Number.NaN;
    if (!Number.isSafeInteger(stitches) || stitches > PAYROLL_MAX_STITCHES) {
      setStitchesError('Ціле число від 0.');
      return;
    }
    setStitchesError(null);
    try {
      await setEmbroidery({
        month: month.month,
        body: { stitches, employeeId: values.embroideryId },
      }).unwrap();
      onDone('Вишивку збережено.');
    } catch (error) {
      onError(adminApiErrorMessage(error, 'Не вдалося зберегти вишивку.'));
    }
  }

  return (
    <PayrollSetupForm
      month={month}
      people={people}
      values={values}
      canEdit={month.permissions.canSetUp}
      busy={busy}
      stitchesError={stitchesError}
      onChange={(next) => {
        setValues(next);
        setStitchesError(null);
      }}
      onSaveRoles={() => void saveRoles()}
      onSaveEmbroidery={() => void saveEmbroidery()}
    />
  );
}
