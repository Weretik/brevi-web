import {
  LeadCallForm,
  LeadCallHeader,
  LeadCallHistory,
  LeadInfo,
  LeadQueue,
} from '@admin/leads/ui';
import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';

import type { MyDay } from '../../hooks/my-day/use-my-day';

interface Props {
  myDay: MyDay;
  canEdit: boolean;
  onFindMore: () => void;
}

function Loading({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress size={28} aria-label={label} />
    </Box>
  );
}

/** «Мій день»: the queue on the left, the lead being called on the right. */
export function MyDayTab({ myDay, canEdit, onFindMore }: Props) {
  if (myDay.error)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={myDay.retry}>
            Повторити
          </Button>
        }
      >
        {myDay.error}
      </Alert>
    );
  if (myDay.loading || !myDay.day) return <Loading label="Завантаження «Мій день»" />;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr)' },
        gap: 2,
        alignItems: 'start',
      }}
    >
      <LeadQueue
        day={myDay.day}
        currentId={myDay.currentId}
        now={myDay.now}
        onSelect={myDay.select}
        onFindMore={onFindMore}
      />
      <Paper
        variant="outlined"
        component="article"
        aria-label="Поточний дзвінок"
        sx={{ p: { xs: 2, md: 3 }, display: 'grid', gap: 2.25, minWidth: 0 }}
      >
        {myDay.currentId === null ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="h2" component="h2" sx={{ fontSize: 20, mb: 1 }}>
              Черга порожня
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Візьміть собі вільних лідів, і вони з’являться тут.
            </Typography>
            {myDay.day.free > 0 && (
              <Button variant="contained" onClick={onFindMore}>
                Набрати вільних лідів
              </Button>
            )}
          </Box>
        ) : myDay.leadError ? (
          <Alert severity="error">{myDay.leadError}</Alert>
        ) : !myDay.lead ? (
          <Loading label="Завантаження ліда" />
        ) : (
          <>
            <LeadCallHeader lead={myDay.lead} />
            <LeadInfo lead={myDay.lead} />
            {myDay.saveError && <Alert severity="error">{myDay.saveError}</Alert>}
            {canEdit && myDay.lead.owner ? (
              <LeadCallForm
                company={myDay.lead.company}
                results={myDay.results}
                values={myDay.values}
                errors={myDay.errors}
                showErrors={myDay.showErrors}
                saving={myDay.saving}
                now={myDay.now}
                onChange={myDay.change}
                onSubmit={() => void myDay.submit()}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Записувати дзвінки може менеджер, якому дано право редагувати «Ліди».
              </Typography>
            )}
            <LeadCallHistory calls={myDay.lead.calls} />
          </>
        )}
      </Paper>
    </Box>
  );
}
