import { Alert, Button, Chip, List, ListItem, Stack, Typography } from '@mui/material';

import type { EmailTemplateSummaryView } from '@admin/clients/model';

export function EmailTemplateVersionsList({
  rows,
  activeId,
  disabled,
  onSelect,
}: {
  rows: readonly EmailTemplateSummaryView[];
  activeId?: string;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  if (!rows.length) return <Alert severity="info">Шаблонів листів ще немає.</Alert>;
  return (
    <List aria-label="Версії шаблонів листів">
      {rows.map((row) => (
        <ListItem key={row.id} divider>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: '100%', alignItems: { sm: 'center' } }}
          >
            <Stack sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ overflowWrap: 'anywhere' }}>
                {row.label} · Версія {row.number}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                {row.subject}
              </Typography>
            </Stack>
            {row.id === activeId && <Chip label="Активна" color="success" size="small" />}
            <Button
              disabled={disabled}
              onClick={() => onSelect(row.id)}
              aria-label={`Переглянути версію ${row.number}`}
            >
              Переглянути
            </Button>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}
