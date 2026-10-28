import { customerDraft, customerErrors } from '@admin/clients/model';
import { CustomerFields } from '@admin/clients/ui';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import type { CustomerDetail, CustomerDraft } from '@admin/clients/model';

export interface CustomerFormProps {
  customer?: CustomerDetail;
  pending: boolean;
  error: string | null;
  onSave: (draft: CustomerDraft) => void;
  onDirty: (dirty: boolean) => void;
  onCheckDuplicates: (draft: CustomerDraft) => void;
}
export function CustomerForm({
  customer,
  pending,
  error,
  onSave,
  onDirty,
  onCheckDuplicates,
}: CustomerFormProps) {
  const [draft, setDraft] = useState(() => customerDraft(customer));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dirty = JSON.stringify(draft) !== JSON.stringify(customerDraft(customer));
  useEffect(() => {
    onDirty(dirty);
  }, [dirty, onDirty]);
  const disabled = pending || customer?.canEdit === false;
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const errors = customerErrors(draft);
        setErrors(errors);
        if (!Object.keys(errors).length) onSave(draft);
      }}
    >
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <CustomerFields
          draft={draft}
          errors={errors}
          disabled={disabled}
          showActive={!!customer}
          onChange={setDraft}
        />
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {customer?.canEdit !== false && (
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? 'Збереження…' : 'Зберегти клієнта'}
            </Button>
          )}
          <Button
            disabled={pending || !draft.displayName.trim()}
            onClick={() => onCheckDuplicates(draft)}
          >
            Перевірити схожих
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
