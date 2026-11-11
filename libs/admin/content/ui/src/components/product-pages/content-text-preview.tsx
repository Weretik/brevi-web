import { Box, Stack, Typography } from '@mui/material';

import type { ContentProductText } from '@admin/content/model';

const empty = (
  <Typography variant="body2" color="text.secondary">
    Не заповнено
  </Typography>
);

function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography component="h4" variant="overline" color="text.secondary">
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/** Texts of one language as the site lays them out: facts, description, characteristics by part. */
export function ContentTextPreview({ text }: { text: ContentProductText }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Part title="Назва на сайті">
        {text.name ? <Typography variant="body1">{text.name}</Typography> : empty}
      </Part>
      <Part title="SEO-заголовок">
        {text.seoTitle ? <Typography variant="body2">{text.seoTitle}</Typography> : empty}
      </Part>
      <Part title="SEO-опис">
        {text.seoDescription ? (
          <Typography variant="body2">{text.seoDescription}</Typography>
        ) : (
          empty
        )}
      </Part>
      <Part title="Короткі відомості">
        {text.summary.length === 0
          ? empty
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
      </Part>
      <Part title="Опис">
        {text.description.length === 0 ? (
          empty
        ) : (
          <Stack sx={{ gap: 1 }}>
            {text.description.map((block, index) =>
              block.kind === 'Heading' ? (
                <Typography key={index} component="p" variant="subtitle2">
                  {block.text}
                </Typography>
              ) : block.kind === 'List' ? (
                <Box key={index} component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {block.items.map((item, line) => (
                    <Typography key={line} component="li" variant="body2">
                      {item}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography key={index} variant="body2">
                  {block.lead && (
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {block.lead}{' '}
                    </Box>
                  )}
                  {block.text}
                </Typography>
              ),
            )}
          </Stack>
        )}
      </Part>
      <Part title="Характеристики">
        {text.specs.length === 0 ? (
          empty
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
      </Part>
    </Stack>
  );
}
