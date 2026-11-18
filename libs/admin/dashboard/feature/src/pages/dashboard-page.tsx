import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';

import { FoldedDesks } from '../components/desk-list/folded-desks';
import { Desk } from '../components/desks/desk';
import { useChosenDesk } from '../hooks/use-chosen-desk';
import { visibleDesks } from '../model/desks/desks';

import type { DashboardViewer } from '../model/desk-views/dashboard-view';
import type { DeskKey } from '../model/desks/desks';

interface DashboardPageProps {
  useViewer: () => DashboardViewer;
}

/**
 * «Робочий стіл» (DESK-001): the desks of «Права доступу» → «Робочі столи» this person may see. With the main desk
 * (director, administrators) the other desks fold under it; otherwise one desk opens as it is and several get tabs,
 * the last chosen tab remembered.
 */
export default function DashboardPage({ useViewer }: DashboardPageProps) {
  const viewer = useViewer();
  const visible = visibleDesks(viewer.canSee);
  const withMain = visible.some((desk) => desk.key === 'main');
  const { current, choose } = useChosenDesk(visible);

  if (withMain)
    return (
      <Stack spacing={2}>
        <Typography component="h1" variant="h4">
          Робочий стіл
        </Typography>
        <FoldedDesks others={visible.filter((desk) => desk.key !== 'main')} viewer={viewer} />
      </Stack>
    );

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
          <Desk deskKey={current.key} viewer={viewer} />
        </Box>
      ) : (
        <Typography color="text.secondary">Оберіть розділ у меню ліворуч.</Typography>
      )}
    </Stack>
  );
}
