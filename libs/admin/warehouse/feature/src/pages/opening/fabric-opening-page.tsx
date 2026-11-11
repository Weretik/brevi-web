import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import {
  useGetFabricMovementsQuery,
  useGetFabricStockChoicesQuery,
  useOpenFabricStockMutation,
} from '@admin/warehouse/data-access';
import {
  createFabricOpeningValues,
  defaultFabricMovementQuery,
  fabricOpeningBody,
  formatMeters,
  kyivToday,
  validateFabricOpening,
} from '@admin/warehouse/model';
import {
  FabricMovementPager,
  FabricMovementsTable,
  FabricOpeningForm,
  StockReasonDialog,
} from '@admin/warehouse/ui';
import { Alert, Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useMovementReversal } from '../../hooks/movements/use-movement-reversal';
import { operationMessage, useStockOperation } from '../../hooks/operations/use-stock-operation';

/**
 * «Склад тканин › Початкові залишки»: what lies on the shelf when the stock starts, once per fabric
 * and colour; later changes are a receipt or «Уточнити». Below are the openings not taken back.
 */
export function FabricOpeningPage() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const openings = useGetFabricMovementsQuery({
    ...defaultFabricMovementQuery,
    kind: 'Opening',
    page,
  });
  const canMove = Boolean(openings.data?.permissions.canMove);
  const choices = useGetFabricStockChoicesQuery(undefined, { skip: !canMove });
  const [open] = useOpenFabricStockMutation();
  const reversal = useMovementReversal(setMessage);
  const form = useStockOperation({
    initial: () => createFabricOpeningValues(kyivToday()),
    validate: validateFabricOpening,
    body: fabricOpeningBody,
    send: (body) => open(body).unwrap(),
    fallback: 'Не вдалося внести початковий залишок.',
    onSaved: (result, values) => {
      setMessage(operationMessage(result, 'Початковий залишок внесено.'));
      form.reset({ ...createFabricOpeningValues(values.operationDate), fabricId: values.fabricId });
    },
  });

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Початкові залишки"
        subtitle="Один раз на тканину й колір, коли склад починають вести. Далі — прихід або «Уточнити»."
        actions={null}
      />
      <ReferenceListAlerts
        error={openings.error ? 'Не вдалося завантажити початкові залишки.' : null}
        loading={openings.isFetching}
        onRetry={() => void openings.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      {canMove && (
        <Paper
          variant="outlined"
          component="form"
          aria-label="Внести початковий залишок"
          sx={{ p: 2, mb: 3 }}
          onSubmit={(event) => {
            event.preventDefault();
            void form.save();
          }}
        >
          <Stack sx={{ gap: 2 }}>
            {choices.isFetching && <LinearProgress />}
            {choices.error && (
              <Alert severity="error">Не вдалося завантажити тканини й кольори.</Alert>
            )}
            {form.message && <Alert severity="error">{form.message}</Alert>}
            {choices.data && (
              <FabricOpeningForm
                values={form.values}
                errors={form.errors}
                choices={choices.data}
                disabled={form.saving}
                onChange={form.change}
              />
            )}
            <Box>
              <Button type="submit" variant="contained" disabled={form.saving || !choices.data}>
                Внести початковий залишок
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>
        Внесені початкові залишки
      </Typography>
      {openings.data && (
        <>
          <FabricMovementsTable
            rows={openings.data.rows}
            filtered={false}
            onReverse={canMove ? reversal.request : null}
          />
          <FabricMovementPager
            page={page}
            hasMore={openings.data.hasMore}
            disabled={openings.isFetching}
            onPage={setPage}
          />
        </>
      )}
      <StockReasonDialog
        open={reversal.pending !== null}
        title="Сторнувати початковий залишок?"
        text={
          reversal.pending
            ? `${reversal.pending.fabricName}, ${reversal.pending.color}: ${formatMeters(reversal.pending.delta)} буде відмінено зворотним записом. Після цього пару можна внести ще раз лише як прихід.`
            : ''
        }
        confirmLabel="Сторнувати"
        reason={reversal.reason}
        error={reversal.error}
        busy={reversal.busy}
        onChange={reversal.change}
        onClose={reversal.cancel}
        onConfirm={() => void reversal.confirm()}
      />
    </Box>
  );
}

export default FabricOpeningPage;
