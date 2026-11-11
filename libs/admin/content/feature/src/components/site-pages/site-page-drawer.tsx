import { SitePageForm, SitePageView } from '@admin/content/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useSitePageEditor } from '../../hooks/site-pages/use-site-page-editor';

import type { SitePage, SitePagesViewer } from '@admin/content/model';

interface Props {
  page: SitePage;
  viewer: SitePagesViewer;
  onClose: () => void;
  /** Saved: the panel closes and the list shows the text. */
  onDone: (text: string) => void;
}

/** One page of «Контент → Сторінки сайту» in the «Цех» side panel. */
export function SitePageDrawer({ page, viewer, onClose, onDone }: Props) {
  const editor = useSitePageEditor(page, onDone);
  const readOnly = editor.values === null;

  return (
    <ReferenceEditorDrawer
      titleId="site-page-drawer-title"
      title={page.name}
      description="Заголовок і опис для пошуку, основний текст і часті запитання сторінки. Порожнє поле повертає текст сайту."
      formId="site-page-form"
      paperWidth={760}
      readOnly={readOnly}
      saving={editor.saving}
      submitLabel="Зберегти"
      editLabel={viewer.canEdit ? 'Редагувати' : null}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.submit}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.values ? (
          <SitePageForm
            values={editor.values}
            errors={editor.errors}
            disabled={editor.saving}
            titleHasBrand={page.titleHasBrand}
            onChange={editor.change}
          />
        ) : (
          <SitePageView page={page} />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
