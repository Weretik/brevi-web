import {
  fabricNormFieldLabels,
  fabricNormFields,
  formatMeters,
  formatProductionDate,
} from '@admin/production/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Alert } from '@mui/material';

import type { FabricNormRow } from '@admin/production/model';

export function FabricNormDetails({ row }: { row: FabricNormRow }) {
  return (
    <>
      {row.problem && <Alert severity="error">{row.problem}</Alert>}
      <ReferenceFormSection title="Модель">
        <ReferenceDetailsList
          items={[
            { label: 'Код', value: row.modelCode, mono: true },
            { label: 'Модель', value: row.modelName },
            ...(row.season ? [{ label: 'Сезон', value: row.season }] : []),
            ...(row.modelName && !row.modelIsActive
              ? [{ label: 'Стан у «Товари»', value: 'Вимкнена' }]
              : []),
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Норма на один виріб">
        {row.norm ? (
          <ReferenceDetailsList
            items={[
              ...fabricNormFields
                .filter((field) => row.norm?.[field] != null)
                .map((field) => ({
                  label: fabricNormFieldLabels[field],
                  value: formatMeters(row.norm?.[field] ?? null),
                  mono: true,
                })),
              ...(row.twoColorsTotal !== null
                ? [
                    {
                      label: 'Два кольори разом',
                      value: formatMeters(row.twoColorsTotal),
                      mono: true,
                    },
                  ]
                : []),
              ...(row.threeColorsTotal !== null
                ? [
                    {
                      label: 'Три кольори разом',
                      value: formatMeters(row.threeColorsTotal),
                      mono: true,
                    },
                  ]
                : []),
              { label: 'Змінено', value: formatProductionDate(row.updatedAt), mono: true },
            ]}
          />
        ) : (
          <Alert severity="warning">Норму ще не задано.</Alert>
        )}
      </ReferenceFormSection>
    </>
  );
}
