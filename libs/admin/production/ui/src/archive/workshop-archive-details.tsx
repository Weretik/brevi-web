import { formatDay } from '@admin/production/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link, Stack } from '@mui/material';

import type { WorkshopArchiveRow } from '@admin/production/model';

/** A line of «Архів цеху» as the old book kept it; nothing here can be changed. */
export function WorkshopArchiveDetails({ row }: { row: WorkshopArchiveRow }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Запис">
        <ReferenceDetailsList
          items={[
            {
              label: 'Дата',
              value: row.date ? formatDay(row.date) : row.dateText,
              mono: true,
            },
            { label: '№', value: row.number, mono: true },
            { label: 'Замовник', value: row.client },
            { label: 'Виріб', value: row.product },
            { label: 'Кількість', value: row.quantity, mono: true },
            { label: 'Тканина', value: row.fabric },
            ...(row.status ? [{ label: 'Стан', value: row.status }] : []),
            ...(row.notes ? [{ label: 'Примітки', value: row.notes }] : []),
            { label: 'Рядок у старій таблиці', value: String(row.sourceRow), mono: true },
          ]}
        />
      </ReferenceFormSection>
      {row.fields.length > 0 && (
        <ReferenceFormSection title="Інші поля">
          <ReferenceDetailsList
            items={row.fields.map((field) => ({ label: field.label, value: field.value }))}
          />
        </ReferenceFormSection>
      )}
      {row.links.length > 0 && (
        <ReferenceFormSection title="Посилання">
          <Stack sx={{ gap: 1 }}>
            {row.links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                {link.label}
                <OpenInNewIcon fontSize="inherit" />
              </Link>
            ))}
          </Stack>
        </ReferenceFormSection>
      )}
    </Stack>
  );
}
