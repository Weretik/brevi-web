import { Box, Button, Stack, Typography } from '@mui/material';

import { QuoteSettingsCard, QuoteSettingsField, errorsAt } from './quote-settings-fields';

import type { QuoteSettingsErrors, QuoteStaffContactDraft } from '@admin/quotes/model';

interface Props {
  contacts: readonly QuoteStaffContactDraft[];
  errors: QuoteSettingsErrors;
  /** Why Gmail buttons are off (unsaved changes, a request in progress); null when they work. */
  mailboxLock: string | null;
  onChange: (userId: number, patch: Partial<QuoteStaffContactDraft>) => void;
  onConnect: (userId: number) => void;
  onDisconnect: (userId: number) => void;
}

function GmailCell({
  contact,
  lock,
  onConnect,
  onDisconnect,
}: {
  contact: QuoteStaffContactDraft;
  lock: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const connected = Boolean(contact.mailboxEmail);
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" component="div">
        Gmail для надсилання
      </Typography>
      {connected && (
        <Typography variant="body2" noWrap title={contact.mailboxEmail}>
          {contact.mailboxEmail}
        </Typography>
      )}
      <Button
        size="small"
        variant={connected ? 'text' : 'outlined'}
        color={connected ? 'inherit' : 'primary'}
        disabled={Boolean(lock)}
        onClick={connected ? onDisconnect : onConnect}
        aria-label={`${connected ? 'Відключити Gmail' : 'Підключити Gmail'}: ${contact.accountName}`}
        sx={{ mt: 0.5 }}
      >
        {connected ? 'Відключити' : 'Підключити Gmail'}
      </Button>
      {lock && (
        <Typography variant="caption" color="text.secondary" component="div">
          {lock}
        </Typography>
      )}
    </Box>
  );
}

/** «Контакти менеджерів у КП»: what the client sees about the responsible manager. */
export function QuoteStaffContactsCard({
  contacts,
  errors,
  mailboxLock,
  onChange,
  onConnect,
  onDisconnect,
}: Props) {
  return (
    <QuoteSettingsCard
      title="Контакти менеджерів у КП"
      description="Клієнт бачить контакт відповідального менеджера. Порожній телефон чи пошта — беремо з облікового запису. КП надсилаються з Gmail того, хто натискає «Надіслати»: його підключають один раз, людина сама входить у свою пошту Google."
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
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr 1fr' },
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
              <GmailCell
                contact={contact}
                lock={mailboxLock}
                onConnect={() => onConnect(contact.userId)}
                onDisconnect={() => onDisconnect(contact.userId)}
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
