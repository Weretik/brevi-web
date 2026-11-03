import { productSectionTypeLabels } from '@admin/references/model';

import { ReferenceDetailsList } from '../reference-editor/reference-details-list';
import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type { ProductSection } from '@admin/references/model';

export function ProductSectionDetails({ section }: { section: ProductSection }) {
  return (
    <ReferenceFormSection title="Розділ">
      <ReferenceDetailsList
        items={[
          { label: 'Тип товару', value: productSectionTypeLabels[section.type] },
          { label: 'Розділ', value: section.name },
          { label: 'Статус', value: section.isActive ? 'Активний' : 'Вимкнений' },
          { label: 'Коментар', value: section.comment },
        ]}
      />
    </ReferenceFormSection>
  );
}
