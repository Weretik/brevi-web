import { scheduleText } from '@admin/content/model';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';

import type { CompanyText, SiteCompany } from '@admin/content/model';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack sx={{ gap: 0.25, minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" component="div" sx={{ overflowWrap: 'anywhere' }}>
        {children}
      </Typography>
    </Stack>
  );
}

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}

/** A picture of the library is shown; a picture that stays on the site itself is named. */
export function managerPhotoSrc(url: string | null): string | undefined {
  return url && /^https:\/\//.test(url) ? url : undefined;
}

/** Read view of «Контакти та компанія». */
export function SiteCompanyView({ company }: { company: SiteCompany }) {
  const links = [
    ['Instagram', company.socials.instagram],
    ['YouTube', company.socials.youtube],
    ['Facebook', company.socials.facebook],
  ] as const;
  return (
    <Stack sx={{ gap: 3 }} divider={<Divider flexItem />}>
      <Section title="Звʼязок і адреса">
        <Field label="Телефон компанії">{company.phone}</Field>
        <Field label="Пошта">{company.email}</Field>
        <Field label="Місто">
          <Both text={company.city} />
        </Field>
        <Field label="Вулиця">
          <Both text={company.street} />
        </Field>
        <Field label="Пошук на мапі">{company.mapQuery}</Field>
        <Field label="Графік роботи">{scheduleText(company.schedule)}</Field>
      </Section>
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant="subtitle2">Менеджери на сторінці «Контакти»</Typography>
        {company.managers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Менеджерів немає: сторінка «Контакти» покаже лише телефон компанії.
          </Typography>
        ) : (
          company.managers.map((manager, index) => (
            <Stack key={index} direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <Avatar
                src={managerPhotoSrc(manager.photoUrl)}
                alt={manager.name.uk}
                sx={{ width: 48, height: 48 }}
              >
                {manager.name.uk.slice(0, 1)}
              </Avatar>
              <Stack sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {manager.name.uk}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[...manager.phones, manager.email].filter(Boolean).join(' · ')}
                </Typography>
                {manager.photoUrl && !managerPhotoSrc(manager.photoUrl) && (
                  <Typography variant="caption" color="text.secondary">
                    Фото з сайту; щоб змінити, оберіть нове з «Фото».
                  </Typography>
                )}
              </Stack>
            </Stack>
          ))
        )}
      </Stack>
      <Section title="Реквізити для оплати">
        <Field label="Отримувач">
          <Both text={company.bankDetails.recipient} />
        </Field>
        <Field label="ЄДРПОУ">{company.bankDetails.edrpou}</Field>
        <Field label="IBAN">{company.bankDetails.iban}</Field>
        <Field label="Банк">
          <Both text={company.bankDetails.bank} />
        </Field>
      </Section>
      <Section title="Соцмережі">
        {links.map(([label, url]) => (
          <Field key={label} label={label}>
            {url ?? (
              <Typography variant="body2" color="text.secondary" component="span">
                Без посилання: на сайті лише назва
              </Typography>
            )}
          </Field>
        ))}
      </Section>
      {company.updatedAtUtc && (
        <Typography variant="caption" color="text.secondary">
          Змінено {new Date(company.updatedAtUtc).toLocaleString('uk-UA')}
          {company.updatedBy ? ` · ${company.updatedBy}` : ''}
        </Typography>
      )}
    </Stack>
  );
}
