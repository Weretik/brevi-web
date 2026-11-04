import { Box, Stack, Typography } from '@mui/material';

import { QuoteSettingsCard, QuoteSettingsField, errorsAt } from './quote-settings-fields';

import type { QuoteSettingsErrors, QuoteStaffContactDraft } from '@admin/quotes/model';

interface Props {
  contacts: readonly QuoteStaffContactDraft[];
  errors: QuoteSettingsErrors;
  onChange: (userId: number, patch: Partial<QuoteStaffContactDraft>) => void;
}

/** «Контакти менеджерів у КП»: what the client sees about the responsible manager. */
export function QuoteStaffContactsCard({ contacts, errors, onChange }: Props) {
  return (
    <QuoteSettingsCard
      title="Контакти менеджерів у КП"
      description="Клієнт бачить контакт відповідального менеджера. Порожній телефон чи пошта — беремо з облікового запису."
    >
      <Stack sx={{ gap: 1.5 }}>
        {contacts.map((contact) => {
          const at = errorsAt(errors, `staff:${contact.userId}`);
          return (
            <Box
              key={contact.userId}
              sx={{
                display: 'grid',
                gap: 1.5,
                alignItems: 'start',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {contact.accountName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap component="div">
                  {contact.accountEmail || 'Без пошти'}
                </Typography>
              </Box>
              <QuoteSettingsField
                required
                label="Ім'я в КП"
                value={contact.name}
                error={at('name')}
                onChange={(name) => onChange(contact.userId, { name })}
              />
              <QuoteSettingsField
                label="Телефон"
                value={contact.phone}
                error={at('phone')}
                onChange={(phone) => onChange(contact.userId, { phone })}
              />
              <QuoteSettingsField
                label="Email"
                value={contact.email}
                error={at('email')}
                onChange={(email) => onChange(contact.userId, { email })}
              />
            </Box>
          );
        })}
        {contacts.length === 0 && (
          <Typography color="text.secondary">Немає працівників з доступом до КП.</Typography>
        )}
      </Stack>
    </QuoteSettingsCard>
  );
}
