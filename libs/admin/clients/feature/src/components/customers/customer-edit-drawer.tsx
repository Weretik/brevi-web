import { customerDraft, customerErrors } from '@admin/clients/model';
import { CustomerFields } from '@admin/clients/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { DuplicateCandidates } from './duplicate-candidates';

import type { CustomerDetail, CustomerDraft } from '@admin/clients/model';

interface Props {
  customer: CustomerDetail;
  saving: boolean;
  error: string | null;
  onDirty: (dirty: boolean) => void;
  onSave: (draft: CustomerDraft) => Promise<boolean>;
  onClose: () => void;
}

/** «Редагувати» of a client card: the same side panel as adding a client (CARD-001). */
export function CustomerEditDrawer({ customer, saving, error, onDirty, onSave, onClose }: Props) {
  const [draft, setDraft] = useState(() => customerDraft(customer));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicates, setDuplicates] = useState('');
  const dirty = JSON.stringify(draft) !== JSON.stringify(customerDraft(customer));
  useEffect(() => {
    onDirty(dirty);
    return () => onDirty(false);
  }, [dirty, onDirty]);

  async function submit() {
    const found = customerErrors(draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (await onSave(draft)) onClose();
  }

  return (
    <ReferenceEditorDrawer
      titleId="customer-edit-drawer-title"
      title="Редагувати клієнта"
      description={customer.displayName}
      formId="customer-edit-form"
      paperWidth={560}
      readOnly={false}
      saving={saving}
      saveDisabled={!dirty}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <CustomerFields
          draft={draft}
          errors={errors}
          disabled={saving || !customer.canEdit}
          showActive
          onChange={setDraft}
        />
        <Button
          sx={{ alignSelf: 'flex-start' }}
          disabled={saving || !draft.displayName.trim()}
          onClick={() => setDuplicates(draft.taxIdentity.trim() || draft.displayName.trim())}
        >
          Перевірити схожих
        </Button>
        {duplicates && <DuplicateCandidates term={duplicates} currentId={customer.publicId} />}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
