import { formatProductionDate } from '@admin/production/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';

import type { WorkshopEmployee } from '@admin/production/model';

export function WorkshopEmployeeDetails({ employee }: { employee: WorkshopEmployee }) {
  return (
    <ReferenceFormSection title="Працівник">
      <ReferenceDetailsList
        items={[
          { label: 'ПІБ', value: employee.fullName },
          { label: 'Посада', value: employee.position },
          ...(employee.isActive ? [] : [{ label: 'Стан', value: 'В архіві' }]),
          { label: 'Змінено', value: formatProductionDate(employee.updatedAt), mono: true },
        ]}
      />
    </ReferenceFormSection>
  );
}
