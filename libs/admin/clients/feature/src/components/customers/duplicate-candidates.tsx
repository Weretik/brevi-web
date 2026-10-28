import { useListCustomersQuery } from '@admin/clients/data-access';
import { Alert, Button, List, ListItem, ListItemText, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { customerError } from '../../errors/customer-error';

export function DuplicateCandidates({ term, currentId }: { term: string; currentId?: string }) {
  const result = useListCustomersQuery({ page: 1, pageSize: 10, search: term });
  const navigate = useNavigate();
  if (result.isLoading) return <Alert severity="info">Перевіряємо схожих клієнтів…</Alert>;
  if (result.error)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void result.refetch()}>Повторити</Button>}
      >
        {customerError(result.error)}
      </Alert>
    );
  const rows = result.currentData?.rows.filter((row) => row.publicId !== currentId) ?? [];
  return (
    <Stack spacing={1}>
      <Alert severity="info">
        Збіг назви або реквізитів — привід перевірити запис. Автоматичного об’єднання немає.
      </Alert>
      {!rows.length && (
        <Alert severity="success">У доступній області схожих клієнтів не знайдено.</Alert>
      )}
      <List>
        {rows.map((row) => (
          <ListItem
            key={row.publicId}
            secondaryAction={
              <Button onClick={() => navigate(`/crm/clients/${row.publicId}`)}>Відкрити</Button>
            }
          >
            <ListItemText
              primary={row.displayName}
              secondary={row.taxIdentity ?? (row.active ? 'Активний' : 'Неактивний')}
            />
          </ListItem>
        ))}
      </List>
      {!!result.currentData && result.currentData.total > 10 && (
        <Alert severity="warning">
          Знайдено більше 10 записів. Уточніть реквізити або скористайтеся пошуком у списку
          клієнтів.
        </Alert>
      )}
    </Stack>
  );
}
