import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import {
  formatDay,
  formatKyivTime,
  formatMeters,
  formatPerProduct,
  movementCancelMark,
  movementOperationLabel,
} from '@admin/warehouse/model';
import { Alert, Stack } from '@mui/material';

import type { FabricMovementRow } from '@admin/warehouse/model';

/** The side panel of a journal row: what moved, where from or to, and who wrote it. */
export function FabricMovementDetails({ row }: { row: FabricMovementRow }) {
  const cancelled = movementCancelMark(row);
  const issue = row.kind === 'Issue';
  return (
    <Stack sx={{ gap: 2 }}>
      {cancelled && (
        <Alert severity="warning">
          {cancelled}: {row.isVoided ? 'на залишок не впливає.' : 'відмінено зворотним записом.'}
        </Alert>
      )}
      <ReferenceFormSection title="Операція">
        <ReferenceDetailsList
          items={[
            { label: 'Вид', value: movementOperationLabel(row) },
            { label: 'Дата операції', value: formatDay(row.operationDate), mono: true },
            {
              label: 'Кількість',
              value: `${row.delta > 0 ? '+' : row.delta < 0 ? '−' : ''}${formatMeters(Math.abs(row.delta))}`,
              mono: true,
            },
            { label: 'Залишок рядка після', value: formatMeters(row.metersAfter), mono: true },
            ...(row.pairMetersAfter === null
              ? []
              : [
                  {
                    label: 'Залишок пари після',
                    value: formatMeters(row.pairMetersAfter),
                    mono: true,
                  },
                ]),
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Тканина">
        <ReferenceDetailsList
          items={[
            { label: 'Тканина', value: row.fabricName },
            {
              label: 'Код',
              value:
                row.fabricCode === row.groupCode
                  ? row.fabricCode
                  : `${row.fabricCode} (на складі як ${row.groupCode})`,
              mono: true,
            },
            { label: 'Колір', value: row.color },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title={issue ? 'Куди' : 'Звідки'}>
        <ReferenceDetailsList
          items={
            issue
              ? [
                  {
                    label: 'Завдання',
                    value:
                      row.orderNumber === null
                        ? 'Без завдання'
                        : `Ц-${row.orderNumber}${row.modelName ? ` · ${row.modelName}` : ''}`,
                  },
                  ...(row.orderNumber === null
                    ? [{ label: 'Куди використано', value: row.destination }]
                    : []),
                  ...(row.perProduct === null
                    ? []
                    : [
                        {
                          label: 'На 1 виріб',
                          value: formatPerProduct(row.perProduct),
                          mono: true,
                        },
                      ]),
                ]
              : [
                  { label: 'Постачальник', value: row.supplierName },
                  { label: 'Документ', value: row.document },
                ]
          }
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Запис">
        <ReferenceDetailsList
          items={[
            { label: 'Примітка', value: row.note },
            { label: 'Хто записав', value: row.createdByName },
            { label: 'Коли записано', value: formatKyivTime(row.createdAt), mono: true },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
