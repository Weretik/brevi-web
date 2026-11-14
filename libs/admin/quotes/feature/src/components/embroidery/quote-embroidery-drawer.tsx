import { embroiderySavedTitle, formatEmbroideryUnitPrice } from '@admin/embroidery/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';

import { useQuoteEmbroideryPicker } from '../../hooks/embroidery/use-quote-embroidery-picker';

import type { EmbroiderySavedSummary } from '@admin/embroidery/model';
import type { Quote } from '@admin/quotes/model';

interface Props {
  /** Saves the КП first when it is new or has unsaved changes; null when it could not be saved. */
  ensureSaved: () => Promise<Quote | null>;
  onClose: () => void;
  onAdded: (quote: Quote) => void;
}

const label = (x: EmbroiderySavedSummary) => `${x.number} · ${embroiderySavedTitle(x.name)}`;

/** Only what a manager needs: the client and the one saved price, no stitches or hoops. */
const details = (x: EmbroiderySavedSummary) =>
  [x.customerName, x.price && formatEmbroideryUnitPrice(x.price)].filter(Boolean).join(' · ');

/**
 * «+ Вишивка» inside the КП: picks a saved «Ціна вишивки» calculation and adds it with its one saved price as
 * one row at the end, the same as «Додати в КП» on «Збережені».
 */
export function QuoteEmbroideryDrawer({ ensureSaved, onClose, onAdded }: Props) {
  const {
    setSearch,
    calculation,
    setCalculation,
    tried,
    saveFailed,
    list,
    adding,
    options,
    submit,
  } = useQuoteEmbroideryPicker({ ensureSaved, onAdded });
  return (
    <ReferenceEditorDrawer
      titleId="quote-embroidery-title"
      title="Додати вишивку"
      description="Збережений розрахунок з «Ціна вишивки» стане рядком у кінці КП; ціна не зміниться, навіть якщо ставки змінять."
      formId="quote-embroidery-form"
      paperWidth={480}
      readOnly={false}
      saving={adding.isLoading}
      submitLabel="Додати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2.5 }}>
        {adding.isError && (
          <Alert severity="error">
            {(adding.error as { message?: string } | undefined)?.message ??
              'Не вдалося додати вишивку в КП.'}
          </Alert>
        )}
        {saveFailed && (
          <Alert severity="warning">
            Спершу КП треба зберегти: виправте позначені поля або оновіть сторінку.
          </Alert>
        )}
        {list.isError && <Alert severity="error">Не вдалося завантажити розрахунки вишивки.</Alert>}
        <Autocomplete<EmbroiderySavedSummary>
          options={options}
          value={calculation}
          disabled={adding.isLoading}
          loading={list.isFetching}
          getOptionLabel={label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          filterOptions={(x) => x}
          noOptionsText="Розрахунків не знайдено"
          onInputChange={(_event, text, reason) => {
            if (reason === 'input') setSearch(text);
          }}
          onChange={(_event, next) => setCalculation(next)}
          renderOption={({ key, ...props }, option) => (
            <li key={key} {...props}>
              <Box>
                <Typography variant="body2">{label(option)}</Typography>
                {details(option) && (
                  <Typography variant="caption" color="text.secondary">
                    {details(option)}
                  </Typography>
                )}
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              label="Розрахунок вишивки"
              error={tried && !calculation}
              helperText={
                tried && !calculation
                  ? 'Оберіть розрахунок.'
                  : 'Пошук за назвою, клієнтом або «ВШ-0042»'
              }
            />
          )}
        />
        {calculation?.customerName && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Зроблено для клієнта
            </Typography>
            <Typography variant="body1">{calculation.customerName}</Typography>
          </Box>
        )}
        {calculation?.price && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Ціна для клієнта
            </Typography>
            <Typography variant="body1">{formatEmbroideryUnitPrice(calculation.price)}</Typography>
          </Box>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
