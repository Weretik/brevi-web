import { useGetEmbroideryFormQuery } from '@admin/embroidery/data-access';
import { ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { EmbroideryCalculationTab } from '../components/calculation/embroidery-calculation-tab';
import { EmbroideryLeaveDialog } from '../components/settings/embroidery-leave-dialog';
import { EmbroiderySettingsTab } from '../components/settings/embroidery-settings-tab';
import { useEmbroideryCalculation } from '../hooks/calculation/use-embroidery-calculation';
import { useEmbroideryLeaveGuard } from '../hooks/settings/use-embroidery-leave-guard';
import { useEmbroiderySettingsEditor } from '../hooks/settings/use-embroidery-settings-editor';
import { embroideryTabOf } from '../model/embroidery-viewer';

import type { EmbroideryTab, EmbroideryViewer } from '../model/embroidery-viewer';
import type { EmbroideryFormSetup } from '@admin/embroidery/model';

const dateOf = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('uk-UA', { dateStyle: 'short' }) : null;

/** «Менеджер сервісу › Ціна вишивки» (`/crm/embroidery`): Manager, Director and Admin. */
export default function EmbroideryPricePage({ viewer }: { viewer: EmbroideryViewer }) {
  const form = useGetEmbroideryFormQuery();

  if (form.isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження розрахунку" />
      </Box>
    );
  if (!form.data)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={() => void form.refetch()}>
            Повторити
          </Button>
        }
      >
        {(form.error as { message?: string } | undefined)?.message ??
          'Не вдалося відкрити розрахунок.'}
      </Alert>
    );
  return <EmbroideryPriceContent setup={form.data} viewer={viewer} />;
}

function EmbroideryPriceContent({
  setup,
  viewer,
}: {
  setup: EmbroideryFormSetup;
  viewer: EmbroideryViewer;
}) {
  const [search, setSearch] = useSearchParams();
  const tab = embroideryTabOf(search, viewer);
  const calculator = useEmbroideryCalculation(setup);
  const canEdit = viewer.canEditSettings && setup.seesCost;
  const setTab = (next: EmbroideryTab) =>
    setSearch(next === 'settings' ? { tab: 'settings' } : {}, { replace: true });
  const since = dateOf(setup.settingsUpdatedAt);

  return (
    <Box>
      <ReferencePageHeader
        overline="Калькулятор"
        title="Ціна вишивки"
        subtitle={`${since ? `Ставки від ${since} · ` : ''}рахує одну вишивку або партію шевронів`}
        actions={
          tab === 'calculation' ? (
            <Button variant="outlined" onClick={calculator.clear}>
              Очистити форму
            </Button>
          ) : null
        }
      />
      {canEdit && (
        <Tabs
          value={tab}
          onChange={(_event, next: EmbroideryTab) => setTab(next)}
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="calculation" label="Розрахунок" />
          <Tab value="settings" label="Налаштування" />
        </Tabs>
      )}
      <Box hidden={tab !== 'calculation'}>
        <EmbroideryCalculationTab
          calculator={calculator}
          seesCost={setup.seesCost}
          onOpenSettings={() => setTab('settings')}
        />
      </Box>
      {canEdit && (
        <Box hidden={tab !== 'settings'}>
          <EmbroiderySettingsArea />
        </Box>
      )}
    </Box>
  );
}

/** Mounted once and kept while the tab is hidden, so typed changes survive a look at «Розрахунок». */
function EmbroiderySettingsArea() {
  const editor = useEmbroiderySettingsEditor();
  const blocker = useEmbroideryLeaveGuard(editor.dirty);
  return (
    <>
      <EmbroiderySettingsTab editor={editor} />
      <EmbroideryLeaveDialog blocker={blocker} />
    </>
  );
}
