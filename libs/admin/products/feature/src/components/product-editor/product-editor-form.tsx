import {
  ProductCharacteristicFields,
  ProductBaseFields,
  ProductDescriptionFields,
  ProductFormSection,
  ProductInformationFields,
  ProductPhotoFields,
} from '@admin/products/ui';
import { Box, Button, Stack, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

import { ProductPhotoPicker } from './product-photo-picker';
import { ProductTypeSection } from './product-type-section';

import type { useProductForm } from '../../hooks/product-editor/use-product-form';
import type { useProductLookups } from '../../hooks/product-editor/use-product-lookups';

interface Props {
  form: ReturnType<typeof useProductForm>;
  lookups: ReturnType<typeof useProductLookups>['lookups'];
  lookupError: string | null | undefined;
  productId?: number;
  legacyNormsLocked: boolean;
}

/** The product form: base fields, descriptions, photos, the type section, blocks and tables. */
export function ProductEditorForm({
  form,
  lookups,
  lookupError,
  productId,
  legacyNormsLocked,
}: Props) {
  const { draft, setDraft, errors, saving } = form;
  return (
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
      <ProductTypeSection
        form={form}
        lookups={lookups}
        existingProduct={productId !== undefined}
        locked={legacyNormsLocked}
      />
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
  );
}
