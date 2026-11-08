import { supplierLinkHref } from '@admin/references/model';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useId } from 'react';

import type { Supplier } from '@admin/references/model';
import type { ReactNode } from 'react';

/** A row of the extra section, for example a fabric of this supplier in the current КП. */
export interface SupplierViewRelatedRow {
  key: string | number;
  label: string;
  value?: string | null;
}

interface Props {
  supplier: Supplier;
  /** An extra section under the contacts, for example «Тканини цього постачальника в КП». */
  related?: { title: string; rows: readonly SupplierViewRelatedRow[] };
  /** «Відкрити в контрагентах»; left out for those who may not open the supplier there. */
  onOpenInCounterparties?: () => void;
  onClose: () => void;
}

const sectionTitle = {
  fontSize: 12,
  fontWeight: 600,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
} as const;

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : null;
}

function ContactRow({
  icon,
  href,
  external,
  mono,
  accent,
  children,
}: {
  icon: ReactNode;
  href?: string | null;
  external?: boolean;
  mono?: boolean;
  accent?: boolean;
  children: ReactNode;
}) {
  const content = (
    <>
      <Box component="span" sx={{ display: 'flex', color: 'primary.dark' }} aria-hidden>
        {icon}
      </Box>
      <Box
        component="span"
        sx={{
          minWidth: 0,
          overflowWrap: 'anywhere',
          fontFamily: mono ? 'var(--admin-font-mono)' : undefined,
          color: accent ? 'primary.dark' : 'text.primary',
        }}
      >
        {children}
      </Box>
    </>
  );
  const sx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    minHeight: 48,
    px: 1.5,
    borderRadius: 1,
    fontSize: 14,
    textDecoration: 'none',
  } as const;
  return href ? (
    <Link
      href={href}
      underline="none"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      sx={{ ...sx, '&:hover': { bgcolor: 'action.hover' } }}
    >
      {content}
    </Link>
  ) : (
    <Box sx={sx}>{content}</Box>
  );
}

/**
 * The supplier's read-only card, opened from a supplier name anywhere in the admin (CAT-019, КП R-32).
 * Contacts are links: a call, a letter, the supplier's site.
 */
export function SupplierViewPanel({ supplier, related, onOpenInCounterparties, onClose }: Props) {
  const titleId = useId();
  const site = supplierLinkHref(supplier.link);
  const phone = supplier.phoneNumber?.trim();
  const email = supplier.email?.trim();
  const contact = supplier.contactPerson?.trim();
  const categories = supplier.purchaseCategories?.trim();
  const notes = supplier.notes?.trim();
  const hasContacts = Boolean(contact || phone || email || site);

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          sx: { width: { xs: '100%', sm: 440 }, display: 'flex', flexDirection: 'column' },
        },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', px: 3, py: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          Постачальник
        </Typography>
        <IconButton aria-label="Закрити" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
      <Stack spacing={3} sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
        <Stack spacing={1}>
          <Typography
            id={titleId}
            component="h2"
            sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}
          >
            {supplier.name}
          </Typography>
          {categories && (
            <Typography variant="body2" color="text.secondary">
              {categories}
            </Typography>
          )}
          {!supplier.isActive && (
            <Box>
              <Chip size="small" color="warning" label="Не використовується в проєкті" />
            </Box>
          )}
        </Stack>

        <Stack spacing={0.5}>
          <Typography sx={{ ...sectionTitle, pb: 0.5 }}>Зв’язок</Typography>
          {hasContacts ? (
            <>
              {contact && (
                <ContactRow icon={<PersonOutlineOutlinedIcon fontSize="small" />}>
                  {contact}
                </ContactRow>
              )}
              {phone && (
                <ContactRow
                  icon={<PhoneOutlinedIcon fontSize="small" />}
                  href={telHref(phone)}
                  mono
                >
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

        {related && related.rows.length > 0 && (
          <Stack spacing={1}>
            <Typography sx={sectionTitle}>{related.title}</Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {related.rows.map((row) => (
                <Box
                  component="li"
                  key={row.key}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 1,
                    fontSize: 14,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <span>{row.label}</span>
                  {row.value && (
                    <Box
                      component="span"
                      sx={{ fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' }}
                    >
                      {row.value}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Stack>
        )}

        {notes && (
          <Stack spacing={1}>
            <Typography sx={sectionTitle}>Нотатки</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
              {notes}
            </Typography>
          </Stack>
        )}
      </Stack>
      {onOpenInCounterparties && (
        <>
          <Divider />
          <Box sx={{ px: 3, py: 2 }}>
            <Button fullWidth size="large" variant="contained" onClick={onOpenInCounterparties}>
              Відкрити в контрагентах
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
}
