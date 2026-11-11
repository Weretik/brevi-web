import { Stack, Typography } from '@mui/material';

import type { SitePage, SitePageText } from '@admin/content/model';

function Language({ title, text }: { title: string; text: SitePageText }) {
  return (
    <Stack sx={{ gap: 0.75 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Stack sx={{ gap: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          Заголовок
        </Typography>
        <Typography variant="body2" color={text.title ? 'text.primary' : 'text.secondary'}>
          {text.title ?? 'Не вказано: сайт показує свій текст.'}
        </Typography>
      </Stack>
      <Stack sx={{ gap: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          Опис
        </Typography>
        <Typography variant="body2" color={text.description ? 'text.primary' : 'text.secondary'}>
          {text.description ?? 'Не вказано: сайт показує свій текст.'}
        </Typography>
      </Stack>
    </Stack>
  );
}

/** Read view of one page of «Сторінки сайту»: its address and the search texts in both languages. */
export function SitePageView({ page }: { page: SitePage }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="body2" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
        /uk{page.path === '/' ? '' : page.path} · /ru{page.path === '/' ? '' : page.path}
      </Typography>
      <Language title="Українською" text={page.texts.uk} />
      <Language title="Російською" text={page.texts.ru} />
      {page.updatedAtUtc && (
        <Typography variant="caption" color="text.secondary">
          Змінено {new Date(page.updatedAtUtc).toLocaleString('uk-UA')}
          {page.updatedBy ? ` · ${page.updatedBy}` : ''}
        </Typography>
      )}
    </Stack>
  );
}
