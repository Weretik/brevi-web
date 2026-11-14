import {
  ProductCharacteristicFields,
  ProductBaseFields,
  ProductDescriptionFields,
  ProductFormSection,
  ProductInformationFields,
  ProductPhotoFields,
  ProductTypeChangeDialog,
  ProductTypeFields,
} from '@admin/products/ui';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { LegacySewingNormLockNotice } from './legacy-sewing-norm-lock-notice';
import { ProductPhotoPicker } from './product-photo-picker';
import { useProductForm } from '../../hooks/product-editor/use-product-form';
import { useProductLookups } from '../../hooks/product-editor/use-product-lookups';

import type { ProductDraft } from '@admin/products/model';

interface Props {
  initial?: ProductDraft;
  productId?: number;
  legacyNormsLocked?: boolean;
  legacyNormsLoading?: boolean;
  legacyNormsMessage?: string;
  legacyNormsError?: string | null;
  onRetryLegacyNorms?: () => void;
}

export function ProductEditor({
  initial,
  productId,
  legacyNormsLocked = false,
  legacyNormsLoading = false,
  legacyNormsMessage,
  legacyNormsError,
  onRetryLegacyNorms,
}: Props) {
  const form = useProductForm({ initial, productId });
  const { draft, setDraft, errors, message, saving } = form;
  const {
    lookups,
    error: lookupError,
    loading: lookupsLoading,
    reload: reloadLookups,
  } = useProductLookups();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200 }}>
      <Button
        component={Link}
        to={productId ? `/references/products/${productId}` : '/references/products'}
      >
        ← Назад
      </Button>
      <Typography variant="h4" component="h1" sx={{ my: 2 }}>
        {productId ? 'Редагування товару' : 'Новий товар'}
      </Typography>
      {lookupError && (
        <Alert
          severity="error"
          action={<Button onClick={reloadLookups}>Повторити</Button>}
          sx={{ mb: 2 }}
        >
          {lookupError}
        </Alert>
      )}
      <LegacySewingNormLockNotice
        locked={legacyNormsLocked}
        loading={legacyNormsLoading}
        message={legacyNormsMessage}
        error={legacyNormsError}
        productId={productId}
        onRetry={onRetryLegacyNorms}
      />
      {message && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
          {message === 'Товар не знайдено.' && (
            <Button component={Link} to="/references/products">
              До товарів
            </Button>
          )}
        </Alert>
      )}
      {!lookupsLoading && !lookupError && lookups.categories.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Категорій поки немає.
        </Alert>
      )}
      {!lookupsLoading &&
        !lookupError &&
        draft.type === 'Sewing' &&
        lookups.fabrics.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Тканин поки немає.
          </Alert>
        )}
      {!lookupsLoading &&
        !lookupError &&
        draft.type === 'Ppe' &&
        lookups.suppliers.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Постачальників поки немає.
          </Alert>
        )}
      {lookupsLoading && <CircularProgress aria-label="Завантаження довідників" />}
      {!lookupsLoading && (
        <Box
          component="form"
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
          }}
          onSubmit={(event) => {
            event.preventDefault();
            void form.save(
              lookups.references.filter((item) => item.unit === '%').map((item) => item.id),
            );
          }}
        >
          <ProductFormSection label="Основна інформація" fullWidth>
            <Stack sx={{ gap: 2 }}>
              {productId === undefined && (
                <TextField
                  label="ID товару"
                  type="number"
                  value={form.newId}
                  onChange={(event) => form.setNewId(event.target.value)}
                  error={Boolean(errors['id'])}
                  helperText={errors['id']}
                  required
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                />
              )}
              <ProductBaseFields
                draft={draft}
                setDraft={setDraft}
                errors={errors}
                lookups={lookups}
                onTypeChange={(type) => {
                  if (legacyNormsLocked && draft.type === 'Sewing' && type === 'Ppe') {
                    form.setMessage(
                      'Тип не змінено: спочатку перенесіть роботу зі старими нормами до розділу артикулів і складу.',
                    );
                    return;
                  }
                  form.requestType(type);
                }}
              />
            </Stack>
          </ProductFormSection>
          <ProductFormSection label="Опис двома мовами" fullWidth>
            <ProductDescriptionFields draft={draft} setDraft={setDraft} errors={errors} />
          </ProductFormSection>
          <ProductFormSection label="Фото" fullWidth>
            <ProductPhotoFields
              draft={draft}
              setDraft={setDraft}
              errors={errors}
              lookups={lookups}
              renderPicker={(alreadyAddedIds, onPick) => (
                <ProductPhotoPicker
                  alreadyAddedIds={alreadyAddedIds}
                  knownIds={lookups.media.map((media) => media.id)}
                  onPick={onPick}
                />
              )}
            />
          </ProductFormSection>
          <ProductFormSection
            label={draft.type === 'Sewing' ? 'Швейний товар' : 'Засіб індивідуального захисту'}
          >
            {draft.type === 'Sewing' && legacyNormsLocked ? (
              <Box component="fieldset" disabled sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
                <Box
                  component="legend"
                  sx={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                  }}
                >
                  Швейні норми старого формату
                </Box>
                <ProductTypeFields
                  existingProduct={productId !== undefined}
                  draft={draft}
                  setDraft={setDraft}
                  errors={errors}
                  lookups={lookups}
                />
              </Box>
            ) : (
              <ProductTypeFields
                existingProduct={productId !== undefined}
                draft={draft}
                setDraft={setDraft}
                errors={errors}
                lookups={lookups}
              />
            )}
          </ProductFormSection>
          <ProductFormSection label="Інформаційні блоки">
            <ProductInformationFields draft={draft} setDraft={setDraft} errors={errors} />
          </ProductFormSection>
          <ProductFormSection label="Таблиці характеристик" fullWidth>
            <ProductCharacteristicFields draft={draft} setDraft={setDraft} errors={errors} />
          </ProductFormSection>
          <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
            <Button
              component={Link}
              to={productId ? `/references/products/${productId}` : '/references/products'}
            >
              Скасувати
            </Button>
            <Button type="submit" variant="contained" disabled={saving || Boolean(lookupError)}>
              {saving
                ? productId
                  ? 'Збереження…'
                  : 'Створення…'
                : productId
                  ? 'Зберегти зміни'
                  : 'Створити товар'}
            </Button>
          </Stack>
        </Box>
      )}
      <ProductTypeChangeDialog
        open={form.pendingType !== null}
        onCancel={form.cancelType}
        onConfirm={form.confirmType}
      />
    </Box>
  );
}
