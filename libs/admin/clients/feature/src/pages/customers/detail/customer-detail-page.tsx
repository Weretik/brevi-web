import { CustomerContacts } from '@admin/clients/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { ConfirmClientRefresh } from '../../../components/changes/confirm-client-refresh';
import { UnsavedClientDialog } from '../../../components/changes/unsaved-client-dialog';
import { CustomerContactDialog } from '../../../components/contacts/customer-contact-dialog';
import { CustomerForm } from '../../../components/customers/customer-form';
import { DuplicateCandidates } from '../../../components/customers/duplicate-candidates';
import { CustomerMergeDialog } from '../../../components/merge/customer-merge-dialog';
import { customerError } from '../../../errors/customer-error';
import { useCustomerDetail } from '../../../hooks/customers/use-customer-detail';

export default function CustomerDetailPage() {
  const {
    customerId,
    query,
    customer,
    dirty,
    setDirty,
    setContactDirty,
    setMergeDirty,
    epoch,
    reloadConfirm,
    setReloadConfirm,
    error,
    duplicates,
    setDuplicates,
    contact,
    setContact,
    merge,
    setMerge,
    saved,
    setSaved,
    navigate,
    blocker,
    refresh,
    save,
    pending,
  } = useCustomerDetail();
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
      <Stack spacing={2}>
        <Button onClick={() => navigate('/crm/clients')}>До списку клієнтів</Button>
        {(query.isLoading || (!customer && query.isFetching)) && (
          <CircularProgress aria-label="Завантаження клієнта" />
        )}
        {query.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void refresh()}>Повторити</Button>}
          >
            {customerError(query.error)}
          </Alert>
        )}
        {!query.error && customer && (
          <>
            <Typography component="h1" variant="h4">
              {customer.displayName}
            </Typography>
            {saved && (
              <Alert severity="success" onClose={() => setSaved(false)}>
                Клієнта збережено.
              </Alert>
            )}
            <Button
              disabled={pending || !!contact || merge}
              onClick={() => {
                if (dirty) setReloadConfirm(true);
                else void refresh();
              }}
            >
              Оновити дані із сервера
            </Button>
            {dirty && (
              <Alert severity="info">
                Спочатку збережіть зміни клієнта, щоб редагувати контакти або об’єднати записи.
              </Alert>
            )}
            <CustomerForm
              key={`${customerId}:${customer.revision}:${epoch}`}
              customer={customer}
              pending={pending}
              error={error}
              onSave={(draft) => void save(draft)}
              onDirty={setDirty}
              onCheckDuplicates={(draft) =>
                setDuplicates(draft.taxIdentity.trim() || draft.displayName.trim())
              }
            />
            {duplicates && <DuplicateCandidates term={duplicates} currentId={customerId} />}
            {!!customer.externalIdentities.length && (
              <Alert severity="info">
                Зовнішні зв’язки:{' '}
                {customer.externalIdentities
                  .map((x) => `${x.source}/${x.type}: ${x.externalId}`)
                  .join('; ')}
              </Alert>
            )}
            <CustomerContacts
              contacts={customer.contacts}
              canEdit={customer.canEdit && !dirty && !pending}
              onEdit={(value) => setContact({ value })}
            />
            {customer.canMerge && (
              <Button color="warning" disabled={dirty || pending} onClick={() => setMerge(true)}>
                Об’єднати з перевіреним дублем
              </Button>
            )}
            {contact && (
              <CustomerContactDialog
                customer={customer}
                contact={contact.value}
                onDirty={setContactDirty}
                onClose={() => setContact(null)}
                onRefresh={() => {
                  setContact(null);
                  void refresh();
                }}
              />
            )}
            {merge && (
              <CustomerMergeDialog
                customer={customer}
                onDirty={setMergeDirty}
                onClose={() => setMerge(false)}
                onRefresh={() => {
                  setMerge(false);
                  void refresh();
                }}
              />
            )}
          </>
        )}
        <ConfirmClientRefresh
          open={reloadConfirm}
          onCancel={() => setReloadConfirm(false)}
          onConfirm={() => void refresh()}
        />
        <UnsavedClientDialog blocker={blocker} />
      </Stack>
    </Box>
  );
}
