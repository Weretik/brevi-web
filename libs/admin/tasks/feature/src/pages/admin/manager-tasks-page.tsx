import { ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { TaskLoadList, TaskMetricStrip, TasksTable } from '@admin/tasks/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button } from '@mui/material';

import { TaskDrawer } from '../../components/editor/task-drawer';
import { TaskListFilters } from '../../components/list/task-list-filters';
import { TaskNotice } from '../../components/notice/task-notice';
import { useTaskEditor } from '../../hooks/editor/use-task-editor';
import { useTaskList } from '../../hooks/list/use-task-list';
import { useTaskNotice } from '../../hooks/notice/use-task-notice';

import type { TaskViewer } from '@admin/tasks/model';

/**
 * «Адміністрування › Завдання менеджерам» (A1 + workload): Director and Admin set tasks, track
 * them in the table and see each manager's load; a click on a manager filters the page.
 */
export default function ManagerTasksPage({ viewer }: { viewer: TaskViewer }) {
  const notice = useTaskNotice();
  const list = useTaskList();
  const editor = useTaskEditor(viewer, notice.notify);
  const rows = list.page?.items ?? [];

  return (
    <Box>
      <ReferencePageHeader
        overline="Адміністрування"
        title="Завдання менеджерам"
        subtitle="Ставте завдання, стежте за строками та навантаженням менеджерів"
        actions={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => editor.create(list.assigneeUserId)}
          >
            Нове завдання
          </Button>
        }
      />
      <TaskMetricStrip overview={list.overview} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
          gap: 2,
          alignItems: 'start',
          mt: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <ReferenceSearchBar
            placeholder="Знайти завдання за назвою, номером або клієнтом…"
            label="Пошук завдань"
            value={list.search}
            onChange={list.setSearch}
          />
          <TaskListFilters
            filter={list.filter}
            overview={list.overview}
            count={list.page?.total ?? 0}
            onChange={list.setFilter}
          />
          {list.error && (
            <Alert
              severity="error"
              sx={{ mb: 1.5 }}
              action={
                <Button color="inherit" onClick={list.retry}>
                  Повторити
                </Button>
              }
            >
              {list.error}
            </Alert>
          )}
          <TasksTable
            rows={rows}
            rowCount={list.page?.total ?? 0}
            loading={list.loading}
            narrowed={list.narrowed}
            paginationModel={list.pagination}
            onPaginationModelChange={list.setPagination}
            onOpen={editor.open}
          />
        </Box>
        <TaskLoadList
          load={list.load}
          selectedUserId={list.assigneeUserId}
          onSelect={list.setAssignee}
        />
      </Box>
      <TaskDrawer editor={editor} viewer={viewer} />
      <TaskNotice message={notice.message} onClose={notice.close} />
    </Box>
  );
}
