import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';

import { SalesDesk } from '../components/desks/sales-desk';
import { WorkshopDesk } from '../components/desks/workshop-desk';
import { useChosenDesk } from '../hooks/use-chosen-desk';
import { visibleDesks } from '../model/desks';

import type { DashboardViewer } from '../model/dashboard-view';
import type { DeskKey } from '../model/desks';

/** yyyy-mm-dd of the person's own day. */
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

interface DashboardPageProps {
  useViewer: () => DashboardViewer;
}

/**
 * «Робочий стіл» (DESK-001): the desks of «Права доступу» → «Робочі столи» this person may see. One desk opens as it
 * is; several get tabs, and the last chosen tab is remembered.
 */
export default function DashboardPage({ useViewer }: DashboardPageProps) {
  const viewer = useViewer();
  const visible = visibleDesks(viewer.canSee);
  const { current, choose } = useChosenDesk(visible);

  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h4">
        {visible.length === 1 && current ? current.heading : 'Робочий стіл'}
      </Typography>
      {visible.length > 1 && current && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            aria-label="Робочі столи"
            onChange={(_, key: DeskKey) => choose(key)}
            value={current.key}
            variant="scrollable"
          >
            {visible.map((desk) => (
              <Tab
                aria-controls={`desk-panel-${desk.key}`}
                id={`desk-tab-${desk.key}`}
                key={desk.key}
                label={desk.title}
                value={desk.key}
              />
            ))}
          </Tabs>
        </Box>
      )}
      {current ? (
        <Box
          aria-labelledby={visible.length > 1 ? `desk-tab-${current.key}` : undefined}
          id={`desk-panel-${current.key}`}
          role={visible.length > 1 ? 'tabpanel' : undefined}
        >
          {current.key === 'workshop' && <WorkshopDesk viewer={viewer} />}
          {current.key === 'sales' && <SalesDesk today={today()} viewer={viewer} />}
        </Box>
      ) : (
        <Typography color="text.secondary">Оберіть розділ у меню ліворуч.</Typography>
      )}
    </Stack>
  );
}
