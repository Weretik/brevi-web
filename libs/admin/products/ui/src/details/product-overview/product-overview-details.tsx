import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Link, Stack } from '@mui/material';

import type { ProductOverview } from '@admin/products/model';

interface Props {
  row: ProductOverview;
  sectionName: string | null;
}

export function ProductOverviewDetails({ row, sectionName }: Props) {
  const sewing = row.type === 'Sewing';
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Товар">
        <ReferenceDetailsList
          items={[
            { label: sewing ? 'ID моделі' : 'Артикул сайту', value: row.code, mono: true },
            { label: sewing ? 'Назва моделі' : 'Назва товару', value: row.name },
            { label: sewing ? 'Категорія' : 'Розділ / категорія', value: sectionName },
            ...(sewing ? [{ label: 'Сезон', value: row.season }] : []),
            { label: 'Статус', value: row.isActive ? 'Активний' : 'Вимкнений' },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Для КП">
        {row.currentSiteUrl && (
          <Link
            href={row.currentSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ wordBreak: 'break-all' }}
          >
            {row.currentSiteUrl}
          </Link>
        )}
        <ReferenceDetailsList
          items={[
            ...(row.currentSiteUrl ? [] : [{ label: 'Посилання на сайті', value: null }]),
            { label: 'Короткий опис для КП', value: row.quoteDescription },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
