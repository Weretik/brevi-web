import { supplierLinkHref } from '@admin/references/model';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Stack, Typography } from '@mui/material';

import { SupplierContactRow as ContactRow, telHref } from './supplier-contact-row';

import type { Supplier } from '@admin/references/model';

/** The small uppercase title of a supplier card section. */
export const supplierSectionTitle = {
  fontSize: 12,
  fontWeight: 600,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
} as const;

/** «Зв’язок»: the contact person, a call, a letter and the supplier's site, or «Контактів немає». */
export function SupplierContacts({ supplier }: { supplier: Supplier }) {
  const site = supplierLinkHref(supplier.link);
  const phone = supplier.phoneNumber?.trim();
  const email = supplier.email?.trim();
  const contact = supplier.contactPerson?.trim();
  const hasContacts = Boolean(contact || phone || email || site);
  return (
    <Stack spacing={0.5}>
      <Typography sx={{ ...supplierSectionTitle, pb: 0.5 }}>Зв’язок</Typography>
      {hasContacts ? (
        <>
          {contact && (
            <ContactRow icon={<PersonOutlineOutlinedIcon fontSize="small" />}>{contact}</ContactRow>
          )}
          {phone && (
            <ContactRow icon={<PhoneOutlinedIcon fontSize="small" />} href={telHref(phone)} mono>
              {phone}
            </ContactRow>
          )}
          {email && (
            <ContactRow icon={<EmailOutlinedIcon fontSize="small" />} href={`mailto:${email}`}>
              {email}
            </ContactRow>
          )}
          {site && (
            <ContactRow
              icon={<OpenInNewOutlinedIcon fontSize="small" />}
              href={site}
              external
              accent
            >
              Сайт постачальника
            </ContactRow>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Контактів немає.
        </Typography>
      )}
    </Stack>
  );
}
