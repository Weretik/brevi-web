import { Card, Stack, Typography } from '@mui/material';

import type { AdminOnlyItem } from '@admin/users/model';

interface AccessAdminOnlyCardProps {
  items: readonly AdminOnlyItem[];
}

/** «Тільки адміністратор»: what no role can be given, so nothing in the admin stays unseen. */
export function AccessAdminOnlyCard({ items }: AccessAdminOnlyCardProps) {
  if (items.length === 0) return null;
  return (
    <Card
      component="section"
      aria-labelledby="access-admin-only-title"
      sx={{ p: 2 }}
      variant="outlined"
    >
      <Typography component="h2" id="access-admin-only-title" variant="h6">
        Тільки адміністратор
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1 }} variant="body2">
        Ці сторінки й дії відкриває лише роль «Адміністратор» і директор. Іншим ролям їх не видати.
      </Typography>
      <Stack component="ul" sx={{ gap: 0.75, m: 0, pl: 2.5 }}>
        {items.map((item) => (
          <Typography component="li" key={`${item.group}/${item.title}`} variant="body2">
            <strong>{item.title}</strong>
            <Typography component="span" sx={{ color: 'text.secondary' }} variant="body2">
              {` · ${item.group}. ${item.reason}`}
            </Typography>
          </Typography>
        ))}
      </Stack>
    </Card>
  );
}
