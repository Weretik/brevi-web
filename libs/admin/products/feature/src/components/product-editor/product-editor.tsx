import { useCreateProductMutation, useReplaceProductMutation } from '@admin/products/data-access';
import { changeProductType, emptyProductDraft, validateProductDraft } from '@admin/products/model';
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
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ProductPhotoUpload } from './product-photo-upload';
import { useProductLookups } from '../../hooks/product-editor/use-product-lookups';

import type { ProductDraft } from '@admin/products/model';

interface Props {
  initial?: ProductDraft;
  productId?: number;
}

export function ProductEditor({ initial, productId }: Props) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProductDraft>(() => initial ?? emptyProductDraft());
  const [newId, setNewId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [createProduct, createState] = useCreateProductMutation();
  const [replaceProduct, replaceState] = useReplaceProductMutation();
  const saving = createState.isLoading || replaceState.isLoading;
  const savingRef = useRef(false);
  const [pendingType, setPendingType] = useState<ProductDraft['type'] | null>(null);
  const {
    lookups,
    error: lookupError,
    loading: lookupsLoading,
    reload: reloadLookups,
  } = useProductLookups();

  async function save() {
    if (savingRef.current) return;
    const id = productId ?? Number(newId);
    const nextErrors = validateProductDraft(
      draft,
      productId === undefined ? id : undefined,
      lookups.references.filter((item) => item.unit === '%').map((item) => item.id),
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setMessage('Перевірте позначені поля.');
      return;
    }
    savingRef.current = true;
    setMessage(null);
    try {
      const saved =
        productId === undefined
          ? await createProduct({ id, draft }).unwrap()
          : await replaceProduct({ id, draft }).unwrap();
      navigate(`/references/products/${saved.id}`, { state: { product: saved } });
    } catch (cause) {
      if (isAdminApiError(cause)) setErrors(cause.fieldErrors);
      setMessage(adminApiErrorMessage(cause, 'Не вдалося зберегти товар.'));
    } finally {
      savingRef.current = false;
    }
  }

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
            void save();
          }}
        >
          <ProductFormSection label="Основна інформація" fullWidth>
            <Stack sx={{ gap: 2 }}>
              {productId === undefined && (
                <TextField
                  label="ID товару"
                  type="number"
                  value={newId}
                  onChange={(event) => setNewId(event.target.value)}
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
                onTypeChange={(type) => setPendingType(type === draft.type ? null : type)}
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
              renderUpload={(onReady) => <ProductPhotoUpload onReady={onReady} />}
            />
          </ProductFormSection>
          <ProductFormSection
            label={draft.type === 'Sewing' ? 'Швейний товар' : 'Засіб індивідуального захисту'}
          >
            <ProductTypeFields
              draft={draft}
              setDraft={setDraft}
              errors={errors}
              lookups={lookups}
            />
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
        open={pendingType !== null}
        onCancel={() => setPendingType(null)}
        onConfirm={() => {
          if (pendingType) setDraft((current) => changeProductType(current, pendingType));
          setPendingType(null);
        }}
      />
    </Box>
  );
}
