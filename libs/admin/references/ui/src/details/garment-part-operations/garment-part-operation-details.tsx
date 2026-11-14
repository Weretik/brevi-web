import { formatOperationMinutes, formatUah, operationLabourCost } from '@admin/references/model';
import { Stack } from '@mui/material';

import { ReferenceDetailsList } from '../../components/reference-editor/reference-details-list';
import { ReferenceFormSection } from '../../components/reference-editor/reference-form-section';
import { ReferenceStatusPill } from '../../components/reference-list/reference-status-pill';

import type { GarmentPartOperation, OperationLabourRates } from '@admin/references/model';

interface Props {
  operation: GarmentPartOperation;
  rates: OperationLabourRates | null;
}

export function GarmentPartOperationDetails({ operation, rates }: Props) {
  const cost = operationLabourCost(operation, rates);
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Основні дані">
        <ReferenceStatusPill
          active={operation.isActive}
          activeLabel="Активна"
          inactiveLabel="Не використовується"
        />
        <ReferenceDetailsList
          items={[
            { label: 'ID', value: String(operation.id), mono: true },
            { label: 'Код', value: operation.code, mono: true },
            { label: 'Назва', value: operation.name },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Де виконується">
        <ReferenceDetailsList
          items={[
            { label: 'Група деталей', value: operation.garmentPartName },
            { label: 'Вузол / елемент', value: operation.element },
            { label: 'Варіант виконання', value: operation.variant },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Норма часу">
        <ReferenceDetailsList
          items={[
            { label: 'Норма', value: formatOperationMinutes(operation), mono: true },
            {
              label: 'Вартість роботи швачки',
              value: cost && formatUah(cost.seamstress),
              mono: true,
            },
            {
              label: 'Вартість з урахуванням збирання',
              value: cost && formatUah(cost.withAssembly),
              mono: true,
            },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Нотатки">
        <ReferenceDetailsList items={[{ label: 'Примітки', value: operation.notes }]} />
      </ReferenceFormSection>
    </Stack>
  );
}
