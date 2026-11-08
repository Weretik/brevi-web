import { useGetQuoteModelCompositionQuery } from '@admin/quotes/data-access';
import { quoteModelChanges } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';

import type { QuoteItemDraft, QuoteModelChangeKind } from '@admin/quotes/model';

interface Props {
  /** A changed Catalog model of the КП. */
  item: QuoteItemDraft;
  onClose: () => void;
}

const kindLabels: Readonly<Record<QuoteModelChangeKind, string>> = {
  added: 'Додано',
  removed: 'Прибрано',
  changed: 'Змінено',
};

const kindColors: Readonly<Record<QuoteModelChangeKind, string>> = {
  added: 'success.main',
  removed: 'error.main',
  changed: 'warning.dark',
};

/** «Що змінено»: what the changed model has different from its composition in the Catalog, for reading only. */
export function QuoteModelChangesDrawer({ item, onClose }: Props) {
  const composition = useGetQuoteModelCompositionQuery(item.productId ?? 0, {
    skip: item.productId === null,
    refetchOnMountOrArgChange: true,
  });
  const groups = composition.data ? quoteModelChanges(item, composition.data) : null;

  return (
    <ReferenceEditorDrawer
      titleId="quote-model-changes-title"
      title="Що змінено в моделі"
      description={`${item.name}: відмінності від складу моделі в каталозі.`}
      formId="quote-model-changes-form"
      paperWidth={560}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      {composition.isError ? (
        <Alert severity="error">Не вдалося завантажити склад моделі з каталогу.</Alert>
      ) : !groups ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress aria-label="Завантаження складу моделі" />
        </Box>
      ) : groups.length === 0 ? (
        <Typography color="text.secondary">Склад такий самий, як у каталозі.</Typography>
      ) : (
        <Stack sx={{ gap: 2.5 }}>
          {groups.map((group) => (
            <Box key={group.title} component="section">
              <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {group.title}
              </Typography>
              <Stack component="ul" sx={{ m: 0, p: 0, listStyle: 'none', gap: 1 }}>
                {group.changes.map((change) => (
                  <Box
                    component="li"
                    key={`${change.kind}:${change.name}`}
                    sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: kindColors[change.kind], minWidth: 72 }}
                    >
                      {kindLabels[change.kind]}
                    </Typography>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {change.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {change.detail}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
          <Typography variant="caption" color="text.secondary">
            Порівняння з поточним складом моделі в каталозі.
          </Typography>
        </Stack>
      )}
    </ReferenceEditorDrawer>
  );
}
