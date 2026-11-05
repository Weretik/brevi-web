import { categoryDirectionLabels, ledgerScopeLabels } from '@admin/accounting/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';

import type { FinanceCategoryRow } from '@admin/accounting/model';

export function FinanceCategoryDetails({ category }: { category: FinanceCategoryRow }) {
  return (
    <ReferenceFormSection title="Категорія">
      <ReferenceDetailsList
        items={[
          { label: 'Назва', value: category.name },
          { label: 'Тип', value: categoryDirectionLabels[category.direction] },
          { label: 'Облік', value: ledgerScopeLabels[category.scope] },
          { label: 'Входить у', value: category.parentName ?? 'Коренева категорія' },
          ...(category.level === 0
            ? [{ label: 'Підкатегорій', value: String(category.childCount), mono: true }]
            : []),
          { label: 'Примітка', value: category.note },
        ]}
      />
    </ReferenceFormSection>
  );
}
