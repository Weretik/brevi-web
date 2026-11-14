import { Box, Stack, Typography } from '@mui/material';

import { ContentBlocksPreview } from '../text-preview/content-blocks-preview';
import { contentPreviewEmpty } from '../text-preview/content-preview-empty';
import { ContentPreviewPart } from '../text-preview/content-preview-part';

import type { ContentProductText } from '@admin/content/model';

/** Texts of one language as the site lays them out: facts, description, characteristics by part. */
export function ContentTextPreview({ text }: { text: ContentProductText }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ContentPreviewPart title="Назва на сайті">
        {text.name ? <Typography variant="body1">{text.name}</Typography> : contentPreviewEmpty}
      </ContentPreviewPart>
      <ContentPreviewPart title="SEO-заголовок">
        {text.seoTitle ? (
          <Typography variant="body2">{text.seoTitle}</Typography>
        ) : (
          contentPreviewEmpty
        )}
      </ContentPreviewPart>
      <ContentPreviewPart title="SEO-опис">
        {text.seoDescription ? (
          <Typography variant="body2">{text.seoDescription}</Typography>
        ) : (
          contentPreviewEmpty
        )}
      </ContentPreviewPart>
      <ContentPreviewPart title="Короткі відомості">
        {text.summary.length === 0
          ? contentPreviewEmpty
          : text.summary.map((fact, index) => (
              <Typography key={index} variant="body2">
                {fact.label && (
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {fact.label}:{' '}
                  </Box>
                )}
                {fact.text}
              </Typography>
            ))}
      </ContentPreviewPart>
      <ContentPreviewPart title="Опис">
        <ContentBlocksPreview blocks={text.description} />
      </ContentPreviewPart>
      <ContentPreviewPart title="Характеристики">
        {text.specs.length === 0 ? (
          contentPreviewEmpty
        ) : (
          <Stack sx={{ gap: 1.5 }}>
            {text.specs.map((group, index) => (
              <Box key={index}>
                {group.title && (
                  <Typography component="p" variant="subtitle2">
                    {group.title}
                  </Typography>
                )}
                <Box
                  component="dl"
                  sx={{
                    m: 0,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
                    columnGap: 2,
                    rowGap: 0.5,
                  }}
                >
                  {group.rows.map((row, line) => (
                    <Box key={line} sx={{ display: 'contents' }}>
                      <Typography component="dt" variant="body2" color="text.secondary">
                        {row.name}
                      </Typography>
                      <Typography component="dd" variant="body2" sx={{ m: 0 }}>
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </ContentPreviewPart>
    </Stack>
  );
}
