import { formatPercent } from '@admin/references/model';
import { Stack } from '@mui/material';

import { ReferenceDetailsList } from '../reference-editor/reference-details-list';
import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type { PpeMarkupRule } from '@admin/references/model';

export function PpeMarkupRuleDetails({ rule }: { rule: PpeMarkupRule }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Націнка на ціну постачальника">
        <ReferenceDetailsList
          items={[
            { label: 'Правило', value: rule.name },
            { label: 'Роздріб', value: formatPercent(rule.retailMarkup), mono: true },
            { label: 'Опт', value: formatPercent(rule.wholesaleMarkup), mono: true },
            { label: 'Великий опт', value: formatPercent(rule.largeWholesaleMarkup), mono: true },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Для прайсу">
        <ReferenceDetailsList
          items={[
            { label: 'Примітка для прайсу', value: rule.priceNote },
            { label: 'До яких товарів належить', value: rule.appliesTo },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
