import { formatIsoDate, formatUah } from '@admin/references/model';
import { Stack } from '@mui/material';

import { ReferenceDetailsList } from '../reference-editor/reference-details-list';
import { ReferenceFormSection } from '../reference-editor/reference-form-section';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';

import type { FabricFormValues } from '@admin/references/model';

interface Props {
  values: FabricFormValues;
  priceUpdatedAt: string | null;
}

export function FabricDetails({ values, priceUpdatedAt }: Props) {
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
            { label: 'Назва (UA)', value: values.name },
            { label: 'Назва (RU)', value: values.nameRu },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Закупівля">
        <ReferenceDetailsList
          items={[
            { label: 'Постачальник', value: values.providerName },
            { label: 'Ціна за 1 м', value: formatUah(Number(values.price)), mono: true },
            { label: 'Дата ціни', value: formatIsoDate(priceUpdatedAt), mono: true },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Характеристики">
        <ReferenceDetailsList
          items={[
            { label: 'Склад (UA)', value: values.composition },
            { label: 'Склад (RU)', value: values.compositionRu },
            { label: 'Щільність, г/м²', value: values.density, mono: true },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Для КП і нотатки">
        <ReferenceDetailsList
          items={[
            { label: 'Короткий опис для КП', value: values.proposalDescription },
            { label: 'Коментар', value: values.comment },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
