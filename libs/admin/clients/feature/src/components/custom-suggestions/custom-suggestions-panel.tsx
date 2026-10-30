import { useGetCustomSuggestionsQuery } from '@admin/clients/data-access';
import { applyCustomSuggestions, suggestionProductTypes } from '@admin/clients/model';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CustomSuggestionsReview } from './custom-suggestions-review';

import type { CustomConfiguration, CustomSuggestions } from '@admin/clients/model';

export function CustomSuggestionsPanel({
  configuration,
  disabled,
  onApply,
}: {
  configuration: CustomConfiguration;
  disabled: boolean;
  onApply: (configuration: CustomConfiguration) => void;
}) {
  const productType = suggestionProductTypes.find((value) => value === configuration.productType);
  const query = useGetCustomSuggestionsQuery(
    { productType: productType ?? suggestionProductTypes[0], season: configuration.season },
    { skip: !productType },
  );
  const [review, setReview] = useState<{ value: CustomSuggestions; fingerprint: string } | null>(
    null,
  );
  const fingerprint = JSON.stringify(configuration);
  const value =
    !query.error &&
    productType &&
    query.currentData?.productType === productType &&
    query.currentData.season === configuration.season
      ? query.currentData
      : undefined;
  const stale = !!review && (review.fingerprint !== fingerprint || review.value !== value);
  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="subtitle1">
        Підказки норм з моделей
      </Typography>
      {!productType && (
        <Typography>Підказки доступні для типів: {suggestionProductTypes.join(', ')}.</Typography>
      )}
      {productType && query.isFetching && (
        <CircularProgress size={24} aria-label="Завантаження підказок" />
      )}
      {productType && query.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void query.refetch()}>Повторити підказки</Button>}
        >
          Підказки недоступні або доступ обмежено.
        </Alert>
      )}
      {value?.sourceLimitReached && (
        <Alert severity="warning">
          Досягнуто межі джерела моделей. Часткові норми не застосовуються.
        </Alert>
      )}
      {value && !value.sourceLimitReached && !value.norms.length && (
        <Typography>
          Достатньо підтверджених спільних норм не знайдено. Поточний склад збережено.
        </Typography>
      )}
      {value && !value.sourceLimitReached && value.sampleSize >= 2 && !!value.norms.length && (
        <>
          <Typography>
            Вибірка: {value.sampleSize} моделей; запропоновано норм: {value.norms.length}. Ціни не
            переносяться.
          </Typography>
          <Button
            disabled={disabled || query.isFetching}
            onClick={() => setReview({ value, fingerprint })}
          >
            Переглянути підказки
          </Button>
        </>
      )}
      {review && !query.error && (
        <CustomSuggestionsReview
          suggestions={review.value}
          stale={stale}
          disabled={disabled || query.isFetching}
          onCancel={() => setReview(null)}
          onConfirm={() => {
            if (disabled || query.isFetching || stale) return;
            onApply(applyCustomSuggestions(configuration, review.value));
            setReview(null);
          }}
        />
      )}
    </Stack>
  );
}
