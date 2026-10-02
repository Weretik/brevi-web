import { Box, Stack, TextField, Typography } from '@mui/material';

import { ProductMarkdown } from '../../product-content/product-markdown';

import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
}

export function ProductDescriptionFields({ draft, setDraft, errors }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Опис двома мовами</Typography>
      <TextField
        label="Опис українською (Markdown)"
        value={draft.descriptionUk}
        onChange={(event) =>
          setDraft((current) => ({ ...current, descriptionUk: event.target.value }))
        }
        error={Boolean(errors['descriptionUk'])}
        helperText={errors['descriptionUk']}
        multiline
        minRows={4}
        required
      />
      <TextField
        label="Опис російською (Markdown)"
        value={draft.descriptionRu}
        onChange={(event) =>
          setDraft((current) => ({ ...current, descriptionRu: event.target.value }))
        }
        error={Boolean(errors['descriptionRu'])}
        helperText={errors['descriptionRu']}
        multiline
        minRows={4}
        required
      />
      <Typography variant="subtitle1">Попередній перегляд опису</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography>Українська</Typography>
          <ProductMarkdown text={draft.descriptionUk} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography>Російська</Typography>
          <ProductMarkdown text={draft.descriptionRu} />
        </Box>
      </Stack>
    </Stack>
  );
}
