import { formatIsoDate, formatParameterValue } from '@admin/references/model';
import { Stack } from '@mui/material';

import { ReferenceDetailsList } from '../reference-editor/reference-details-list';
import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type { PricingParameter } from '@admin/references/model';

export function PricingParameterDetails({ parameter }: { parameter: PricingParameter }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Основні дані">
        <ReferenceDetailsList
          items={[
            { label: 'Код', value: parameter.code, mono: true },
            { label: 'Група', value: parameter.group },
            { label: 'Назва', value: parameter.name },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Значення">
        <ReferenceDetailsList
          items={[
            {
              label: 'Значення',
              value: formatParameterValue(parameter.value, parameter.unit),
              mono: true,
            },
            { label: 'Тип', value: parameter.isCalculated ? 'Розрахункове' : 'Ручне' },
            { label: 'Дата оновлення', value: formatIsoDate(parameter.updatedOn), mono: true },
            { label: 'Коментар', value: parameter.comment },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
