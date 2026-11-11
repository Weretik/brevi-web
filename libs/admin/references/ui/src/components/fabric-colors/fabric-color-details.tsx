import { ReferenceDetailsList } from '../reference-editor/reference-details-list';
import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type { FabricColor } from '@admin/references/model';

export function FabricColorDetails({ color }: { color: FabricColor }) {
  return (
    <ReferenceFormSection title="Колір">
      <ReferenceDetailsList
        items={[
          { label: 'Колір', value: color.name },
          { label: 'Статус', value: color.isActive ? 'Активний' : 'Вимкнений' },
          { label: 'Порядок у списку', value: String(color.sortOrder) },
        ]}
      />
    </ReferenceFormSection>
  );
}
