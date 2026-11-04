import { ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { TaskLoadTable, TaskMetricStrip, TasksTable } from '@admin/tasks/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, Chip, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { TaskDrawer } from '../../components/editor/task-drawer';
import { TaskListFilters } from '../../components/list/task-list-filters';
import { TaskNotice } from '../../components/notice/task-notice';
import { useTaskEditor } from '../../hooks/editor/use-task-editor';
import { useTaskList } from '../../hooks/list/use-task-list';
import { useTaskNotice } from '../../hooks/notice/use-task-notice';

import type { TaskViewer } from '@admin/tasks/model';

type PageTab = 'tasks' | 'load';

/**
 * «Адміністрування › Завдання менеджерам»: tab «Завдання» (A1, table on the full width) and tab
 * «Навантаження» (L3, a row per manager); a click on a manager opens «Завдання» filtered to them.
 */
export default function ManagerTasksPage({ viewer }: { viewer: TaskViewer }) {
  const notice = useTaskNotice();
  const list = useTaskList();
  const editor = useTaskEditor(viewer, notice.notify);
  const [tab, setTab] = useState<PageTab>('tasks');
  const rows = list.page?.items ?? [];
  const selected = list.load.find((row) => row.userId === list.assigneeUserId);

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, value: PageTab) => setTab(value)}
          aria-label="Розділи сторінки"
        >
          <Tab value="tasks" label="Завдання" />
          <Tab value="load" label="Навантаження" />
        </Tabs>
      </Box>
      {tab === 'tasks' ? (
        <>
          <TaskMetricStrip overview={list.overview} />
          <Box sx={{ mt: 2 }}>
            <ReferenceSearchBar
              placeholder="Знайти завдання за назвою, номером або клієнтом…"
              label="Пошук завдань"
              value={list.search}
              onChange={list.setSearch}
            />
          </Box>
          {list.assigneeUserId !== null && (
            <Chip
              label={`Менеджер: ${selected?.name ?? 'обраний'}`}
              onDelete={() => list.setAssignee(null)}
              sx={{ mb: 1.5, fontWeight: 600 }}
            />
          )}
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
        </>
      ) : (
        <TaskLoadTable
          load={list.load}
          loading={list.loadLoading}
          onOpen={(userId) => {
            list.setAssignee(userId);
            setTab('tasks');
          }}
        />
      )}
      <TaskDrawer editor={editor} viewer={viewer} />
      <TaskNotice message={notice.message} onClose={notice.close} />
    </Box>
  );
}
