import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { customerError } from '../../errors/customer-error';
import { useCustomerMerge } from '../../hooks/merge/use-customer-merge';

import type { CustomerDetail } from '@admin/clients/model';

export function CustomerMergeDialog({
  customer,
  onClose,
  onDirty,
  onRefresh,
}: {
  customer: CustomerDetail;
  onClose: () => void;
  onDirty: (dirty: boolean) => void;
  onRefresh: () => void;
}) {
  const {
    term,
    setTerm,
    search,
    setSearch,
    victimId,
    setVictimId,
    reason,
    setReason,
    error,
    list,
    victim,
    state,
    submit,
  } = useCustomerMerge({ customer, onClose, onDirty });
  return (
    <Dialog
      open
      onClose={() => {
        if (!state.isLoading) onClose();
      }}
      fullWidth
      maxWidth="sm"
      aria-labelledby="merge-title"
    >
      <DialogTitle id="merge-title">Об’єднання клієнтів</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity="warning">
            Залишиться «{customer.displayName}». Контакти та зовнішні зв’язки обраного дубля
            перейдуть до нього. Історичні документи не переписуються.
          </Alert>
          {error && (
            <Alert
              severity="error"
              action={<Button onClick={onRefresh}>Скасувати й оновити</Button>}
            >
              {error}
            </Alert>
          )}
          <TextField
            label="Пошук дубля"
            value={term}
            disabled={state.isLoading}
            onChange={(event) => setTerm(event.target.value)}
          />
          <Button
            disabled={!term.trim() || state.isLoading}
            onClick={() => {
              setVictimId('');
              setSearch(term.trim());
            }}
          >
            Знайти дубль
          </Button>
          {list.error && <Alert severity="error">{customerError(list.error)}</Alert>}
          {!!search &&
            list.currentData &&
            !list.currentData.rows.filter((x) => x.publicId !== customer.publicId).length && (
              <Alert severity="info">Дубля за цим запитом не знайдено.</Alert>
            )}
          <TextField
            select
            label="Приєднати клієнта"
            value={victimId}
            disabled={state.isLoading || list.isFetching}
            onChange={(event) => setVictimId(event.target.value)}
          >
            <MenuItem value="">Оберіть перевірений дубль</MenuItem>
            {(list.currentData?.rows ?? [])
              .filter((x) => x.publicId !== customer.publicId)
              .map((row) => (
                <MenuItem key={row.publicId} value={row.publicId}>
                  {row.displayName} · {row.taxIdentity ?? 'без коду'}
                </MenuItem>
              ))}
          </TextField>
          {victim.error && <Alert severity="error">{customerError(victim.error)}</Alert>}
          {victim.currentData && (
            <Alert severity="info">
              Контактів у дубля: {victim.currentData.contacts.length}. Зовнішніх зв’язків:{' '}
              {victim.currentData.externalIdentities.length}.
            </Alert>
          )}
          <TextField
            label="Підстава об’єднання"
            required
            value={reason}
            disabled={state.isLoading}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            onChange={(event) => setReason(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={state.isLoading} onClick={onClose}>
          Скасувати
        </Button>
        <Button
          color="warning"
          disabled={
            state.isLoading ||
            !victim.currentData ||
            victim.isFetching ||
            !reason.trim() ||
            !customer.canMerge
          }
          onClick={() => void submit()}
        >
          Підтвердити об’єднання
        </Button>
      </DialogActions>
    </Dialog>
  );
}
