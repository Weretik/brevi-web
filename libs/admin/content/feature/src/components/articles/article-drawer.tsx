import { articleTitle } from '@admin/content/model';
import { ArticleDeleteDialog, ArticleForm, ArticleView } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';
import { useState } from 'react';

import { useArticleEditor } from '../../hooks/articles/use-article-editor';

import type { ArticlesViewer } from '@admin/content/model';
import type { RichTextImage } from '@admin/shared/ui';

interface Props {
  /** The article to open; null adds a new one. */
  id: number | null;
  viewer: ArticlesViewer;
  onClose: () => void;
  /** The article was saved or deleted: the panel closes and the list shows the text. */
  onDone: (text: string) => void;
}

type PhotosDone = (photos: RichTextImage[]) => void;

/**
 * An article of «Контент → Статті» in the «Цех» side panel: view, then «Редагувати»; a new one opens
 * as a form. The cover and the photos of the text are chosen in the «Фото» library, so every picture
 * of an article lives on our CDN.
 */
export function ArticleDrawer({ id, viewer, onClose, onDone }: Props) {
  const editor = useArticleEditor(id, onDone);
  // The form waiting for photos of the library; null keeps the library closed.
  const [picking, setPicking] = useState<{ done: PhotosDone } | null>(null);
  const readOnly = editor.mode === 'view';
  const title = editor.article ? articleTitle(editor.article.article) : 'Стаття';

  return (
    <>
      <ReferenceEditorDrawer
        titleId="article-drawer-title"
        title={editor.isNew ? 'Нова стаття' : readOnly ? title : 'Стаття'}
        description={
          editor.isNew
            ? 'Стаття буде прихована, доки не ввімкнете «Показувати на сайті». Назва українською обов’язкова, решту можна заповнити пізніше.'
            : readOnly
              ? 'Як стаття виглядає на сайті: дата, адреса, обкладинка, SEO і текст.'
              : `${title}. Тексти заповнюються окремо українською та російською.`
        }
        formId="article-form"
        paperWidth={760}
        readOnly={readOnly}
        saving={editor.saving}
        submitLabel={editor.isNew ? 'Додати' : 'Зберегти'}
        editLabel={viewer.canEdit && editor.article ? 'Редагувати' : null}
        readActions={
          viewer.canDelete &&
          editor.article && (
            <Button type="button" color="error" onClick={editor.askDelete}>
              Видалити статтю
            </Button>
          )
        }
        onClose={onClose}
        onEdit={editor.enableEditing}
        onSubmit={editor.submit}
      >
        <Stack sx={{ gap: 2 }}>
          {editor.loading && <LinearProgress aria-label="Завантаження статті" />}
          {editor.loadError && <Alert severity="error">{editor.loadError}</Alert>}
          {editor.message && <Alert severity="error">{editor.message}</Alert>}
          {editor.values ? (
            <ArticleForm
              values={editor.values}
              errors={editor.errors}
              disabled={editor.saving}
              isNew={editor.isNew}
              onChange={editor.change}
              onPickPhotos={(done) => setPicking({ done })}
            />
          ) : (
            editor.article && <ArticleView article={editor.article} />
          )}
        </Stack>
      </ReferenceEditorDrawer>
      {picking && (
        <MediaPickerDrawer
          alreadyAddedIds={[]}
          onClose={() => setPicking(null)}
          onPick={(files) => {
            setPicking(null);
            picking.done(
              files.map((file) => ({ photoId: file.id, src: file.publicUrl, alt: file.alt ?? '' })),
            );
          }}
        />
      )}
      <ArticleDeleteDialog
        title={editor.confirmingDelete ? title : null}
        deleting={editor.deleting}
        onClose={editor.cancelDelete}
        onConfirm={() => void editor.confirmDelete()}
      />
    </>
  );
}
