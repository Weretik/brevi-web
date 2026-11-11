import { Box, Stack, Typography } from '@mui/material';

import type { SitePage, SitePageText } from '@admin/content/model';

const wordCount = (text: SitePageText) =>
  text.text
    .flatMap((block) => [block.lead ?? '', block.text ?? '', ...block.items])
    .join(' ')
    .replace(/[*\\]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;

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
      <Stack sx={{ gap: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          Основний текст
        </Typography>
        <Typography variant="body2" color={text.text.length ? 'text.primary' : 'text.secondary'}>
          {text.text.length
            ? `${wordCount(text)} слів, ${text.text.length} ${text.text.length === 1 ? 'блок' : 'блоків'}`
            : 'Не вказано: сайт показує свій текст, якщо він є.'}
        </Typography>
      </Stack>
      <Stack sx={{ gap: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          Часті запитання
        </Typography>
        {text.faq.length ? (
          <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
            {text.faq.map((item) => (
              <Typography key={item.question} component="li" variant="body2">
                {item.question}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Не вказано: сайт показує свої, якщо вони є.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

/** Read view of one page of «Сторінки сайту»: its address, the search texts, main text and questions by language. */
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
