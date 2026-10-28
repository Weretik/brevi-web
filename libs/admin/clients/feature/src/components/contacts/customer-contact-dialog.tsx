import { ContactFields } from '@admin/clients/ui';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

import { useCustomerContactEditor } from '../../hooks/contacts/use-customer-contact-editor';

import type { CustomerContact, CustomerDetail } from '@admin/clients/model';

export function CustomerContactDialog({
  customer,
  contact,
  onClose,
  onDirty,
  onRefresh,
}: {
  customer: CustomerDetail;
  contact?: CustomerContact;
  onClose: () => void;
  onDirty: (dirty: boolean) => void;
  onRefresh: () => void;
}) {
  const {
    draft,
    setDraft,
    errors,
    error,
    discard,
    setDiscard,
    refreshAfterDiscard,
    setRefreshAfterDiscard,
    state,
    close,
    submit,
  } = useCustomerContactEditor({ customer, contact, onClose, onDirty });
  return (
    <>
      <Dialog open onClose={close} fullWidth maxWidth="sm" aria-labelledby="contact-title">
        <DialogTitle id="contact-title">
          {contact ? 'Редагування контакту' : 'Новий контакт'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && (
              <Alert
                severity="error"
                action={
                  <Button
                    onClick={() => {
                      setRefreshAfterDiscard(true);
                      setDiscard(true);
                    }}
                  >
                    Оновити клієнта
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
            <ContactFields
              draft={draft}
              disabled={state.isLoading}
              errors={errors}
              onChange={setDraft}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={state.isLoading} onClick={close}>
            Скасувати
          </Button>
          <Button
            variant="contained"
            disabled={state.isLoading || !customer.canEdit}
            onClick={() => void submit()}
          >
            Зберегти контакт
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={discard}
        onClose={() => setDiscard(false)}
        aria-labelledby="discard-contact-title"
      >
        <DialogTitle id="discard-contact-title">Відхилити зміни контакту?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDiscard(false)}>Продовжити редагування</Button>
          <Button
            color="warning"
            onClick={() => {
              if (refreshAfterDiscard) onRefresh();
              else onClose();
            }}
          >
            Відхилити зміни
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
