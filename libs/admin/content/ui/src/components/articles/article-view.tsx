import { articleDateLabel, articleProblems } from '@admin/content/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../product-pages/content-language-tabs';
import { ContentBlocksPreview, ContentPreviewPart } from '../product-pages/content-text-preview';

import type {
  Article,
  ArticleBlock,
  ContentLanguage,
  ContentTextBlock,
} from '@admin/content/model';

const isText = (block: ArticleBlock): block is ArticleBlock & ContentTextBlock =>
  block.kind !== 'Image';

/**
 * A picture at its own proportions: the panel's column would otherwise stretch it to the full width
 * while the height stays capped.
 */
const picture = (maxHeight: number) =>
  ({
    borderRadius: 1,
    display: 'block',
    alignSelf: 'flex-start',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight,
    objectFit: 'contain',
  }) as const;

/** The body as the site lays it out: text blocks with the photos between them. */
function ArticleBodyPreview({ article, blocks }: { article: Article; blocks: ArticleBlock[] }) {
  if (blocks.length === 0) return <ContentBlocksPreview blocks={[]} />;
  const urls = new Map(article.photos.map((photo) => [photo.id, photo.url]));
  return (
    <Stack sx={{ gap: 1 }}>
      {blocks.map((block, index) => {
        if (isText(block)) return <ContentBlocksPreview key={index} blocks={[block]} />;
        const url = block.photoId === null ? undefined : urls.get(block.photoId);
        return url ? (
          <Box key={index} component="img" src={url} alt={block.alt ?? ''} sx={picture(220)} />
        ) : (
          <Typography key={index} variant="body2" sx={{ color: 'warning.dark' }}>
            Фото видалено з бібліотеки «Фото»: сайт його не покаже.
          </Typography>
        );
      })}
    </Stack>
  );
}

/** Read-only side of the panel: the address, date and cover of the article and its texts in both languages. */
export function ArticleView({ article }: { article: Article }) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const row = article.article;
  const problems = articleProblems(row);
  const text = article[language];
  const cover = article.photos.find((photo) => photo.id === article.coverPhotoId);
  const lostCover = article.coverPhotoId !== null && !cover;

  return (
    <Stack sx={{ gap: 2 }}>
      {problems.length > 0 && (
        <Alert severity="warning">
          Сайту бракує: {problems.map((problem) => problem.toLowerCase()).join('; ')}.
        </Alert>
      )}
      {lostCover && (
        <Alert severity="warning">
          Обкладинку видалено з бібліотеки «Фото». Оберіть іншу в «Редагувати».
        </Alert>
      )}
      <ReferenceFormSection title="Стаття">
        {cover && <Box component="img" src={cover.url} alt="Обкладинка статті" sx={picture(240)} />}
        <ReferenceDetailsList
          items={[
            { label: 'Показувати на сайті', value: row.showOnSite ? 'Так' : 'Ні' },
            { label: 'Дата', value: articleDateLabel(row.publishedOn), mono: true },
            { label: 'Адреса', value: `/articles/${row.slug}`, mono: true },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Тексти">
        <ContentLanguageTabs value={language} onChange={setLanguage} />
        <Stack sx={{ gap: 2 }}>
          <ContentPreviewPart title="Назва" text={text.title} />
          <ContentPreviewPart title="Короткий опис" text={text.excerpt} />
          <ContentPreviewPart title="SEO-заголовок" text={text.seoTitle} />
          <ContentPreviewPart title="SEO-опис" text={text.seoDescription} />
          <ContentPreviewPart title="Текст статті">
            <ArticleBodyPreview article={article} blocks={text.body} />
          </ContentPreviewPart>
        </Stack>
      </ReferenceFormSection>
    </Stack>
  );
}
