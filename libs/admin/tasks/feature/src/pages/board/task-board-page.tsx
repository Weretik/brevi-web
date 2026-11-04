import { ReferencePageHeader } from '@admin/references/ui';
import { tasksForToday } from '@admin/tasks/model';
import { TaskBoard, TaskMetricStrip, TaskTodayCard } from '@admin/tasks/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

import { TaskManagerFilter } from '../../components/board/task-manager-filter';
import { TaskDrawer } from '../../components/editor/task-drawer';
import { TaskNotice } from '../../components/notice/task-notice';
import { useTaskBoard } from '../../hooks/board/use-task-board';
import { useTaskEditor } from '../../hooks/editor/use-task-editor';
import { useTaskNotice } from '../../hooks/notice/use-task-notice';

import type { TaskViewer } from '@admin/tasks/model';

/**
 * «Менеджер сервісу › Мої завдання» (K2). A Manager sees own cards; Director and Admin see
 * everyone's, filter by manager and manage tasks right here in the same side panel.
 */
export default function TaskBoardPage({ viewer }: { viewer: TaskViewer }) {
  const notice = useTaskNotice();
  const board = useTaskBoard(viewer, notice.notify);
  const editor = useTaskEditor(viewer, notice.notify);
  const today = tasksForToday(board.tasks, new Date());

  return (
    <Box>
      <ReferencePageHeader
        overline="Менеджер сервісу"
        title="Мої завдання"
        subtitle={
          viewer.isAdmin
            ? 'Дошка завдань усіх менеджерів'
            : 'Перетягніть картку, коли берете завдання в роботу або завершуєте його'
        }
        actions={
          viewer.isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => editor.create(board.assigneeUserId)}
            >
              Нове завдання
            </Button>
          )
        }
      />
      {viewer.isAdmin && (
        <TaskManagerFilter
          assignees={board.assignees}
          selectedUserId={board.assigneeUserId}
          onSelect={board.setAssignee}
        />
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: 2,
          mb: 2,
        }}
      >
        <TaskTodayCard tasks={today} onOpen={editor.open} />
        <TaskMetricStrip overview={board.overview} compact />
      </Box>
      {(board.error ?? board.moveError) && (
        <Alert
          severity="error"
          sx={{ mb: 1.5 }}
          onClose={board.moveError ? board.clearMoveError : undefined}
          action={
            board.error ? (
              <Button color="inherit" onClick={board.retry}>
                Повторити
              </Button>
            ) : undefined
          }
        >
          {board.error ?? board.moveError}
        </Alert>
      )}
      {board.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={28} aria-label="Завантаження дошки" />
        </Box>
      ) : (
        <TaskBoard
          tasks={board.tasks}
          viewer={viewer}
          showAssignee={viewer.isAdmin && board.assigneeUserId === null}
          onOpen={editor.open}
          onMove={board.move}
        />
      )}
      <TaskDrawer editor={editor} viewer={viewer} />
      <TaskNotice message={notice.message} onClose={notice.close} />
    </Box>
  );
}
