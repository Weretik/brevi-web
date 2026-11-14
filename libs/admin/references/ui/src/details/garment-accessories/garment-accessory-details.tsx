import { formatIsoDate, formatUah } from '@admin/references/model';
import { Stack } from '@mui/material';

import { ReferenceDetailsList } from '../../components/reference-editor/reference-details-list';
import { ReferenceFormSection } from '../../components/reference-editor/reference-form-section';
import { ReferenceStatusPill } from '../../components/reference-list/reference-status-pill';

import type { GarmentAccessoryFormValues } from '@admin/references/model';

interface Props {
  values: GarmentAccessoryFormValues;
  priceUpdatedAt: string | null;
  /** A click on the supplier opens its card (CAT-019). */
  onOpenSupplier?: (name: string) => void;
}

export function GarmentAccessoryDetails({ values, priceUpdatedAt, onOpenSupplier }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Основні дані">
        <ReferenceStatusPill
          active={values.isActive}
          activeLabel="Активна"
          inactiveLabel="Не використовується"
        />
        <ReferenceDetailsList
          items={[
            { label: 'ID', value: values.id, mono: true },
            { label: 'Код', value: values.code, mono: true },
            { label: 'Назва', value: values.name },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Закупівля">
        <ReferenceDetailsList
          items={[
            {
              label: 'Постачальник',
              value: values.supplierName,
              onOpen: onOpenSupplier ? () => onOpenSupplier(values.supplierName) : undefined,
            },
            { label: 'Ціна', value: formatUah(Number(values.price)), mono: true },
            { label: 'Одиниця', value: values.unit },
            { label: 'Дата ціни', value: formatIsoDate(priceUpdatedAt), mono: true },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Нотатки">
        <ReferenceDetailsList items={[{ label: 'Коментар', value: values.comment }]} />
      </ReferenceFormSection>
    </Stack>
  );
}
