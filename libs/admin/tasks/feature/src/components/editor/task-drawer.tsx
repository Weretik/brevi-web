import { ReferenceEditorDrawer } from '@admin/references/ui';
import { TaskDeleteDialog, TaskDetails, TaskFormFields } from '@admin/tasks/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

import type { TaskEditor } from '../../hooks/editor/use-task-editor';
import type { TaskViewer } from '@admin/tasks/model';

interface Props {
  editor: TaskEditor;
  viewer: TaskViewer;
}

function title(editor: TaskEditor): string {
  if (editor.mode?.kind === 'create') return 'Нове завдання';
  const number = editor.task?.number ?? 'Завдання';
  return editor.mode?.kind === 'edit' ? `Редагування ${number}` : number;
}

function description(editor: TaskEditor, viewer: TaskViewer): string {
  if (editor.mode?.kind === 'create') return 'Оберіть менеджера, строк і що треба зробити.';
  if (editor.mode?.kind === 'edit') return 'Зміни побачить менеджер, вони потраплять в історію.';
  return viewer.isAdmin
    ? 'Статус, кроки та історія завдання.'
    : 'Відмічайте кроки та змінюйте статус, коли берете або завершуєте роботу.';
}

/** Side panel of both task pages (ReferenceEditorDrawer, like every Admin side panel). */
export function TaskDrawer({ editor, viewer }: Props) {
  if (!editor.mode) return null;
  const reading = editor.mode.kind === 'view';
  const task = editor.task;

  return (
    <>
      <ReferenceEditorDrawer
        titleId="task-drawer-title"
        title={title(editor)}
        description={description(editor, viewer)}
        formId="task-form"
        paperWidth={520}
        readOnly={reading}
        saving={editor.saving}
        submitLabel={editor.mode.kind === 'create' ? 'Поставити завдання' : 'Зберегти'}
        editLabel={viewer.isAdmin && task ? 'Редагувати' : null}
        onClose={editor.close}
        onEdit={editor.edit}
        onSubmit={editor.submit}
      >
        {(editor.error ?? editor.loadError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {editor.error ?? editor.loadError}
          </Alert>
        )}
        {reading ? (
          editor.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} aria-label="Завантаження завдання" />
            </Box>
          ) : (
            task && (
              <>
                <TaskDetails
                  task={task}
                  busy={editor.busy}
                  onStatus={editor.setStatus}
                  onStep={editor.setStep}
                />
                {viewer.isAdmin && (
                  <Button
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={editor.askDelete}
                    sx={{ mt: 3 }}
                  >
                    Видалити завдання
                  </Button>
                )}
              </>
            )
          )
        ) : (
          <TaskFormFields
            values={editor.values}
            errors={editor.errors}
            showErrors={editor.showErrors}
            disabled={editor.saving}
            assignees={editor.assignees}
            customers={editor.customers}
            onCustomerSearch={editor.searchCustomers}
            onChange={editor.change}
          />
        )}
      </ReferenceEditorDrawer>
      {editor.confirmingDelete && task && (
        <TaskDeleteDialog
          title={`${task.number} ${task.title}`}
          busy={editor.deleting}
          onCancel={editor.cancelDelete}
          onConfirm={() => void editor.confirmDelete()}
        />
      )}
    </>
  );
}
