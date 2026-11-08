import { ReferencePageHeader } from '@admin/references/ui';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Button, CircularProgress, Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { LeadNotice } from '../../components/notice/lead-notice';
import { ReferenceDrawer } from '../../components/references/reference-drawer';
import { ReferencesTab } from '../../components/references/references-tab';
import { SummaryTab } from '../../components/stats/summary-tab';
import { useLeadNotice } from '../../hooks/notice/use-lead-notice';
import { useLeadReferences } from '../../hooks/references/use-lead-references';
import { useLeadStats } from '../../hooks/stats/use-lead-stats';

import type { LeadStatsViewer } from '@admin/leads/model';

type StatsTab = 'summary' | 'references';

export const leadStatsTabOf = (value: string | null): StatsTab =>
  value === 'references' ? 'references' : 'summary';

/**
 * «Адміністрування › Ліди» (LEAD-001): «Зведення» and «Довідники» shared by every manager, and
 * «Синхронізувати зараз» for whoever has the create right of the page (Director and Admin by default).
 */
export default function LeadStatsPage({ viewer }: { viewer: LeadStatsViewer }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = leadStatsTabOf(searchParams.get('tab'));
  const notice = useLeadNotice();
  const stats = useLeadStats(notice.notify);
  const references = useLeadReferences(notice.notify);

  const syncButton = viewer.canSync && (
    <Button
      variant="contained"
      startIcon={
        stats.syncing ? <CircularProgress color="inherit" size={16} /> : <SyncOutlinedIcon />
      }
      disabled={stats.syncing}
      onClick={() => void stats.sync()}
    >
      {stats.syncing ? 'Синхронізую…' : 'Синхронізувати зараз'}
    </Button>
  );

  return (
    <>
      <ReferencePageHeader
        overline="Адміністрування"
        title="Ліди"
        subtitle="Зведення і довідники обдзвону замість листів «Сводка» і «Справочники»"
        actions={syncButton}
      />
      <Tabs
        value={tab}
        onChange={(_event, value: StatsTab) =>
          setSearchParams(value === 'references' ? { tab: value } : {}, { replace: true })
        }
        aria-label="Розділи статистики лідів"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="summary" label="Зведення" />
        <Tab value="references" label="Довідники" />
      </Tabs>
      {tab === 'summary' ? (
        <SummaryTab state={stats} />
      ) : (
        <ReferencesTab references={references} canEdit={viewer.canEdit} />
      )}
      <ReferenceDrawer references={references} />
      <LeadNotice message={notice.message} onClose={notice.close} />
    </>
  );
}
