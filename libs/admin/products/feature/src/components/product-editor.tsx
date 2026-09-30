import { createProduct, replaceProduct } from '@admin/products/data-access';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ProductBaseFields } from './product-base-fields';
import { ProductCharacteristicFields } from './product-characteristic-fields';
import { ProductDescriptionFields } from './product-description-fields';
import { ProductInformationFields } from './product-information-fields';
import { ProductPhotoFields } from './product-photo-fields';
import { ProductTypeChangeDialog } from './product-type-change-dialog';
import { ProductTypeFields } from './product-type-fields';
import { useProductLookups } from '../hooks/use-product-lookups';
import { changeProductType, emptyProductDraft } from '../model/product-draft';
import { validateProductDraft } from '../model/product-validation';

import type { ProductDraft } from '@admin/products/data-access';

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
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [pendingType, setPendingType] = useState<ProductDraft['type'] | null>(null);
  const {
    lookups,
    error: lookupError,
    loading: lookupsLoading,
    reload: reloadLookups,
    setLookups,
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
    setSaving(true);
    savingRef.current = true;
    setMessage(null);
    try {
      const saved =
        productId === undefined ? await createProduct(id, draft) : await replaceProduct(id, draft);
      navigate(`/references/products/${saved.id}`, { state: { product: saved } });
    } catch (cause) {
      if (cause && typeof cause === 'object' && 'fieldErrors' in cause) {
        setErrors((cause as { fieldErrors: Record<string, string> }).fieldErrors);
      }
      setMessage(cause instanceof Error ? cause.message : 'Не вдалося зберегти товар.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
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
        <Stack
          component="form"
          sx={{ gap: 3 }}
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
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
          <ProductDescriptionFields draft={draft} setDraft={setDraft} errors={errors} />
          <ProductPhotoFields
            draft={draft}
            setDraft={setDraft}
            errors={errors}
            lookups={lookups}
            onMediaRefreshed={(media) =>
              setLookups((current) => ({
                ...current,
                media,
              }))
            }
          />
          <Divider />
          <ProductTypeFields draft={draft} setDraft={setDraft} errors={errors} lookups={lookups} />
          <Divider />
          <ProductInformationFields draft={draft} setDraft={setDraft} errors={errors} />
          <ProductCharacteristicFields draft={draft} setDraft={setDraft} errors={errors} />
          <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
            <Button
              component={Link}
              to={productId ? `/references/products/${productId}` : '/references/products'}
            >
              Скасувати
            </Button>
            <Button type="submit" variant="contained" disabled={saving || Boolean(lookupError)}>
              {saving ? 'Збереження…' : 'Зберегти'}
            </Button>
          </Stack>
        </Stack>
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
