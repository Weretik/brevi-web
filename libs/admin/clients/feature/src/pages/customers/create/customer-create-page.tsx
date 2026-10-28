import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { UnsavedClientDialog } from '../../../components/changes/unsaved-client-dialog';
import { CustomerForm } from '../../../components/customers/customer-form';
import { DuplicateCandidates } from '../../../components/customers/duplicate-candidates';
import { useCustomerCreate } from '../../../hooks/customers/use-customer-create';

export default function CustomerCreatePage() {
  const { state, duplicates, setDuplicates, error, navigate, blocker, save, setDirty } =
    useCustomerCreate();
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
      <Stack spacing={2}>
        <Button onClick={() => navigate('/crm/clients')}>До списку клієнтів</Button>
        <Typography component="h1" variant="h4">
          Новий клієнт
        </Typography>
        <Alert severity="info">
          Назва не є унікальним ідентифікатором. Перевірте схожі записи перед створенням.
        </Alert>
        <CustomerForm
          pending={state.isLoading}
          error={error}
          onSave={(draft) => void save(draft)}
          onDirty={setDirty}
          onCheckDuplicates={(draft) =>
            setDuplicates(draft.taxIdentity.trim() || draft.displayName.trim())
          }
        />
        {duplicates && <DuplicateCandidates term={duplicates} />}
        <UnsavedClientDialog blocker={blocker} />
      </Stack>
    </Box>
  );
}
