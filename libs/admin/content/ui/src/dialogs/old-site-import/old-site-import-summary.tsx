import { Alert, Box, Stack, Typography } from '@mui/material';

import type { OldSiteImportCopy } from './old-site-import-copy';
import type { OldSiteImportNote, OldSiteImportReport } from '@admin/content/model';

function Notes({ title, notes }: { title: string; notes: OldSiteImportNote[] }) {
  if (notes.length === 0) return null;
  return (
    <Alert severity="warning">
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {title}: {notes.length}
      </Typography>
      <Box component="ul" aria-label={title} sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
        {notes.map((note) => (
          <li key={note.url}>
            <Typography variant="body2">
              {note.name ?? note.url}: {note.reason}
            </Typography>
          </li>
        ))}
      </Box>
    </Alert>
  );
}

/** What the transfer would do or did: counts, pages without their product and failures. */
export function OldSiteImportSummary({
  copy,
  report,
  done,
  productLinks,
  photos,
}: {
  copy: OldSiteImportCopy;
  report: OldSiteImportReport;
  done: boolean;
  productLinks: number | null;
  photos: number | null;
}) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      {done && <Alert severity="success">{copy.done}</Alert>}
      <Typography variant="body2" role="status">
        {copy.total}: {report.total} · {done ? 'Створено' : 'Буде створено'}: {report.created} ·{' '}
        {done ? 'Замінено' : 'Буде замінено'}: {report.updated} · Залишено без змін: {report.kept}
        {productLinks !== null &&
          ` · ${done ? 'Додано товарів у розділи' : 'Буде додано товарів у розділи'}: ${productLinks}`}
        {photos !== null && ` · ${done ? 'Перенесено фото' : 'Буде перенесено фото'}: ${photos}`}
      </Typography>
      <Notes title={copy.notMatched} notes={report.notMatched} />
      <Notes title="Не вдалося перенести" notes={report.problems} />
    </Stack>
  );
}
