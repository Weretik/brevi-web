import {
  useDeleteQuoteIntroTemplateMutation,
  useGetQuoteIntroTemplatesQuery,
} from '@admin/quotes/data-access';
import { quoteIntroLayouts } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { QuoteIntroTemplate } from '@admin/quotes/model';

interface Props {
  onClose: () => void;
  /** Fills the selection; a model that is no longer in the Catalog is left empty with the reason. */
  onApply: (template: QuoteIntroTemplate) => Promise<void>;
}

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short' });
const layoutLabel = (template: QuoteIntroTemplate) =>
  quoteIntroLayouts.find((x) => x.value === template.layout)?.label ?? template.layout;

/** «Готові шаблони»: shared by all staff; the author, Director or Admin may delete one. */
export function QuoteIntroTemplatesDrawer({ onClose, onApply }: Props) {
  const templates = useGetQuoteIntroTemplatesQuery(undefined, { refetchOnMountOrArgChange: true });
  const [remove, removing] = useDeleteQuoteIntroTemplateMutation();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apply = async (template: QuoteIntroTemplate) => {
    setError(null);
    setBusyId(template.id);
    try {
      await onApply(template);
    } catch (cause) {
      setError((cause as { message?: string }).message ?? 'Не вдалося застосувати шаблон.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ReferenceEditorDrawer
      titleId="quote-intro-templates-title"
      title="Готові шаблони"
      description="Збережені добірки моделей і тканин. Ціни беруться актуальні з каталогу."
      formId="quote-intro-templates-form"
      paperWidth={560}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {templates.isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження шаблонів" />
        </Box>
      )}
      {templates.isError && (
        <Alert severity="error">
          {(templates.error as { message?: string }).message ?? 'Не вдалося завантажити шаблони.'}
        </Alert>
      )}
      {templates.data?.length === 0 && (
        <Typography color="text.secondary">
          Шаблонів ще немає. Зберіть добірку і натисніть «Зберегти як шаблон».
        </Typography>
      )}
      <Stack sx={{ gap: 1.5 }}>
        {templates.data?.map((template) => (
          <Box
            key={template.id}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {template.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {layoutLabel(template)} · {template.author.name} ·{' '}
              {dateFormat.format(new Date(template.createdAt))}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {template.pages
                .flatMap((page) =>
                  page.models.map((model) => `${model.productName} (${model.fabricTitle})`),
                )
                .join(', ')}
            </Typography>
            <Stack direction="row" sx={{ gap: 1, mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                disabled={busyId !== null}
                onClick={() => void apply(template)}
              >
                {busyId === template.id ? 'Застосовуємо…' : 'Застосувати'}
              </Button>
              {template.canDelete && (
                <Button
                  size="small"
                  color="error"
                  disabled={removing.isLoading}
                  onClick={async () => {
                    setError(null);
                    try {
                      await remove(template.id).unwrap();
                    } catch (cause) {
                      setError(
                        (cause as { message?: string }).message ?? 'Не вдалося видалити шаблон.',
                      );
                    }
                  }}
                >
                  Видалити
                </Button>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
