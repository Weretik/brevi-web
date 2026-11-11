import { redirectSourceLabel } from '@admin/content/model';
import { RedirectDeleteDialog, RedirectForm } from '@admin/content/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { useRedirectEditor } from '../../hooks/redirects/use-redirect-editor';

import type { RedirectsViewer, SiteRedirect } from '@admin/content/model';

interface Props {
  /** The redirect to open; null adds a new one. */
  redirect: SiteRedirect | null;
  viewer: RedirectsViewer;
  onClose: () => void;
  /** Saved or deleted: the panel closes and the list shows the text. */
  onDone: (text: string) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', wordBreak: 'break-all' } as const;

function Field({ label, value, code = false }: { label: string; value: string; code?: boolean }) {
  return (
    <Stack sx={{ gap: 0.25 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={code ? mono : undefined}>
        {value}
      </Typography>
    </Stack>
  );
}

/** One redirect of «Контент → Переадресації» in the «Цех» side panel. */
export function RedirectDrawer({ redirect, viewer, onClose, onDone }: Props) {
  const editor = useRedirectEditor(redirect, onDone);
  const readOnly = editor.values === null;

  return (
    <>
      <ReferenceEditorDrawer
        titleId="redirect-drawer-title"
        title={editor.isNew ? 'Нова переадресація' : 'Переадресація'}
        description="Відвідувач і пошукова система, що відкриють стару адресу, потраплять на нову сторінку (301)."
        formId="redirect-form"
        paperWidth={520}
        readOnly={readOnly}
        saving={editor.saving}
        submitLabel={editor.isNew ? 'Додати' : 'Зберегти'}
        editLabel={viewer.canEdit ? 'Редагувати' : null}
        readActions={
          viewer.canDelete && (
            <Button type="button" color="error" onClick={editor.askDelete}>
              Видалити
            </Button>
          )
        }
        onClose={onClose}
        onEdit={editor.enableEditing}
        onSubmit={editor.submit}
      >
        <Stack sx={{ gap: 2 }}>
          {editor.message && <Alert severity="error">{editor.message}</Alert>}
          {editor.values ? (
            <>
              <RedirectForm
                values={editor.values}
                errors={editor.errors}
                disabled={editor.saving}
                onChange={editor.change}
              />
              {editor.preview?.from && editor.preview.to && (
                <Typography variant="body2" color="text.secondary" sx={mono}>
                  {editor.preview.from} → {editor.preview.to}
                </Typography>
              )}
            </>
          ) : (
            redirect && (
              <>
                <Field label="Стара адреса" value={redirect.fromPath} code />
                <Field label="Нова сторінка" value={redirect.toPath} code />
                <Field label="Звідки" value={redirectSourceLabel(redirect.source)} />
                {redirect.note && <Field label="Примітка" value={redirect.note} />}
                <Field
                  label="Змінено"
                  value={`${new Date(redirect.updatedAtUtc).toLocaleString('uk-UA')} · ${redirect.updatedBy}`}
                />
              </>
            )
          )}
        </Stack>
      </ReferenceEditorDrawer>
      <RedirectDeleteDialog
        fromPath={editor.confirmingDelete && redirect ? redirect.fromPath : null}
        deleting={editor.deleting}
        onClose={editor.cancelDelete}
        onConfirm={() => void editor.confirmDelete()}
      />
    </>
  );
}
