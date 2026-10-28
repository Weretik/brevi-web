import { Alert, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { QuoteItemsEditor } from './quote-items-editor';
import { useQuoteEditor } from '../../../hooks/quotes/use-quote-editor';
import { UnsavedClientDialog } from '../../changes/unsaved-client-dialog';
import { QuoteReloadDialog } from '../changes/quote-reload-dialog';
import { QuoteRecipient } from '../selection/quote-recipient';

import type { QuoteDetail } from '@admin/clients/model';

export function QuoteEditorForm({
  initial,
  reload,
  accessError = false,
}: {
  initial: QuoteDetail | null;
  reload?: () => Promise<QuoteDetail>;
  accessError?: boolean;
}) {
  const navigate = useNavigate();
  const state = useQuoteEditor(initial, reload, (id) =>
    navigate(`/crm/quotes/${id}`, { replace: true }),
  );
  const disabled = state.saving || !state.editable || accessError || state.uncertain;
  return (
    <Stack
      spacing={3}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!accessError) void state.save();
      }}
    >
      <Typography component="h1" variant="h4">
        {state.detail ? `КП · версія ${state.detail.versionNumber}` : 'Нове КП'}
      </Typography>
      {state.detail && (
        <Typography>
          Одержувач: {state.detail.draft.recipientName} ·{' '}
          {state.detail.state === 'draft'
            ? 'Чернетка'
            : state.detail.state === 'ready'
              ? 'Готове'
              : 'Надіслане'}{' '}
          · {state.detail.number ?? 'Номер ще не присвоєно'}
        </Typography>
      )}
      {state.detail && (
        <Typography variant="body2">
          Відповідальний: #{state.detail.ownerId} · Автор версії: #{state.detail.versionActorId}
        </Typography>
      )}
      {!state.editable && <Alert severity="info">Ця версія доступна лише для перегляду.</Alert>}
      {!state.detail && (
        <QuoteRecipient draft={state.draft} disabled={disabled} onChange={state.setDraft} />
      )}
      {state.detail && (
        <Typography variant="body2">
          Клієнт і контакт збережені у версії. Текстові правки не змінюють ціни.
        </Typography>
      )}
      {state.error && <Alert severity="error">{state.error}</Alert>}
      {state.uncertain && (
        <Alert severity="warning">
          Результат запису невідомий. Перевірте його повтором того самого запиту перед подальшим
          редагуванням.
        </Alert>
      )}
      {Object.entries(state.errors)
        .slice(0, 12)
        .map(([field, message]) => (
          <Alert key={field} severity="error">
            {message}
          </Alert>
        ))}
      {state.saved && !state.dirty && (
        <Alert severity="success">
          КП збережено. Серверна версія {state.detail?.versionNumber}.
        </Alert>
      )}
      {state.dirty && <Alert severity="info">Є незбережені зміни.</Alert>}
      <QuoteItemsEditor
        draft={state.draft}
        disabled={disabled}
        now={state.now}
        onChange={state.setDraft}
        onPreview={(variant) => {
          if (!disabled) void state.calculate(variant);
        }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {state.editable && (
          <Button
            variant="contained"
            type="submit"
            disabled={
              state.saving || accessError || (!!state.detail && !state.dirty && !state.uncertain)
            }
          >
            {state.saving
              ? 'Збереження або розрахунок…'
              : state.uncertain
                ? 'Перевірити результат повтором'
                : 'Зберегти чернетку'}
          </Button>
        )}
        {state.detail && (
          <Button disabled={state.saving || state.uncertain} onClick={state.requestReload}>
            Оновити дані із сервера
          </Button>
        )}
        <Button disabled={state.saving} onClick={() => navigate('/crm/quotes')}>
          До списку КП
        </Button>
      </Stack>
      <UnsavedClientDialog blocker={state.blocker} />
      <QuoteReloadDialog
        open={state.confirmReload}
        onCancel={() => state.setConfirmReload(false)}
        onConfirm={() => void state.refresh()}
      />
    </Stack>
  );
}
