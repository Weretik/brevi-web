import { Box, Card, Chip, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { numericTextSx } from '../../model/numeric-text';

import type { DeskList } from '../../model/desk-list';

interface DeskListCardProps {
  /** Id prefix of the heading; the card is the region named by it. */
  id: string;
  title: string;
  list: DeskList;
  link: { label: string; to: string };
  /** Shown when the list is empty; without it an empty card is not drawn by the caller. */
  empty?: string;
  /** «І ще N — …» under the rows. */
  moreText?: (more: number) => string;
}

/** A desk block: a short list with problem marks or values and a link to the full section. */
export function DeskListCard({ id, title, list, link, empty, moreText }: DeskListCardProps) {
  const titleId = `${id}-title`;
  return (
    <Card aria-labelledby={titleId} component="section" sx={{ minWidth: 0, p: 2 }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between', mb: 1 }}
      >
        <Typography component="h2" id={titleId} variant="h6">
          {title}
        </Typography>
        <Link
          component={RouterLink}
          sx={{ flex: 'none', fontSize: 13, fontWeight: 700 }}
          to={link.to}
          underline="hover"
        >
          {link.label}
        </Link>
      </Stack>
      {list.rows.length === 0 && empty ? (
        <Typography color="text.secondary" variant="body2">
          {empty}
        </Typography>
      ) : (
        <Stack component="ul" sx={{ m: 0, p: 0 }}>
          {list.rows.map((row) => (
            <Stack
              component="li"
              direction="row"
              key={row.key}
              sx={{
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider',
                gap: 1,
                justifyContent: 'space-between',
                listStyle: 'none',
                py: 0.75,
                '&:last-of-type': { borderBottom: 0 },
              }}
            >
              {row.href ? (
                <Link
                  component={RouterLink}
                  noWrap
                  sx={{ fontSize: 13, minWidth: 0 }}
                  to={row.href}
                  underline="hover"
                >
                  {row.name}
                </Link>
              ) : (
                <Typography noWrap sx={{ minWidth: 0 }} variant="body2">
                  {row.name}
                </Typography>
              )}
              {row.mark ? (
                <Chip
                  color={row.mark.tone}
                  label={row.mark.text}
                  size="small"
                  sx={{ flex: 'none' }}
                />
              ) : (
                row.value && (
                  <Box
                    component="span"
                    sx={{ ...numericTextSx, color: 'text.secondary', flex: 'none', fontSize: 13 }}
                  >
                    {row.value}
                  </Box>
                )
              )}
            </Stack>
          ))}
        </Stack>
      )}
      {list.more > 0 && moreText && (
        <Typography color="text.secondary" component="p" sx={{ mt: 1 }} variant="caption">
          {moreText(list.more)}
        </Typography>
      )}
    </Card>
  );
}
