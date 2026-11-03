import { CustomerFields } from '@admin/clients/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';

import { DuplicateCandidates } from './duplicate-candidates';
import { useCustomerCreate } from '../../hooks/customers/use-customer-create';

import type { CustomerDetail } from '@admin/clients/model';

interface Props {
  onClose: () => void;
  onCreated: (customer: CustomerDetail) => void;
}

/** «Додати клієнта»: the same side panel as the other reference tables. */
export function CustomerCreateDrawer({ onClose, onCreated }: Props) {
  const editor = useCustomerCreate(onCreated);
  return (
    <ReferenceEditorDrawer
      titleId="customer-create-drawer-title"
      title="Новий клієнт"
      description="Назва не є унікальним ідентифікатором. Перевірте схожі записи перед створенням."
      formId="customer-create-form"
      paperWidth={560}
      readOnly={false}
      saving={editor.saving}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.error && <Alert severity="error">{editor.error}</Alert>}
        <CustomerFields
          draft={editor.draft}
          errors={editor.errors}
          disabled={editor.saving}
          showActive={false}
          onChange={editor.setDraft}
        />
        <Button
          sx={{ alignSelf: 'flex-start' }}
          disabled={editor.saving || !editor.draft.displayName.trim()}
          onClick={editor.checkDuplicates}
        >
          Перевірити схожих
        </Button>
        {editor.duplicates && <DuplicateCandidates term={editor.duplicates} />}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
