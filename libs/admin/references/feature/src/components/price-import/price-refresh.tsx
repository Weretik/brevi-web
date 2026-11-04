import { PriceImportPreview, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { usePriceRefresh } from '../../hooks/price-import/use-price-refresh';

import type { PriceImportResult, PriceSource } from '@admin/references/model';

interface Props {
  source: PriceSource;
  onApplied: (result: PriceImportResult) => void;
}

/** «Оновити зараз»: read the supplier's site or price lists now, see what changes, then apply. */
export function PriceRefresh({ source, onApplied }: Props) {
  const refresh = usePriceRefresh(source, onApplied);

  return (
    <ReferenceFormSection title="Оновити зараз">
      <Typography variant="body2" color="text.secondary">
        Не чекаючи понеділка: прочитаємо ціни постачальника й покажемо, що зміниться. Записуємо лише
        після «Застосувати». Сайт може відповідати до хвилини.
      </Typography>
      {refresh.message && <Alert severity="error">{refresh.message}</Alert>}
      {refresh.preview && <PriceImportPreview result={refresh.preview} showTiers={false} />}
      <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant={refresh.preview ? 'outlined' : 'contained'}
          disabled={refresh.sending}
          onClick={() => void refresh.check()}
        >
          {refresh.sending && !refresh.preview && (
            <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />
          )}
          Перевірити
        </Button>
        {refresh.preview && (
          <Button
            variant="contained"
            disabled={refresh.preview.changed === 0 || refresh.sending}
            onClick={() => void refresh.apply()}
          >
            {refresh.sending && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
            Застосувати ({refresh.preview.changed})
          </Button>
        )}
      </Stack>
    </ReferenceFormSection>
  );
}
