import { Avatar, Box, Button, Stack, Typography } from '@mui/material';

import { quoteSettingsProblemsLabel } from '../form/quote-settings-layout';

import type { QuoteSettingsErrors, QuoteStaffContactDraft } from '@admin/quotes/model';

interface Props {
  contacts: readonly QuoteStaffContactDraft[];
  errors: QuoteSettingsErrors;
  /** A Gmail request is running. */
  mailboxBusy: boolean;
  onEdit: (userId: number) => void;
  onConnect: (userId: number) => void;
  onDisconnect: (userId: number) => void;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** A contact value, or the account one in grey when the field is empty. */
function ContactValue({ value, fallback }: { value: string; fallback: string }) {
  return value.trim() ? (
    <span>{value}</span>
  ) : (
    <Box component="span" sx={{ color: 'text.disabled' }}>
      {fallback ? `${fallback} · з акаунта` : 'телефон з акаунта'}
    </Box>
  );
}

/** «Менеджери і Gmail»: what the client sees of each manager; fields open in a side panel. */
export function QuoteManagersSection({
  contacts,
  errors,
  mailboxBusy,
  onEdit,
  onConnect,
  onDisconnect,
}: Props) {
  if (contacts.length === 0)
    return <Typography color="text.secondary">Немає працівників з доступом до КП.</Typography>;
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      {contacts.map((contact, index) => {
        const problems = Object.keys(errors).filter((path) =>
          path.startsWith(`staff:${contact.userId}.`),
        ).length;
        const connected = Boolean(contact.mailboxEmail);
        return (
          <Stack
            key={contact.userId}
            direction="row"
            sx={{
              gap: 1.5,
              px: 2,
              py: 1.5,
              alignItems: 'center',
              flexWrap: 'wrap',
              borderTop: index === 0 ? 0 : 1,
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              sx={{ gap: 1.5, alignItems: 'center', flex: '1 1 260px', minWidth: 0 }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                {initials(contact.name || contact.accountName)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }} noWrap>
                  {contact.name || contact.accountName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  <ContactValue value={contact.phone} fallback="" />
                  {' · '}
                  <ContactValue value={contact.email} fallback={contact.accountEmail} />
                </Typography>
              </Box>
            </Stack>
            <Stack
              direction="row"
              sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', ml: 'auto' }}
            >
              {problems > 0 && (
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  {quoteSettingsProblemsLabel(problems)}
                </Typography>
              )}
              {connected ? (
                <>
                  <Typography variant="body2" sx={{ maxWidth: 220 }} noWrap>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      Gmail:{' '}
                    </Box>
                    {contact.mailboxEmail}
                  </Typography>
                  <Button
                    size="small"
                    disabled={mailboxBusy}
                    aria-label={`Відключити Gmail: ${contact.accountName}`}
                    onClick={() => onDisconnect(contact.userId)}
                  >
                    Відключити
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={mailboxBusy}
                  aria-label={`Підключити Gmail: ${contact.accountName}`}
                  onClick={() => onConnect(contact.userId)}
                >
                  Підключити Gmail
                </Button>
              )}
              <Button
                size="small"
                aria-label={`Змінити контакт: ${contact.accountName}`}
                onClick={() => onEdit(contact.userId)}
              >
                Змінити
              </Button>
            </Stack>
          </Stack>
        );
      })}
    </Box>
  );
}
