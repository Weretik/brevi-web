import { FinanceAuditChanges } from '@admin/accounting/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';

import type { FinanceAuditEntry } from '@admin/accounting/model';

interface Props {
  entry: FinanceAuditEntry;
  onClose: () => void;
}

/** One «Журнал змін» entry in the side panel, for reading only. */
export function FinanceAuditDrawer({ entry, onClose }: Props) {
  return (
    <ReferenceEditorDrawer
      titleId="finance-audit-drawer-title"
      title={entry.title || 'Зміна'}
      description="Запис журналу змін; змінити його не можна."
      formId="finance-audit-form"
      paperWidth={560}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <FinanceAuditChanges entry={entry} />
    </ReferenceEditorDrawer>
  );
}
