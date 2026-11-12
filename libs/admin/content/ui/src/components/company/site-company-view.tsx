import { scheduleText } from '@admin/content/model';
import { Avatar, Box, Link, Stack, Typography } from '@mui/material';

import { SettingsCard, SettingsChangedLine, SettingsField } from '../settings-card/settings-card';

import type { CompanyManager, CompanyText, SiteCompany } from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

function Both({ text }: { text: CompanyText }) {
  return (
    <>
      {text.uk}
      {text.ru !== text.uk && (
        <Typography variant="caption" color="text.secondary" component="div">
          рос.: {text.ru}
        </Typography>
      )}
    </>
  );
}

/** A picture of the library is shown; a picture that stays on the site itself is named. */
export function managerPhotoSrc(url: string | null): string | undefined {
  return url && /^https:\/\//.test(url) ? url : undefined;
}

/** What the map link of the site opens: a Google Maps search for the address. */
export function companyMapUrl(mapQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

function ManagerTile({ manager }: { manager: CompanyManager }) {
  return (
    <Stack
      direction="row"
      sx={{
        gap: 1.5,
        alignItems: 'flex-start',
        p: 1.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        minWidth: 0,
      }}
    >
      <Avatar
        src={managerPhotoSrc(manager.photoUrl)}
        alt={manager.name.uk}
        sx={{ width: 56, height: 56 }}
      >
        {manager.name.uk.slice(0, 1)}
      </Avatar>
      <Stack sx={{ minWidth: 0, gap: 0.25 }}>
        <Typography variant="subtitle2">{manager.name.uk}</Typography>
        {manager.name.ru !== manager.name.uk && (
          <Typography variant="caption" color="text.secondary">
            рос.: {manager.name.ru}
          </Typography>
        )}
        {manager.phones.map((phone) => (
          <Typography key={phone} variant="body2" sx={mono}>
            {phone}
          </Typography>
        ))}
        {manager.email && (
          <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            {manager.email}
          </Typography>
        )}
        {manager.photoUrl && !managerPhotoSrc(manager.photoUrl) && (
          <Typography variant="caption" color="text.secondary">
            Фото з сайту; щоб змінити, оберіть нове з «Фото».
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

/**
 * Read view of «Контакти та компанія»: cards side by side across the page width. Contacts, address and
 * social links in one row, the managers as tiles, then the payment details.
 */
export function SiteCompanyView({ company }: { company: SiteCompany }) {
  const links = [
    ['Instagram', company.socials.instagram],
    ['YouTube', company.socials.youtube],
    ['Facebook', company.socials.facebook],
  ] as const;
  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <SettingsCard title="Звʼязок">
          <Stack sx={{ gap: 2 }}>
            <SettingsField label="Телефон компанії">
              <Box component="span" sx={{ ...mono, fontSize: 22, fontWeight: 600 }}>
                {company.phone}
              </Box>
            </SettingsField>
            <SettingsField label="Пошта">{company.email}</SettingsField>
            <SettingsField label="Графік роботи">{scheduleText(company.schedule)}</SettingsField>
          </Stack>
        </SettingsCard>
        <SettingsCard title="Адреса">
          <Stack sx={{ gap: 2 }}>
            <SettingsField label="Місто">
              <Both text={company.city} />
            </SettingsField>
            <SettingsField label="Вулиця">
              <Both text={company.street} />
            </SettingsField>
            <SettingsField label="Пошук на мапі">
              <Link
                href={companyMapUrl(company.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {company.mapQuery}
              </Link>
            </SettingsField>
          </Stack>
        </SettingsCard>
        <SettingsCard title="Соцмережі">
          <Stack sx={{ gap: 2 }}>
            {links.map(([label, url]) => (
              <SettingsField key={label} label={label}>
                {url ? (
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary" component="span">
                    Без посилання: на сайті лише назва
                  </Typography>
                )}
              </SettingsField>
            ))}
          </Stack>
        </SettingsCard>
      </Box>
      <SettingsCard
        title="Менеджери на сторінці «Контакти»"
        note={company.managers.length > 0 ? `${company.managers.length}` : undefined}
      >
        {company.managers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Менеджерів немає: сторінка «Контакти» покаже лише телефон компанії.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            }}
          >
            {company.managers.map((manager, index) => (
              <ManagerTile key={index} manager={manager} />
            ))}
          </Box>
        )}
      </SettingsCard>
      <SettingsCard title="Реквізити для оплати">
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          <SettingsField label="Отримувач">
            <Both text={company.bankDetails.recipient} />
          </SettingsField>
          <SettingsField label="ЄДРПОУ">
            <Box component="span" sx={mono}>
              {company.bankDetails.edrpou}
            </Box>
          </SettingsField>
          <SettingsField label="IBAN">
            <Box component="span" sx={mono}>
              {company.bankDetails.iban}
            </Box>
          </SettingsField>
          <SettingsField label="Банк">
            <Both text={company.bankDetails.bank} />
          </SettingsField>
        </Box>
      </SettingsCard>
      <SettingsChangedLine at={company.updatedAtUtc} by={company.updatedBy} />
    </Stack>
  );
}
