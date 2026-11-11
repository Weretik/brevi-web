import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { AccountingDesk } from '../components/desks/accounting-desk';
import { MainDesk } from '../components/desks/main-desk';
import { SalesDesk } from '../components/desks/sales-desk';
import { SeoDesk } from '../components/desks/seo-desk';
import { WorkshopDesk } from '../components/desks/workshop-desk';
import { useChosenDesk } from '../hooks/use-chosen-desk';
import { useOpenDesks } from '../hooks/use-open-desks';
import { visibleDesks } from '../model/desks';

import type { DashboardViewer } from '../model/dashboard-view';
import type { DeskDefinition, DeskKey } from '../model/desks';

/** yyyy-mm-dd of the person's own day. */
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

interface DashboardPageProps {
  useViewer: () => DashboardViewer;
}

function Desk({ deskKey, viewer }: { deskKey: DeskKey; viewer: DashboardViewer }) {
  switch (deskKey) {
    case 'main':
      return <MainDesk today={today()} viewer={viewer} />;
    case 'workshop':
      return <WorkshopDesk viewer={viewer} />;
    case 'sales':
      return <SalesDesk today={today()} viewer={viewer} />;
    case 'seo':
      return <SeoDesk viewer={viewer} />;
    case 'accounting':
      return <AccountingDesk today={today()} viewer={viewer} />;
  }
}

/** The main desk with every other desk folded under it; an unfolded desk is remembered and loads only when open. */
function MainWithFoldedDesks({
  others,
  viewer,
}: {
  others: DeskDefinition[];
  viewer: DashboardViewer;
}) {
  const { isOpen, toggle } = useOpenDesks();
  return (
    <Stack spacing={2}>
      <Desk deskKey="main" viewer={viewer} />
      {others.map((desk) => (
        <Accordion
          disableGutters
          expanded={isOpen(desk.key)}
          key={desk.key}
          onChange={() => toggle(desk.key)}
          slotProps={{ transition: { unmountOnExit: true } }}
          variant="outlined"
        >
          <AccordionSummary
            aria-controls={`desk-panel-${desk.key}`}
            expandIcon={<ExpandMoreIcon />}
            id={`desk-fold-${desk.key}`}
          >
            <Typography component="h2" variant="h6">
              {desk.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails id={`desk-panel-${desk.key}`}>
            <Desk deskKey={desk.key} viewer={viewer} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
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
        <MainWithFoldedDesks
          others={visible.filter((desk) => desk.key !== 'main')}
          viewer={viewer}
        />
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
