import { Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

import type { CustomerContact } from '@admin/clients/model';

export interface CustomerContactsProps {
  contacts: readonly CustomerContact[];
  canEdit: boolean;
  onEdit: (contact?: CustomerContact) => void;
}
export function CustomerContacts({ contacts, canEdit, onEdit }: CustomerContactsProps) {
  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h6">
        Контакти
      </Typography>
      {canEdit && <Button onClick={() => onEdit()}>Додати контакт</Button>}
      {!contacts.length && <Typography>Контактів ще немає.</Typography>}
      <List>
        {contacts.map((contact) => (
          <ListItem
            key={contact.publicId}
            sx={{ alignItems: 'flex-start', pr: canEdit ? 12 : 2 }}
            secondaryAction={
              canEdit ? (
                <Button
                  aria-label={`Редагувати контакт ${contact.name}`}
                  onClick={() => onEdit(contact)}
                >
                  Редагувати
                </Button>
              ) : undefined
            }
          >
            <ListItemText
              sx={{ overflowWrap: 'anywhere' }}
              primary={`${contact.name}${contact.isPrimary ? ' · основний' : ''}${!contact.active ? ' · неактивний' : ''}`}
              secondary={[contact.position, ...contact.channels.map((c) => c.value)]
                .filter(Boolean)
                .join(' · ')}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
