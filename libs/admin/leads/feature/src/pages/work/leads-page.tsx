import { ReferencePageHeader } from '@admin/references/ui';
import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { AllLeadsTab } from '../../components/all/all-leads-tab';
import { LeadDrawer } from '../../components/all/lead-drawer';
import { MyDayTab } from '../../components/my-day/my-day-tab';
import { LeadNotice } from '../../components/notice/lead-notice';
import { useAllLeads } from '../../hooks/all/use-all-leads';
import { useLeadPanel } from '../../hooks/all/use-lead-panel';
import { useMyDay } from '../../hooks/my-day/use-my-day';
import { useLeadNotice } from '../../hooks/notice/use-lead-notice';

import type { LeadViewer } from '@admin/leads/model';

type LeadsTab = 'day' | 'all';

export const leadsTabOf = (value: string | null): LeadsTab => (value === 'all' ? 'all' : 'day');

/**
 * «Менеджер сервісу › Ліди» (LEAD-001): «Мій день» is the calling mode of one manager (concept C),
 * «Усі ліди» is where managers take free leads for themselves. `?lead=` opens a lead in «Мій день».
 */
export default function LeadsPage({ viewer }: { viewer: LeadViewer }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = leadsTabOf(searchParams.get('tab'));
  const focus = Number(searchParams.get('lead')) || null;
  const notice = useLeadNotice();
  const myDay = useMyDay(notice.notify, focus);
  const list = useAllLeads(viewer.canEdit ? 'Free' : 'All');
  const panel = useLeadPanel(viewer, notice.notify);

  const show = (next: LeadsTab, lead?: number) =>
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === 'all') params.set('tab', 'all');
        else params.delete('tab');
        if (lead) params.set('lead', String(lead));
        else params.delete('lead');
        return params;
      },
      { replace: true },
    );

  return (
    <>
      <ReferencePageHeader
        overline="Менеджер сервісу · обдзвін"
        title={tab === 'day' ? 'Мій день' : 'Усі ліди'}
        subtitle={
          tab === 'day'
            ? myDay.day
              ? `У плані ${myDay.day.plannedToday} дзвінків, зроблено ${myDay.day.callsToday}`
              : 'Ваша черга дзвінків на сьогодні'
            : 'Ліди з таблиці «Лиды Brevi»: візьміть вільні собі, і вони з’являться в «Мій день»'
        }
        actions={null}
      />
      <Tabs
        value={tab}
        onChange={(_event, value: LeadsTab) => show(value)}
        aria-label="Розділи лідів"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="day" label="Мій день" />
        <Tab value="all" label="Усі ліди" />
      </Tabs>
      {tab === 'day' ? (
        <MyDayTab
          myDay={myDay}
          canEdit={viewer.canEdit}
          onFindMore={() => {
            list.setScope('Free');
            show('all');
          }}
        />
      ) : (
        <AllLeadsTab list={list} onOpen={panel.open} />
      )}
      <LeadDrawer
        panel={panel}
        onCall={(id) => {
          panel.close();
          myDay.select(id);
          show('day', id);
        }}
      />
      <LeadNotice message={notice.message} onClose={notice.close} />
    </>
  );
}
