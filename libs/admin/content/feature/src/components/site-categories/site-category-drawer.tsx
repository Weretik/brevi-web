import { siteCategoryName } from '@admin/content/model';
import { SiteCategoryDeleteDialog, SiteCategoryForm, SiteCategoryView } from '@admin/content/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';

import { useSiteCategoryEditor } from '../../hooks/site-categories/use-site-category-editor';

import type { SiteCategoryTarget } from '../../hooks/site-categories/use-site-category-editor';
import type { SiteCategoriesViewer, SiteCategoryRow } from '@admin/content/model';

interface Props {
  target: SiteCategoryTarget;
  /** The whole tree: gives the name, the parents to choose from and whether there are subcategories. */
  rows: readonly SiteCategoryRow[];
  viewer: SiteCategoriesViewer;
  onClose: () => void;
  /** The category was saved or deleted: the panel closes and the list shows the text. */
  onDone: (text: string) => void;
}

/** A category of «Контент → Розділи» in the «Цех» side panel: view, then «Редагувати»; a new one opens as a form. */
export function SiteCategoryDrawer({ target, rows, viewer, onClose, onDone }: Props) {
  const editor = useSiteCategoryEditor(target, onDone);
  const readOnly = editor.mode === 'view';
  const row = target.id === null ? null : (rows.find((item) => item.id === target.id) ?? null);
  const name = row ? siteCategoryName(row) : 'Новий розділ';
  const hasChildren = row !== null && rows.some((item) => item.parentId === row.id);
  const parents = rows.filter((item) => item.parentId === null && item.id !== target.id);
  const parentId = editor.category?.category.parentId ?? row?.parentId ?? null;
  const parent = parentId === null ? null : (rows.find((item) => item.id === parentId) ?? null);

  return (
    <>
      <ReferenceEditorDrawer
        titleId="site-category-drawer-title"
        title={editor.isNew ? 'Новий розділ сайту' : readOnly ? name : 'Розділ сайту'}
        description={
          editor.isNew
            ? 'Розділ з’явиться в кінці списку. Назва українською обов’язкова, решту можна заповнити пізніше.'
            : readOnly
              ? 'Як розділ виглядає на сайті: місце в каталозі, адреса, SEO і текст.'
              : `${name}. Тексти заповнюються окремо українською та російською.`
        }
        formId="site-category-form"
        paperWidth={680}
        readOnly={readOnly}
        saving={editor.saving}
        submitLabel={editor.isNew ? 'Додати' : 'Зберегти'}
        editLabel={viewer.canEdit && editor.category ? 'Редагувати' : null}
        readActions={
          viewer.canDelete &&
          editor.category && (
            <Button type="button" color="error" onClick={editor.askDelete}>
              Видалити розділ
            </Button>
          )
        }
        onClose={onClose}
        onEdit={editor.enableEditing}
        onSubmit={editor.submit}
      >
        <Stack sx={{ gap: 2 }}>
          {editor.loading && <LinearProgress aria-label="Завантаження розділу" />}
          {editor.loadError && <Alert severity="error">{editor.loadError}</Alert>}
          {editor.message && <Alert severity="error">{editor.message}</Alert>}
          {editor.values ? (
            <SiteCategoryForm
              values={editor.values}
              errors={editor.errors}
              disabled={editor.saving}
              parents={parents}
              hasChildren={hasChildren}
              isNew={editor.isNew}
              onChange={editor.change}
            />
          ) : (
            editor.category && <SiteCategoryView category={editor.category} parent={parent} />
          )}
        </Stack>
      </ReferenceEditorDrawer>
      <SiteCategoryDeleteDialog
        name={editor.confirmingDelete ? name : null}
        deleting={editor.deleting}
        onClose={editor.cancelDelete}
        onConfirm={() => void editor.confirmDelete()}
      />
    </>
  );
}
