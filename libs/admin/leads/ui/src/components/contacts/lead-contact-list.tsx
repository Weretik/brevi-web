import { parseLeadContacts } from '@admin/leads/model';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Button, Stack, Typography } from '@mui/material';

import { mono } from '../mono';

import type { LeadDetail } from '@admin/leads/model';

interface Props {
  lead: Pick<LeadDetail, 'contacts' | 'email'>;
  /** «Мій день» shows the first phone as the big orange call button. */
  callFirst?: boolean;
}

const icons = { phone: PhoneOutlinedIcon, email: EmailOutlinedIcon, link: LinkOutlinedIcon };

/** «Открытый контакт» and the mail column as buttons that call, mail or open. */
export function LeadContactList({ lead, callFirst = false }: Props) {
  const contacts = parseLeadContacts(lead.contacts, lead.email);
  if (!contacts.length)
    return (
      <Typography variant="body2" color="text.secondary">
        Контактів у таблиці немає
      </Typography>
    );
  const firstPhone = callFirst ? contacts.findIndex((x) => x.kind === 'phone') : -1;

  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
      {contacts.map((contact, index) => {
        if (!contact.href || contact.kind === 'text')
          return (
            <Typography key={contact.text} variant="body2" color="text.secondary">
              {contact.text}
            </Typography>
          );
        const Icon = icons[contact.kind];
        const main = index === firstPhone;
        return (
          <Button
            key={contact.text}
            href={contact.href}
            target={contact.kind === 'link' ? '_blank' : undefined}
            rel={contact.kind === 'link' ? 'noreferrer' : undefined}
            variant={main ? 'contained' : 'outlined'}
            color={main ? 'primary' : 'inherit'}
            startIcon={<Icon />}
            sx={{
              ...(contact.kind === 'phone' ? mono : {}),
              height: main ? 52 : 36,
              px: main ? 2.5 : 1.5,
              fontSize: main ? 16 : 13,
              textTransform: 'none',
              maxWidth: '100%',
            }}
          >
            {contact.text}
          </Button>
        );
      })}
    </Stack>
  );
}
