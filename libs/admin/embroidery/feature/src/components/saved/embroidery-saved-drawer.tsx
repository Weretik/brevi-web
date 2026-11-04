import {
  useDeleteEmbroideryCalculationMutation,
  useGetEmbroideryCalculationQuery,
} from '@admin/embroidery/data-access';
import { embroiderySavedTitle } from '@admin/embroidery/model';
import {
  EmbroideryBreakdownTable,
  EmbroideryPriceCards,
  EmbroiderySavedSummaryView,
} from '@admin/embroidery/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
} from '@mui/material';
import { useState } from 'react';

import { useEmbroideryCopy } from '../../hooks/calculation/use-embroidery-copy';

import type { EmbroideryCalculationRequest } from '@admin/embroidery/model';

interface Props {
  id: number;
  canDelete: boolean;
  onClose: () => void;
  onRepeat: (request: EmbroideryCalculationRequest) => void;
}

/** A saved calculation as it was saved; «Повторити розрахунок» loads its form with the current rates. */
export function EmbroiderySavedDrawer({ id, canDelete, onClose, onRepeat }: Props) {
  const query = useGetEmbroideryCalculationQuery(id);
  const [remove, removing] = useDeleteEmbroideryCalculationMutation();
  const [confirming, setConfirming] = useState(false);
  const copier = useEmbroideryCopy();
  const saved = query.data;

  const confirmDelete = async () => {
    const result = await remove(id);
    setConfirming(false);
    if (!('error' in result)) onClose();
  };

  return (
    <ReferenceEditorDrawer
      titleId="embroidery-saved-title"
      title={
        saved
          ? `${saved.summary.number} · ${embroiderySavedTitle(saved.summary.name)}`
          : 'Розрахунок'
      }
      description="Збережений розрахунок не змінюється, навіть якщо ставки змінили."
      formId="embroidery-saved-form"
      paperWidth={520}
      readOnly
      saving={removing.isLoading}
      editLabel={saved ? 'Повторити розрахунок' : null}
      onClose={onClose}
      onEdit={() => saved && onRepeat(saved.input)}
      onSubmit={() => undefined}
    >
      {query.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress aria-label="Завантаження розрахунку" />
        </Box>
      ) : !saved ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => void query.refetch()}>
              Повторити
            </Button>
          }
        >
          {(query.error as { message?: string } | undefined)?.message ??
            'Не вдалося відкрити розрахунок.'}
        </Alert>
      ) : (
        <Stack sx={{ gap: 2 }}>
          {removing.isError && (
            <Alert severity="error">
              {(removing.error as { message?: string } | undefined)?.message ??
                'Не вдалося видалити розрахунок.'}
            </Alert>
          )}
          <EmbroideryPriceCards
            prices={saved.result.prices}
            quantity={saved.input.quantity}
            error={saved.result.error}
            missing={saved.result.missing}
            missingAction={null}
            waiting={false}
            fetching={false}
            onCopy={(price) => void copier.copy(saved.result.prices, price, saved.input.quantity)}
          />
          <EmbroiderySavedSummaryView saved={saved} />
          {saved.result.cost && <EmbroideryBreakdownTable cost={saved.result.cost} />}
          {canDelete && (
            <Box>
              <Button color="error" onClick={() => setConfirming(true)}>
                Видалити розрахунок
              </Button>
            </Box>
          )}
        </Stack>
      )}
      <Dialog open={confirming} onClose={() => setConfirming(false)}>
        <DialogTitle>Видалити {saved?.summary.number}?</DialogTitle>
        <DialogContent>
          <DialogContentText>Розрахунок зникне зі списку назавжди.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)}>Скасувати</Button>
          <Button color="error" variant="contained" onClick={() => void confirmDelete()}>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={copier.message !== null}
        autoHideDuration={3000}
        onClose={copier.close}
        message={copier.message}
      />
    </ReferenceEditorDrawer>
  );
}
