import { LeadCallHistory, LeadContactList, LeadInfo, LeadStagePill } from '@admin/leads/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

import type { LeadPanel } from '../../hooks/all/use-lead-panel';

interface Props {
  panel: LeadPanel;
  /** «Дзвонити зараз»: opens the lead in «Мій день». */
  onCall: (id: number) => void;
}

/** Side panel of «Усі ліди» (ReferenceEditorDrawer, like every Admin side panel). */
export function LeadDrawer({ panel, onCall }: Props) {
  if (panel.openId === null) return null;
  const lead = panel.lead;
  const primary = panel.canTake
    ? 'Взяти собі'
    : panel.mine && panel.canRelease
      ? 'Дзвонити зараз'
      : null;

  return (
    <ReferenceEditorDrawer
      titleId="lead-drawer-title"
      title={lead?.company ?? 'Лід'}
      description={
        lead
          ? [lead.region, lead.industry, lead.category && `категорія ${lead.category}`]
              .filter(Boolean)
              .join(' · ') || 'Лід з таблиці «Лиды Brevi»'
          : 'Лід з таблиці «Лиды Brevi»'
      }
      formId="lead-panel"
      paperWidth={560}
      readOnly
      saving={panel.busy}
      editLabel={primary}
      onClose={panel.close}
      onEdit={() => {
        if (!lead) return;
        if (panel.canTake) void panel.take();
        else onCall(lead.id);
      }}
      onSubmit={() => undefined}
    >
      {(panel.error ?? panel.loadError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {panel.error ?? panel.loadError}
        </Alert>
      )}
      {panel.loading || !lead ? (
        !panel.loadError && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} aria-label="Завантаження ліда" />
          </Box>
        )
      ) : (
        <Stack sx={{ gap: 2.5 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <LeadStagePill stage={lead.stage} overdue={lead.isOverdue} />
            <Typography variant="body2" color="text.secondary">
              {lead.owner ? `Веде: ${lead.owner.name}` : 'Вільний лід'}
            </Typography>
          </Stack>
          <LeadContactList lead={lead} />
          <LeadInfo lead={lead} narrow />
          <LeadCallHistory calls={lead.calls} />
          {panel.canRelease && (
            <Box>
              <Button
                color="inherit"
                variant="outlined"
                disabled={panel.busy}
                onClick={() => void panel.release()}
              >
                Повернути у вільні
              </Button>
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
                Відкрита задача «Подзвонити» в «Мої завдання» видалиться.
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </ReferenceEditorDrawer>
  );
}
