import { companyMapUrl, scheduleText } from '@admin/content/model';
import { Box, Link, Stack, Typography } from '@mui/material';

import { CompanyTextBoth } from './company-text-both';
import { SiteCompanyManagerTile } from './site-company-manager-tile';
import { mono } from './site-company-styles';
import { SettingsCard, SettingsChangedLine, SettingsField } from '../settings-card/settings-card';

import type { SiteCompany } from '@admin/content/model';

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
              <CompanyTextBoth text={company.city} />
            </SettingsField>
            <SettingsField label="Вулиця">
              <CompanyTextBoth text={company.street} />
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
              <SiteCompanyManagerTile key={index} manager={manager} />
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
            <CompanyTextBoth text={company.bankDetails.recipient} />
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
            <CompanyTextBoth text={company.bankDetails.bank} />
          </SettingsField>
        </Box>
      </SettingsCard>
      <SettingsChangedLine at={company.updatedAtUtc} by={company.updatedBy} />
    </Stack>
  );
}
