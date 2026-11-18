import { useGetEmbroideryCalculationQuery } from '@admin/embroidery/data-access';
import { embroiderySavedTitle } from '@admin/embroidery/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import { Alert, Box, Button, CircularProgress, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EmbroiderySavedDeleteDialog } from './embroidery-saved-delete-dialog';
import { EmbroiderySavedDetails } from './embroidery-saved-details';
import { useEmbroideryCopy } from '../../../hooks/calculation/use-embroidery-copy';
import { useEmbroiderySavedDeletion } from '../../../hooks/saved/use-embroidery-saved-deletion';
import { EmbroideryAddToQuoteDrawer } from '../list/embroidery-add-to-quote-drawer';

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
  const deletion = useEmbroiderySavedDeletion(id, onClose);
  const copier = useEmbroideryCopy();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  // Adding the price to a КП creates a line there: «Створення» on «Комерційні пропозиції».
  const canAddToQuote = usePageRights().can('create', 'quotes');
  const [addedTo, setAddedTo] = useState<{ id: number; number: string } | null>(null);
  const saved = query.data;

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
      saving={deletion.deleting}
      editLabel={saved ? 'Повторити розрахунок' : null}
      editRight={null}
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
        <EmbroiderySavedDetails
          saved={saved}
          deleteError={deletion.error}
          canAddToQuote={canAddToQuote}
          canDelete={canDelete}
          onAdd={() => setAdding(true)}
          onCopy={(price) => void copier.copy(saved.result.prices, price, saved.input.quantity)}
          onDelete={deletion.ask}
        />
      )}
      <EmbroiderySavedDeleteDialog
        open={deletion.confirming}
        number={saved?.summary.number}
        onCancel={deletion.cancel}
        onConfirm={() => void deletion.confirm()}
      />
      {adding && saved && (
        <EmbroideryAddToQuoteDrawer
          summary={saved.summary}
          onClose={() => setAdding(false)}
          onAdded={(quote) => {
            setAdding(false);
            setAddedTo(quote);
          }}
        />
      )}
      <Snackbar
        open={addedTo !== null}
        autoHideDuration={8000}
        onClose={() => setAddedTo(null)}
        message={`Вишивку додано в ${addedTo?.number ?? 'КП'}.`}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => addedTo && navigate(`/crm/quotes/${addedTo.id}`)}
          >
            Відкрити КП
          </Button>
        }
      />
      <Snackbar
        open={copier.message !== null}
        autoHideDuration={3000}
        onClose={copier.close}
        message={copier.message}
      />
    </ReferenceEditorDrawer>
  );
}
