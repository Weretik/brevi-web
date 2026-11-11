import { useGetSiteCategoriesQuery } from '@admin/content/data-access';
import {
  ContentProductDeleteDialog,
  ContentProductForm,
  ContentProductView,
} from '@admin/content/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';

import { useContentProductEditor } from '../../hooks/product-pages/use-content-product-editor';

import type { ContentProductRow, ContentProductsViewer } from '@admin/content/model';

interface Props {
  row: ContentProductRow;
  viewer: ContentProductsViewer;
  onClose: () => void;
  /** The page was saved or deleted: the panel closes and the list shows the text. */
  onDone: (text: string) => void;
}

/** A product of «Контент → Товари» in the «Цех» side panel: view, then «Редагувати». */
export function ContentProductDrawer({ row, viewer, onClose, onDone }: Props) {
  // Without the right to see «Розділи сайту» the list does not load: categories stay as they are.
  const categories = useGetSiteCategoriesQuery().currentData ?? null;
  const editor = useContentProductEditor(row.productId, categories !== null, onDone);
  const readOnly = editor.mode === 'view';
  const product = editor.product;

  return (
    <>
      <ReferenceEditorDrawer
        titleId="content-product-drawer-title"
        title={readOnly ? row.name : 'Сторінка товару на сайті'}
        description={
          readOnly
            ? 'Що сайт показує про цей товар. Назва, ціни й тканини беруться з «Товари».'
            : `${row.name}. Тексти заповнюються окремо українською та російською.`
        }
        formId="content-product-form"
        paperWidth={680}
        readOnly={readOnly}
        saving={editor.saving}
        editLabel={viewer.canEdit && product ? 'Редагувати' : null}
        readActions={
          viewer.canDelete &&
          product?.product.hasPage && (
            <Button type="button" color="error" onClick={editor.askDelete}>
              Видалити сторінку
            </Button>
          )
        }
        onClose={onClose}
        onEdit={editor.enableEditing}
        onSubmit={editor.submit}
      >
        <Stack sx={{ gap: 2 }}>
          {editor.loading && <LinearProgress aria-label="Завантаження сторінки товару" />}
          {editor.loadError && <Alert severity="error">{editor.loadError}</Alert>}
          {editor.message && <Alert severity="error">{editor.message}</Alert>}
          {product &&
            (editor.values ? (
              <ContentProductForm
                values={editor.values}
                errors={editor.errors}
                disabled={editor.saving}
                categories={categories}
                onChange={editor.change}
              />
            ) : (
              <ContentProductView product={product} categories={categories} />
            ))}
        </Stack>
      </ReferenceEditorDrawer>
      <ContentProductDeleteDialog
        name={editor.confirmingDelete ? row.name : null}
        deleting={editor.deleting}
        onClose={editor.cancelDelete}
        onConfirm={() => void editor.confirmDelete()}
      />
    </>
  );
}
